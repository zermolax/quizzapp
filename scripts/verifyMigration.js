/**
 * verifyMigration.js
 *
 * Script pentru verificarea migrației complete
 * Verifică că TOATE documentele au câmpul subjectId
 *
 * RULARE: node scripts/verifyMigration.js
 */

import { db } from '../src/services/firebase.js';
import { collection, getDocs, query, where } from 'firebase/firestore';

/**
 * Funcția principală de verificare
 */
async function verifyMigration() {
  console.log('🔍 Pornire verificare migrație...\n');

  try {
    // 1. Verifică SUBJECTS collection
    console.log('📚 Verificare colecție SUBJECTS:');
    const subjectsRef = collection(db, 'subjects');
    const subjectsSnapshot = await getDocs(subjectsRef);

    console.log(`   ✅ Găsite ${subjectsSnapshot.size} materii`);
    subjectsSnapshot.docs.forEach(doc => {
      const data = doc.data();
      console.log(`      - ${data.name} (${doc.id}) ${data.isPublished ? '✅' : '📝'}`);
    });
    console.log('');

    // 2. Verifică THEMES collection
    console.log('🎨 Verificare colecție THEMES:');
    const themesRef = collection(db, 'themes');
    const themesSnapshot = await getDocs(themesRef);

    const themesWithoutSubject = themesSnapshot.docs.filter(
      doc => !doc.data().subjectId
    );

    console.log(`   📊 Total teme:                ${themesSnapshot.size}`);
    console.log(`   ✅ Cu subjectId:              ${themesSnapshot.size - themesWithoutSubject.length}`);
    console.log(`   ❌ Fără subjectId:            ${themesWithoutSubject.length}`);

    if (themesWithoutSubject.length > 0) {
      console.log('\n   ⚠️  Teme fără subjectId:');
      themesWithoutSubject.forEach(doc => {
        const data = doc.data();
        console.log(`      - ${data.name || doc.id}`);
      });
    }
    console.log('');

    // 3. Verifică QUESTIONS collection
    console.log('❓ Verificare colecție QUESTIONS:');
    const questionsRef = collection(db, 'questions');
    const questionsSnapshot = await getDocs(questionsRef);

    const questionsWithoutSubject = questionsSnapshot.docs.filter(
      doc => !doc.data().subjectId
    );

    console.log(`   📊 Total întrebări:           ${questionsSnapshot.size}`);
    console.log(`   ✅ Cu subjectId:              ${questionsSnapshot.size - questionsWithoutSubject.length}`);
    console.log(`   ❌ Fără subjectId:            ${questionsWithoutSubject.length}`);

    if (questionsWithoutSubject.length > 0) {
      console.log('\n   ⚠️  Întrebări fără subjectId (primele 10):');
      questionsWithoutSubject.slice(0, 10).forEach(doc => {
        const data = doc.data();
        console.log(`      - Theme: ${data.themeId}, ID: ${doc.id.substring(0, 8)}...`);
      });
      if (questionsWithoutSubject.length > 10) {
        console.log(`      ... și încă ${questionsWithoutSubject.length - 10} întrebări`);
      }
    }
    console.log('');

    // 4. Verifică breakdown per subject
    console.log('📊 Breakdown per materie:');

    // Themes by subject
    const themesBySubject = {};
    themesSnapshot.docs.forEach(doc => {
      const subjectId = doc.data().subjectId || 'undefined';
      themesBySubject[subjectId] = (themesBySubject[subjectId] || 0) + 1;
    });

    // Questions by subject
    const questionsBySubject = {};
    questionsSnapshot.docs.forEach(doc => {
      const subjectId = doc.data().subjectId || 'undefined';
      questionsBySubject[subjectId] = (questionsBySubject[subjectId] || 0) + 1;
    });

    Object.keys(themesBySubject).forEach(subjectId => {
      console.log(`   ${subjectId}:`);
      console.log(`      - Teme: ${themesBySubject[subjectId]}`);
      console.log(`      - Întrebări: ${questionsBySubject[subjectId] || 0}`);
    });
    console.log('');

    // 5. Raport final
    console.log('='.repeat(60));
    console.log('🎯 RAPORT FINAL');
    console.log('='.repeat(60));

    const allMigrated =
      themesWithoutSubject.length === 0 &&
      questionsWithoutSubject.length === 0;

    if (allMigrated) {
      console.log('✅ MIGRARE 100% COMPLETĂ!');
      console.log('');
      console.log('   📚 Subjects:   ✅ ' + subjectsSnapshot.size + ' materii create');
      console.log('   🎨 Themes:     ✅ ' + themesSnapshot.size + ' teme migrate');
      console.log('   ❓ Questions:  ✅ ' + questionsSnapshot.size + ' întrebări migrate');
      console.log('');
      console.log('➡️  URMĂTORUL PAS: Actualizează codul React');
      console.log('   - Update App.jsx cu nested routes');
      console.log('   - Creează SubjectSelection page');
      console.log('   - Update ThemeSelection pentru subjectSlug');
      console.log('');
      console.log('⚠️  NU UITA: Revert Firebase Security Rules la versiunea securizată!');
    } else {
      console.log('⚠️  MIGRARE INCOMPLETĂ!');
      console.log('');
      console.log('   Rulează din nou scripturile de migrare:');
      if (themesWithoutSubject.length > 0) {
        console.log('   - node scripts/migrateThemesToSubjects.js');
      }
      if (questionsWithoutSubject.length > 0) {
        console.log('   - node scripts/migrateQuestionsToSubjects.js');
      }
    }

    console.log('='.repeat(60) + '\n');

    process.exit(allMigrated ? 0 : 1);

  } catch (error) {
    console.error('\n❌ EROARE la verificare:', error);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

// Rulează funcția
verifyMigration();
