/**
 * createSubjects.js
 *
 * Script pentru crearea subjects în Firestore
 * Folosește datele din SUBJECTS_CONFIG (single source of truth)
 *
 * Usage: node scripts/createSubjects.js
 */

import { db } from '../src/services/firebase.js';
import { doc, setDoc } from 'firebase/firestore';
import { SUBJECTS_CONFIG } from '../src/constants/subjects.js';

// Transform SUBJECTS_CONFIG to Firestore format
const subjects = SUBJECTS_CONFIG.map(subject => ({
  id: subject.id,
  slug: subject.slug,
  name: subject.name,
  icon: subject.icon,
  description: subject.descriptions.educational,
  color: subject.color,
  neonColor: subject.neonColor,
  isPublished: subject.isActive,
  order: subject.order,
  totalThemes: 0,
  totalQuestions: 0,
}));

async function createSubjects() {
  console.log('🚀 Creare subjects în Firestore...\n');
  console.log(`📦 Loaded ${subjects.length} subjects from SUBJECTS_CONFIG\n`);

  try {
    let created = 0;
    let updated = 0;

    for (const subject of subjects) {
      const subjectRef = doc(db, 'subjects', subject.id);

      await setDoc(subjectRef, {
        ...subject,
        updatedAt: new Date(),
      }, { merge: true });

      console.log(`✅ ${subject.name} (${subject.id})`);
      console.log(`   Icon: ${subject.icon} | Color: ${subject.color} | Neon: ${subject.neonColor}`);
      console.log(`   Published: ${subject.isPublished} | Order: ${subject.order}\n`);

      created++;
    }

    console.log(`\n✨ SUCCESS! ${created} subjects created/updated in Firestore`);
    console.log('\n📊 Summary:');
    console.log(`   Total subjects: ${subjects.length}`);
    console.log(`   Active (isPublished): ${subjects.filter(s => s.isPublished).length}`);
    console.log(`   Draft: ${subjects.filter(s => !s.isPublished).length}`);
    console.log('\n💡 Next step: Import themes and questions\n');
  } catch (error) {
    console.error('❌ Error creating subjects:', error);
    console.error('Stack:', error.stack);
    process.exit(1);
  }

  process.exit(0);
}

createSubjects();
