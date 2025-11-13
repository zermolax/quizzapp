/**
 * deleteDummyThemes.js
 *
 * Script pentru ștergerea temelor dummy vechi care nu mai sunt relevante
 */

import { db } from '../src/services/firebase.js';
import { doc, deleteDoc } from 'firebase/firestore';

const dummyThemes = ['wwi', 'ancient-greece', 'ancient-rome', 'middle-ages', 'renaissance'];

async function deleteDummyThemes() {
  console.log('🗑️  Ștergere teme dummy...\n');

  try {
    for (const themeId of dummyThemes) {
      const themeRef = doc(db, 'themes', themeId);
      await deleteDoc(themeRef);
      console.log(`✅ Șters: ${themeId}`);
    }

    console.log('\n✨ Teme dummy șterse cu succes!\n');
  } catch (error) {
    console.error('❌ Eroare:', error);
    process.exit(1);
  }

  process.exit(0);
}

deleteDummyThemes();
