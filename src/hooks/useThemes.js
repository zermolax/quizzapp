/**
 * useThemes.js - Custom Hook pentru gestionarea temelor
 *
 * Returnează themes cu counters actualizați în timp real.
 *
 * Counters calculate automat din Firestore:
 * - questionsCount: număr întrebări publicate per temă
 *
 * Usage:
 * const { themes, loading, error } = useThemes(subjectSlug);
 */

import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';

export function useThemes(subjectSlug) {
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchThemes() {
      if (!subjectSlug) {
        setThemes([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // 1. Fetch themes for this subject
        const themesRef = collection(db, 'themes');
        const themesQuery = query(
          themesRef,
          where('subjectId', '==', subjectSlug),
          where('isPublished', '==', true)
        );
        const themesSnapshot = await getDocs(themesQuery);

        // 2. Fetch questions for this subject
        const questionsRef = collection(db, 'questions');
        const questionsQuery = query(
          questionsRef,
          where('subjectId', '==', subjectSlug),
          where('isPublished', '==', true)
        );
        const questionsSnapshot = await getDocs(questionsQuery);

        console.log('🔍 Questions found:', questionsSnapshot.docs.length);
        if (questionsSnapshot.docs.length > 0) {
          const sampleQuestion = questionsSnapshot.docs[0].data();
          console.log('🔍 Sample question:', sampleQuestion);
        }

        // 3. Calculate question counters per theme
        const themeCounters = {};
        questionsSnapshot.docs.forEach(doc => {
          const question = doc.data();
          const themeId = question.themeId;

          console.log('🔍 Question themeId:', themeId, 'for question:', question.question?.substring(0, 50));

          if (themeId) {
            if (!themeCounters[themeId]) {
              themeCounters[themeId] = 0;
            }
            themeCounters[themeId] += 1;
          }
        });

        console.log('📊 Theme Counters:', themeCounters);

        // 4. Merge themes with counters
        const enrichedThemes = themesSnapshot.docs.map(doc => {
          const themeData = doc.data();
          const themeId = doc.id;

          return {
            id: themeId,
            slug: themeId,
            ...themeData,
            questionsCount: themeCounters[themeId] || 0,
          };
        });

        // 5. Sort by order
        const sortedThemes = enrichedThemes.sort((a, b) => (a.order || 0) - (b.order || 0));

        console.log('✅ Enriched Themes:', sortedThemes);

        setThemes(sortedThemes);
      } catch (err) {
        console.error('❌ Error in useThemes:', err);
        setError('Eroare la încărcarea tematicilor. Te rugăm să încerci din nou.');
      } finally {
        setLoading(false);
      }
    }

    fetchThemes();
  }, [subjectSlug]);

  return {
    themes,
    loading,
    error,
  };
}

export default useThemes;
