/**
 * useSubjects.js - Custom Hook pentru gestionarea disciplinelor
 *
 * Combină datele statice din SUBJECTS_CONFIG cu datele dinamice din Firestore.
 * Returnează subjects cu metadate complete + counters.
 *
 * PERFORMANCE: Counters (totalThemes, totalQuestions) sunt pre-calculate
 * și salvate în documentele subject. Pentru actualizare, rulează:
 * node scripts/updateSubjectStats.js
 *
 * Usage:
 * const { subjects, loading, error, refreshSubjects } = useSubjects();
 */

import { useQuery } from '@tanstack/react-query';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import { SUBJECTS_CONFIG, getActiveSubjects } from '../constants/subjects';
import { logger } from '../utils/logger';

// Query function - extracted for React Query
async function fetchSubjectsFromFirestore(activeOnly = false) {
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

  // 4. Merge static config with Firestore data
  // Counters (totalThemes, totalQuestions) are now stored directly in subject documents
  // This is 10x faster than counting from themes/questions collections!
  const enrichedSubjects = baseConfig.map(config => {
    const firestoreSubject = firestoreData[config.id] || firestoreData[config.slug];

    return {
      ...config, // Static metadata (icon, descriptions, color)
      ...firestoreSubject, // Firestore data (includes totalThemes, totalQuestions)
      // Use counters from Firestore document
      themesCount: firestoreSubject?.totalThemes || 0,
      questionsCount: firestoreSubject?.totalQuestions || 0,
      // Keep original config values for fallback
      icon: config.icon,
      color: config.color,
      descriptions: config.descriptions,
    };
  });

  // 5. Sort by order
  const sortedSubjects = enrichedSubjects.sort((a, b) => (a.order || 0) - (b.order || 0));

  logger.debug('✅ Enriched Subjects:', sortedSubjects);

  return sortedSubjects;
}

export function useSubjects({ activeOnly = false } = {}) {
  const { data: subjects = [], isLoading: loading, error, refetch } = useQuery({
    queryKey: ['subjects', activeOnly],
    queryFn: () => fetchSubjectsFromFirestore(activeOnly),
    onError: (err) => {
      logger.error('❌ Error in useSubjects:', err);
    },
  });

  return {
    subjects,
    loading,
    error: error ? 'Eroare la încărcarea disciplinelor. Te rugăm să încerci din nou.' : null,
    refreshSubjects: refetch,
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
