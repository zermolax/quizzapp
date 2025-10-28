/**
 * updateSubjectStats.js
 *
 * Calculează și actualizează stats-urile pentru fiecare subject:
 * - totalThemes: numărul de teme published pentru subject
 * - totalQuestions: numărul total de întrebări pentru subject
 *
 * RULARE: node scripts/updateSubjectStats.js
 */

import { db } from '../src/services/firebase.js';
import { collection, getDocs, doc, updateDoc, query, where } from 'firebase/firestore';

async function updateSubjectStats() {
  console.log('🚀 Pornire actualizare stats pentru subjects...\n');

  try {
    // 1. Fetch all subjects
    const subjectsRef = collection(db, 'subjects');
    const subjectsSnapshot = await getDocs(subjectsRef);

    console.log(`📚 Găsite ${subjectsSnapshot.size} subjects\n`);

    for (const subjectDoc of subjectsSnapshot.docs) {
      const subjectId = subjectDoc.id;
      const subjectData = subjectDoc.data();

      console.log(`📖 Processing: ${subjectData.name} (${subjectId})`);

      // 2. Count themes for this subject
      const themesQuery = query(
        collection(db, 'themes'),
        where('subjectId', '==', subjectId),
        where('isPublished', '==', true)
      );
      const themesSnapshot = await getDocs(themesQuery);
      const totalThemes = themesSnapshot.size;

      // 3. Count questions for this subject
      const questionsQuery = query(
        collection(db, 'questions'),
        where('subjectId', '==', subjectId)
      );
      const questionsSnapshot = await getDocs(questionsQuery);
      const totalQuestions = questionsSnapshot.size;

      // 4. Update subject document
      const subjectDocRef = doc(db, 'subjects', subjectId);
      await updateDoc(subjectDocRef, {
        totalThemes,
        totalQuestions
      });

      console.log(`   ✅ Updated: ${totalThemes} teme, ${totalQuestions} întrebări\n`);
    }

    console.log('✨ SUCCES! Toate stats-urile au fost actualizate!\n');
    process.exit(0);

  } catch (error) {
    console.error('❌ EROARE:', error);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

// Rulează funcția
updateSubjectStats();
