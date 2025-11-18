/**
 * Script: Delete All Questions from a Subject
 * Usage: node scripts/deleteQuestionsbySubject.js
 * 
 * Șterge TOATE întrebările dintr-o disciplină specifică
 * Uses interactive CLI or command-line argument
 */

import readline from 'readline';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, deleteDoc, doc, writeBatch } from 'firebase/firestore';

// ============================================
// LOAD FIREBASE CONFIG
// ============================================

async function loadFirebaseConfig() {
  try {
    const firebaseModule = await import('../src/services/firebase.js');
    const firebaseConfig = firebaseModule.firebaseConfig;
    
    if (!firebaseConfig || !firebaseConfig.projectId) {
      throw new Error('Invalid firebase config structure');
    }
    
    return firebaseConfig;
  } catch (error) {
    console.error(`❌ Error loading firebase config: ${error.message}`);
    process.exit(1);
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Interactive confirmation
 */
async function confirmDelete(subjectId, count) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    console.log('\n⚠️  ATTENTION!\n');
    console.log(`Subject: ${subjectId}`);
    console.log(`Questions to delete: ${count}\n`);
    console.log('🔴 This action CANNOT be undone!\n');

    rl.question('Type "DELETE" to confirm or press Enter to cancel: ', (answer) => {
      rl.close();
      resolve(answer === 'DELETE');
    });
  });
}

/**
 * Get list of available subjects from Firestore
 */
async function getAvailableSubjects(db) {
  try {
    const subjectsRef = collection(db, 'subjects');
    const snapshot = await getDocs(subjectsRef);
    
    const subjects = [];
    snapshot.forEach(doc => {
      subjects.push({
        id: doc.id,
        name: doc.data().name
      });
    });
    
    return subjects.sort((a, b) => a.id.localeCompare(b.id));
  } catch (error) {
    console.error(`❌ Error fetching subjects: ${error.message}`);
    process.exit(1);
  }
}

/**
 * Interactive subject selection
 */
async function selectSubjectInteractive(subjects) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    console.log('\n📚 Available subjects:\n');
    subjects.forEach((subject, index) => {
      console.log(`  ${index + 1}. ${subject.name} (${subject.id})`);
    });
    console.log(`  ${subjects.length + 1}. Cancel\n`);

    rl.question('Select subject number: ', (answer) => {
      rl.close();
      const choice = parseInt(answer) - 1;
      
      if (choice === subjects.length) {
        console.log('\n❌ Cancelled\n');
        process.exit(0);
      }
      
      if (choice < 0 || choice >= subjects.length) {
        console.error('\n❌ Invalid selection\n');
        process.exit(1);
      }
      
      resolve(subjects[choice].id);
    });
  });
}

/**
 * Count questions in subject
 */
async function countQuestionsInSubject(db, subjectId) {
  try {
    const q = query(
      collection(db, 'questions'),
      where('subjectId', '==', subjectId)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.size;
  } catch (error) {
    console.error(`❌ Error counting questions: ${error.message}`);
    process.exit(1);
  }
}

/**
 * Delete all questions from subject
 */
async function deleteQuestionsFromSubject(db, subjectId) {
  try {
    const q = query(
      collection(db, 'questions'),
      where('subjectId', '==', subjectId)
    );
    
    const snapshot = await getDocs(q);
    console.log(`\n📤 Deleting ${snapshot.size} questions...\n`);

    // Delete in batches (Firestore batch limit is 500)
    let batchCount = 0;
    let deleted = 0;

    const batchSize = 100;
    let currentBatch = writeBatch(db);

    snapshot.forEach((docSnapshot, index) => {
      currentBatch.delete(docSnapshot.ref);
      batchCount++;

      // Commit batch every 100 docs
      if (batchCount === batchSize) {
        currentBatch.commit();
        deleted += batchCount;
        console.log(`   ✅ Deleted ${deleted} questions...`);
        currentBatch = writeBatch(db);
        batchCount = 0;
      }
    });

    // Commit remaining
    if (batchCount > 0) {
      currentBatch.commit();
      deleted += batchCount;
      console.log(`   ✅ Deleted ${deleted} questions...`);
    }

    return snapshot.size;
  } catch (error) {
    console.error(`❌ Error deleting questions: ${error.message}`);
    process.exit(1);
  }
}

// ============================================
// MAIN FUNCTION
// ============================================

async function deleteQuestions() {
  console.log('🚀 Starting questions deletion...\n');

  // 1. LOAD FIREBASE CONFIG
  console.log('📱 Loading Firebase config...');
  const firebaseConfig = await loadFirebaseConfig();
  console.log('✅ Firebase config loaded\n');

  // 2. INIT FIREBASE
  console.log('🔗 Initializing Firebase...');
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  console.log('✅ Firebase initialized\n');

  // 3. GET SUBJECTS
  console.log('📚 Loading subjects...');
  const subjects = await getAvailableSubjects(db);
  console.log(`✅ Loaded ${subjects.length} subjects\n`);

  // 4. SELECT SUBJECT
  let selectedSubject;
  
  if (process.argv[2]) {
    selectedSubject = process.argv[2];
    const exists = subjects.find(s => s.id === selectedSubject);
    if (!exists) {
      console.error(`❌ Subject not found: ${selectedSubject}`);
      console.error(`\n📚 Available subjects:`);
      subjects.forEach(s => console.error(`   - ${s.id}`));
      process.exit(1);
    }
    console.log(`✅ Selected subject: ${selectedSubject}\n`);
  } else {
    selectedSubject = await selectSubjectInteractive(subjects);
    console.log(`✅ Selected subject: ${selectedSubject}\n`);
  }

  // 5. COUNT QUESTIONS
  console.log('🔍 Counting questions...');
  const count = await countQuestionsInSubject(db, selectedSubject);
  
  if (count === 0) {
    console.log(`✅ No questions found in subject: ${selectedSubject}\n`);
    process.exit(0);
  }

  console.log(`✅ Found ${count} questions\n`);

  // 6. CONFIRM DELETION
  const confirmed = await confirmDelete(selectedSubject, count);
  
  if (!confirmed) {
    console.log('\n❌ Deletion cancelled\n');
    process.exit(0);
  }

  // 7. DELETE QUESTIONS
  console.log('\n🔴 DELETING QUESTIONS FROM FIRESTORE...\n');
  const deletedCount = await deleteQuestionsFromSubject(db, selectedSubject);

  // 8. SUCCESS
  console.log('\n🎉 SUCCESS!\n');
  console.log(`✅ Deleted ${deletedCount} questions`);
  console.log(`📌 Subject: ${selectedSubject}`);
  console.log(`\n💡 You can now import fresh data!\n`);
}

// ============================================
// RUN SCRIPT
// ============================================

deleteQuestions().catch(error => {
  console.error('\n❌ FATAL ERROR:', error.message);
  process.exit(1);
});