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

import { useQuery } from '@tanstack/react-query';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import { logger } from '../utils/logger';

// Query function - extracted for React Query
async function fetchThemesFromFirestore(subjectSlug) {
  if (!subjectSlug) {
    return [];
  }

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

  logger.debug('🔍 Querying questions for subjectId:', subjectSlug);

  // Fetch questions for this subject
  const questionsQuery = query(
    questionsRef,
    where('subjectId', '==', subjectSlug)
  );
  const questionsSnapshot = await getDocs(questionsQuery);

  logger.debug('🔍 Questions found:', questionsSnapshot.docs.length);

  // 3. Calculate question counters per theme
  const themeCounters = {};
  questionsSnapshot.docs.forEach(doc => {
    const question = doc.data();
    const themeId = question.themeId;

    if (themeId) {
      if (!themeCounters[themeId]) {
        themeCounters[themeId] = 0;
      }
      themeCounters[themeId] += 1;
    }
  });

  logger.debug('📊 Theme Counters:', themeCounters);

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

  logger.debug('✅ Enriched Themes:', sortedThemes);

  return sortedThemes;
}

export function useThemes(subjectSlug) {
  const { data: themes = [], isLoading: loading, error } = useQuery({
    queryKey: ['themes', subjectSlug],
    queryFn: () => fetchThemesFromFirestore(subjectSlug),
    enabled: !!subjectSlug, // Only run query if subjectSlug exists
    onError: (err) => {
      logger.error('❌ Error in useThemes:', err);
    },
  });

  return {
    themes,
    loading,
    error: error ? 'Eroare la încărcarea tematicilor. Te rugăm să încerci din nou.' : null,
  };
}

export default useThemes;
