/**
 * createSubjects.js
 *
 * Script pentru crearea subjects în Firestore
 * Folosește datele din SUBJECTS_CONFIG
 */

import { db } from '../src/services/firebase.js';
import { collection, doc, setDoc } from 'firebase/firestore';

const subjects = [
  {
    id: 'istorie',
    slug: 'istorie',
    name: 'Istorie',
    icon: '🏛️',
    description: 'Învață despre evenimente istorice importante',
    color: '#E63946',
    isPublished: true,
    order: 1,
  },
  {
    id: 'biologie',
    slug: 'biologie',
    name: 'Biologie',
    icon: '🧬',
    description: 'Descoperă lumea vieții și a organismelor',
    color: '#06A77D',
    isPublished: true,
    order: 2,
  },
  {
    id: 'geografie',
    slug: 'geografie',
    name: 'Geografie',
    icon: '🌍',
    description: 'Explorează planeta și locurile ei',
    color: '#1982C4',
    isPublished: true,
    order: 3,
  },
];

async function createSubjects() {
  console.log('🚀 Creare subjects în Firestore...\n');

  try {
    for (const subject of subjects) {
      const subjectRef = doc(db, 'subjects', subject.id);

      await setDoc(subjectRef, subject, { merge: true });
      console.log(`✅ ${subject.name} (${subject.id})`);
    }

    console.log('\n✨ SUCCESS! Subjects created in Firestore\n');
  } catch (error) {
    console.error('❌ Error creating subjects:', error);
    process.exit(1);
  }

  process.exit(0);
}

createSubjects();
