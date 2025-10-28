/**
 * importThemesWithSubjects.js
 *
 * Script pentru importarea tematicilor din themes.json în Firestore
 * CU câmpul subjectId deja adăugat
 *
 * RULARE: node scripts/importThemesWithSubjects.js
 */

import { db } from '../src/services/firebase.js';
import { collection, writeBatch, doc } from 'firebase/firestore';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function importThemes() {
  console.log('🚀 Pornire import tematici...\n');

  try {
    // 1. Citește themes.json
    const themesPath = join(__dirname, '..', 'src', 'data', 'themes.json');
    const themesContent = readFileSync(themesPath, 'utf-8');
    const themes = JSON.parse(themesContent);

    console.log(`📁 Găsite ${themes.length} tematici în themes.json\n`);

    if (themes.length === 0) {
      console.log('⚠️  Fișierul themes.json este gol!');
      process.exit(1);
    }

    // 2. Afișează tematicile găsite
    console.log('📚 Tematici de importat:');
    themes.forEach((theme, index) => {
      console.log(`   ${index + 1}. ${theme.name} (${theme.slug})`);
    });
    console.log('');

    // 3. Creează batch pentru Firestore
    const batch = writeBatch(db);
    let imported = 0;

    themes.forEach((theme) => {
      // Folosim slug-ul ca document ID pentru consistență
      const themeDocRef = doc(collection(db, 'themes'), theme.slug);

      // Adaugă tema CU subjectId = 'istorie'
      batch.set(themeDocRef, {
        ...theme,
        subjectId: 'istorie', // ✨ ADĂUGAT DIRECT!
        createdAt: new Date(),
        updatedAt: new Date()
      });

      console.log(`✅ Pregătit: ${theme.name} → subjectId: istorie`);
      imported++;
    });

    // 4. Commit batch în Firestore
    console.log('\n📤 Salvare în Firestore...');
    await batch.commit();

    // 5. Raport final
    console.log('\n' + '='.repeat(60));
    console.log('✨ SUCCES! Import completat!');
    console.log('='.repeat(60));
    console.log(`📊 Tematici importate:     ${imported}`);
    console.log(`📁 Colecție Firestore:     themes/`);
    console.log(`🏷️  Subject ID adăugat:    istorie`);
    console.log('='.repeat(60) + '\n');

    console.log('➡️  URMĂTORUL PAS: Migrează întrebările cu subjectId');
    console.log('   node scripts/migrateQuestionsToSubjects.js\n');

    process.exit(0);

  } catch (error) {
    console.error('\n❌ EROARE la import:', error);
    console.error('Stack:', error.stack);

    // Detalii suplimentare pentru debugging
    if (error.code === 'permission-denied') {
      console.log('\n⚠️  EROARE DE PERMISIUNI Firebase!');
      console.log('\n🔧 SOLUȚIE:');
      console.log('   Actualizează temporar Firebase Security Rules:');
      console.log('   match /themes/{themeId} {');
      console.log('     allow read, write: if true; // TEMPORAR!');
      console.log('   }');
      console.log('   După import, revert la:');
      console.log('   allow read: if true;');
      console.log('   allow write: if request.auth != null;\n');
    }

    process.exit(1);
  }
}

// Rulează funcția
importThemes();
