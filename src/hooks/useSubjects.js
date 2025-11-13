/**
 * useSubjects.js - Custom Hook pentru gestionarea disciplinelor
 *
 * Combină datele statice din SUBJECTS_CONFIG cu datele dinamice din Firestore.
 * Returnează subjects cu metadate complete + counters actualizate.
 *
 * Usage:
 * const { subjects, loading, error, refreshSubjects } = useSubjects();
 */

import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import { SUBJECTS_CONFIG, getActiveSubjects } from '../constants/subjects';

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

      // 4. Merge static config with Firestore data
      const enrichedSubjects = baseConfig.map(config => {
        const firestoreSubject = firestoreData[config.id] || firestoreData[config.slug];

        return {
          ...config, // Static metadata (icon, descriptions, color)
          ...firestoreSubject, // Firestore data (totalThemes, totalQuestions)
          // Ensure these fields exist
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

      setSubjects(sortedSubjects);
    } catch (err) {
      console.error('❌ Error in useSubjects:', err);
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
