/**
 * initializeSubjects.js
 *
 * Script pentru crearea colecției 'subjects' în Firestore
 *
 * RULARE: node scripts/initializeSubjects.js
 */

import { db } from '../src/services/firebase.js';
import { collection, doc, setDoc } from 'firebase/firestore';

/**
 * Date pentru cele 3 materii inițiale
 */
const subjects = [
  {
    id: 'istorie',
    name: 'Istorie',
    slug: 'istorie',
    description: 'Explorează evenimente și personalități din istorie',
    icon: '📚',
    color: '#E63946', // brand-red
    order: 1,
    totalThemes: 5, // Actualizat cu numărul real de teme
    totalQuestions: 0, // Se va actualiza automat după migrare
    isPublished: true
  },
  {
    id: 'geografie',
    name: 'Geografie',
    slug: 'geografie',
    description: 'Descoperă țări, capitale și fenomene geografice',
    icon: '🌍',
    color: '#06A77D', // success/green
    order: 2,
    totalThemes: 0,
    totalQuestions: 0,
    isPublished: false // Nu e încă disponibil
  },
  {
    id: 'biologie',
    name: 'Biologie',
    slug: 'biologie',
    description: 'Învață despre viața, organisme și ecosisteme',
    icon: '🧬',
    color: '#6A4C93', // brand-purple
    order: 3,
    totalThemes: 0,
    totalQuestions: 0,
    isPublished: false // Nu e încă disponibil
  }
];

/**
 * Funcția principală de inițializare
 */
async function initializeSubjects() {
  console.log('🚀 Pornire inițializare colecție subjects...\n');

  try {
    const subjectsRef = collection(db, 'subjects');

    let created = 0;

    for (const subject of subjects) {
      const subjectDocRef = doc(subjectsRef, subject.id);

      await setDoc(subjectDocRef, subject);

      console.log(`✅ Creat: ${subject.name} (${subject.slug})`);
      console.log(`   ID: ${subject.id}`);
      console.log(`   Color: ${subject.color}`);
      console.log(`   Published: ${subject.isPublished}`);
      console.log('');

      created++;
    }

    console.log(`\n✨ SUCCES! ${created} materii create în Firestore!\n`);
    console.log('📊 Rezumat:');
    console.log('   - Istorie: PUBLISHED ✅');
    console.log('   - Geografie: DRAFT 📝');
    console.log('   - Biologie: DRAFT 📝\n');

    console.log('➡️  URMĂTORUL PAS: Rulează migrarea pentru themes');
    console.log('   node scripts/migrateThemesToSubjects.js\n');

    process.exit(0);

  } catch (error) {
    console.error('❌ EROARE la inițializare:', error);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

// Rulează funcția
initializeSubjects();
