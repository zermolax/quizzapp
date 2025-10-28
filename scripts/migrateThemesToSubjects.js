/**
 * migrateThemesToSubjects.js
 *
 * Script pentru adăugarea câmpului 'subjectId' la toate tematicile existente
 *
 * RULARE: node scripts/migrateThemesToSubjects.js
 */

import { db } from '../src/services/firebase.js';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';

/**
 * Funcția principală de migrare
 */
async function migrateThemes() {
  console.log('🚀 Pornire migrare themes...\n');

  try {
    // 1. Citește toate tematicile din Firestore
    const themesRef = collection(db, 'themes');
    const snapshot = await getDocs(themesRef);

    console.log(`📊 Găsite ${snapshot.size} teme de migrat\n`);

    if (snapshot.size === 0) {
      console.log('⚠️  Nu există teme în Firestore. Verifică că ai rulat importul.');
      process.exit(0);
    }

    // 2. Migrează fiecare temă
    let migrated = 0;
    let alreadyMigrated = 0;
    const errors = [];

    for (const themeDoc of snapshot.docs) {
      const themeData = themeDoc.data();

      // Verifică dacă tema are deja subjectId
      if (themeData.subjectId) {
        console.log(`⏭️  ${themeData.name || themeDoc.id} - deja migrat (subjectId: ${themeData.subjectId})`);
        alreadyMigrated++;
        continue;
      }

      try {
        // Adaugă subjectId = 'istorie' (toate tematicile curente sunt de istorie)
        await updateDoc(doc(db, 'themes', themeDoc.id), {
          subjectId: 'istorie'
        });

        console.log(`✅ Migrat: ${themeData.name || themeDoc.id} → subjectId: istorie`);
        migrated++;

      } catch (error) {
        console.error(`❌ Eroare la ${themeData.name || themeDoc.id}:`, error.message);
        errors.push({ id: themeDoc.id, error: error.message });
      }
    }

    // 3. Afișează raportul final
    console.log('\n' + '='.repeat(60));
    console.log('📊 RAPORT MIGRAȚIE THEMES');
    console.log('='.repeat(60));
    console.log(`Total teme găsite:        ${snapshot.size}`);
    console.log(`✅ Migrate cu succes:     ${migrated}`);
    console.log(`⏭️  Deja migrate:          ${alreadyMigrated}`);
    console.log(`❌ Erori:                  ${errors.length}`);
    console.log('='.repeat(60) + '\n');

    if (errors.length > 0) {
      console.log('❌ Detalii erori:');
      errors.forEach(err => {
        console.log(`   - ${err.id}: ${err.error}`);
      });
      console.log('');
    }

    if (migrated > 0) {
      console.log('✨ SUCCES! Teme migrate cu succes!\n');
      console.log('➡️  URMĂTORUL PAS: Rulează migrarea pentru questions');
      console.log('   node scripts/migrateQuestionsToSubjects.js\n');
    } else if (alreadyMigrated === snapshot.size) {
      console.log('✅ Toate tematicile sunt deja migrate!\n');
      console.log('➡️  URMĂTORUL PAS: Rulează migrarea pentru questions');
      console.log('   node scripts/migrateQuestionsToSubjects.js\n');
    }

    process.exit(errors.length > 0 ? 1 : 0);

  } catch (error) {
    console.error('\n❌ EROARE CRITICĂ la migrare:', error);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

// Rulează funcția
migrateThemes();
