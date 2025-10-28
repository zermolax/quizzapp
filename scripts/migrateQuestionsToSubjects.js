/**
 * migrateQuestionsToSubjects.js
 *
 * Script pentru adăugarea câmpului 'subjectId' la toate întrebările existente
 *
 * RULARE: node scripts/migrateQuestionsToSubjects.js
 */

import { db } from '../src/services/firebase.js';
import { collection, getDocs, writeBatch, doc } from 'firebase/firestore';

/**
 * Funcția principală de migrare
 */
async function migrateQuestions() {
  console.log('🚀 Pornire migrare questions...\n');

  try {
    // 1. Citește toate întrebările din Firestore
    const questionsRef = collection(db, 'questions');
    const snapshot = await getDocs(questionsRef);

    console.log(`📊 Găsite ${snapshot.size} întrebări de migrat\n`);

    if (snapshot.size === 0) {
      console.log('⚠️  Nu există întrebări în Firestore.');
      console.log('   Verifică că ai rulat: npm run import');
      process.exit(0);
    }

    // 2. Pregătește migrarea în batches (Firestore limit = 500 operations/batch)
    const batchSize = 500;
    const totalBatches = Math.ceil(snapshot.size / batchSize);

    let migrated = 0;
    let alreadyMigrated = 0;
    const errors = [];

    console.log(`📦 Se vor crea ${totalBatches} batch-uri (max ${batchSize} întrebări/batch)\n`);

    // 3. Procesează în batches
    const docs = snapshot.docs;

    for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
      const batch = writeBatch(db);
      const start = batchIndex * batchSize;
      const end = Math.min((batchIndex + 1) * batchSize, docs.length);
      const batchDocs = docs.slice(start, end);

      console.log(`\n📦 Batch ${batchIndex + 1}/${totalBatches} (${batchDocs.length} întrebări):`);

      let batchMigrated = 0;
      let batchSkipped = 0;

      for (const questionDoc of batchDocs) {
        const questionData = questionDoc.data();

        // Verifică dacă întrebarea are deja subjectId
        if (questionData.subjectId) {
          batchSkipped++;
          alreadyMigrated++;
          continue;
        }

        try {
          // Adaugă subjectId = 'istorie' (toate întrebările curente sunt de istorie)
          batch.update(doc(db, 'questions', questionDoc.id), {
            subjectId: 'istorie'
          });

          batchMigrated++;

        } catch (error) {
          errors.push({
            id: questionDoc.id,
            themeId: questionData.themeId,
            error: error.message
          });
        }
      }

      // Commit batch-ul
      if (batchMigrated > 0) {
        await batch.commit();
        migrated += batchMigrated;
        console.log(`   ✅ Migrat: ${batchMigrated} întrebări`);
      }

      if (batchSkipped > 0) {
        console.log(`   ⏭️  Sărit: ${batchSkipped} întrebări (deja migrate)`);
      }
    }

    // 4. Raport final
    console.log('\n' + '='.repeat(60));
    console.log('📊 RAPORT MIGRAȚIE QUESTIONS');
    console.log('='.repeat(60));
    console.log(`Total întrebări găsite:    ${snapshot.size}`);
    console.log(`✅ Migrate cu succes:       ${migrated}`);
    console.log(`⏭️  Deja migrate:            ${alreadyMigrated}`);
    console.log(`❌ Erori:                    ${errors.length}`);
    console.log('='.repeat(60) + '\n');

    if (errors.length > 0) {
      console.log('❌ Detalii erori:');
      errors.slice(0, 10).forEach(err => {
        console.log(`   - Theme: ${err.themeId}, Error: ${err.error}`);
      });
      if (errors.length > 10) {
        console.log(`   ... și încă ${errors.length - 10} erori`);
      }
      console.log('');
    }

    if (migrated > 0 || alreadyMigrated === snapshot.size) {
      console.log('✨ SUCCES! Migrare questions completată!\n');
      console.log('➡️  URMĂTORUL PAS: Verifică migrația');
      console.log('   node scripts/verifyMigration.js\n');
    }

    process.exit(errors.length > 0 ? 1 : 0);

  } catch (error) {
    console.error('\n❌ EROARE CRITICĂ la migrare:', error);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

// Rulează funcția
migrateQuestions();
