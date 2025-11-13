/**
 * useSubjects.js - Custom Hook pentru gestionarea disciplinelor
 *
 * Combină datele statice din SUBJECTS_CONFIG cu datele dinamice din Firestore.
 * Returnează subjects cu metadate complete + counters actualizate în timp real.
 *
 * Counters calculate automat din Firestore:
 * - themesCount: număr teme publicate per disciplină
 * - questionsCount: număr întrebări publicate per disciplină
 *
 * Usage:
 * const { subjects, loading, error, refreshSubjects } = useSubjects();
 */

import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import { SUBJECTS_CONFIG, getActiveSubjects } from '../constants/subjects';
import { logger } from '../utils/logger';

export function useSubjects({ activeOnly = false } = {}) {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Get base config (static metadata)
      const baseConfig = activeOnly ? getActiveSubjects() : SUBJECTS_CONFIG;

      // 2. Fetch subjects from Firestore
      const subjectsRef = collection(db, 'subjects');
      const q = query(subjectsRef, where('isPublished', '==', true));
      const snapshot = await getDocs(q);

      // 3. Create map of Firestore data
      const firestoreData = {};
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        firestoreData[doc.id] = {
          ...data,
          id: doc.id,
        };
      });

      // 4. Fetch ALL themes to calculate theme counters
      const themesRef = collection(db, 'themes');
      const themesQuery = query(themesRef, where('isPublished', '==', true));
      const themesSnapshot = await getDocs(themesQuery);

      // 5. Fetch ALL questions to calculate question counters
      const questionsRef = collection(db, 'questions');
      // Remove isPublished filter since questions might not have this field
      const questionsQuery = query(questionsRef);
      const questionsSnapshot = await getDocs(questionsQuery);

      // 6. Calculate counters per subject
      const subjectCounters = {};

      // Count themes per subject
      themesSnapshot.docs.forEach(doc => {
        const theme = doc.data();
        const subjectId = theme.subjectId || 'istorie'; // Default to 'istorie' for legacy data

        if (!subjectCounters[subjectId]) {
          subjectCounters[subjectId] = {
            themesCount: 0,
            questionsCount: 0,
          };
        }

        subjectCounters[subjectId].themesCount += 1;
      });

      // Count questions per subject
      questionsSnapshot.docs.forEach(doc => {
        const question = doc.data();
        const subjectId = question.subjectId || 'istorie'; // Default to 'istorie' for legacy data

        if (!subjectCounters[subjectId]) {
          subjectCounters[subjectId] = {
            themesCount: 0,
            questionsCount: 0,
          };
        }

        subjectCounters[subjectId].questionsCount += 1;
      });

      logger.debug('📊 Subject Counters:', subjectCounters);

      // 7. Merge static config with Firestore data + calculated counters
      const enrichedSubjects = baseConfig.map(config => {
        const firestoreSubject = firestoreData[config.id] || firestoreData[config.slug];
        const counters = subjectCounters[config.id] || subjectCounters[config.slug] || {};

        return {
          ...config, // Static metadata (icon, descriptions, color)
          ...firestoreSubject, // Firestore data (if exists)
          // Use calculated counters (always up-to-date from Firestore)
          themesCount: counters.themesCount || 0,
          questionsCount: counters.questionsCount || 0,
          totalThemes: counters.themesCount || 0, // Backward compatibility
          totalQuestions: counters.questionsCount || 0, // Backward compatibility
          // Keep original config values for fallback
          icon: config.icon,
          color: config.color,
          descriptions: config.descriptions,
        };
      });

      // 8. Sort by order
      const sortedSubjects = enrichedSubjects.sort((a, b) => (a.order || 0) - (b.order || 0));

      logger.debug('✅ Enriched Subjects:', sortedSubjects);

      setSubjects(sortedSubjects);
    } catch (err) {
      logger.error('❌ Error in useSubjects:', err);
      setError('Eroare la încărcarea disciplinelor. Te rugăm să încerci din nou.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, [activeOnly]);

  return {
    subjects,
    loading,
    error,
    refreshSubjects: fetchSubjects,
  };
}

/**
 * Hook pentru a prelua o singură disciplină
 */
export function useSubject(subjectSlug) {
  const { subjects, loading, error } = useSubjects();
  const subject = subjects.find(s => s.slug === subjectSlug);

  return {
    subject,
    loading,
    error,
  };
}

export default useSubjects;
