/**
 * Script: Delete All Themes from a Subject
 * Usage: node scripts/deleteThemesBySubject.js
 * 
 * Șterge TOATE temele dintr-o disciplină specifică
 * Uses interactive CLI or command-line argument
 */

import readline from 'readline';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, writeBatch } from 'firebase/firestore';

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
async function confirmDelete(subjectId, count, themesInfo) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    console.log('\n⚠️  ATTENTION!\n');
    console.log(`Subject: ${subjectId}`);
    console.log(`Themes to delete: ${count}\n`);
    
    if (themesInfo.length > 0) {
      console.log('Themes that will be deleted:');
      themesInfo.forEach(t => {
        console.log(`  - ${t.name} (${t.id})`);
      });
      console.log('');
    }
    
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
 * Get themes info from subject
 */
async function getThemesFromSubject(db, subjectId) {
  try {
    const q = query(
      collection(db, 'themes'),
      where('subjectId', '==', subjectId)
    );
    
    const snapshot = await getDocs(q);
    const themes = [];
    
    snapshot.forEach(doc => {
      themes.push({
        id: doc.id,
        name: doc.data().name,
        ref: doc.ref
      });
    });
    
    return themes;
  } catch (error) {
    console.error(`❌ Error fetching themes: ${error.message}`);
    process.exit(1);
  }
}

/**
 * Delete all themes from subject
 */
async function deleteThemesFromSubject(db, themes) {
  try {
    console.log(`\n📤 Deleting ${themes.length} themes...\n`);

    // Delete in batches (Firestore batch limit is 500)
    let batchCount = 0;
    let deleted = 0;

    const batchSize = 100;
    let currentBatch = writeBatch(db);

    themes.forEach((theme, index) => {
      currentBatch.delete(theme.ref);
      batchCount++;

      // Commit batch every 100 docs
      if (batchCount === batchSize) {
        currentBatch.commit();
        deleted += batchCount;
        console.log(`   ✅ Deleted ${deleted} themes...`);
        currentBatch = writeBatch(db);
        batchCount = 0;
      }
    });

    // Commit remaining
    if (batchCount > 0) {
      currentBatch.commit();
      deleted += batchCount;
      console.log(`   ✅ Deleted ${deleted} themes...`);
    }

    return themes.length;
  } catch (error) {
    console.error(`❌ Error deleting themes: ${error.message}`);
    process.exit(1);
  }
}

// ============================================
// MAIN FUNCTION
// ============================================

async function deleteThemes() {
  console.log('🚀 Starting themes deletion...\n');

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

  // 5. GET THEMES
  console.log('🔍 Loading themes...');
  const themes = await getThemesFromSubject(db, selectedSubject);
  
  if (themes.length === 0) {
    console.log(`✅ No themes found in subject: ${selectedSubject}\n`);
    process.exit(0);
  }

  console.log(`✅ Found ${themes.length} theme(s)\n`);

  // 6. CONFIRM DELETION
  const confirmed = await confirmDelete(selectedSubject, themes.length, themes);
  
  if (!confirmed) {
    console.log('\n❌ Deletion cancelled\n');
    process.exit(0);
  }

  // 7. DELETE THEMES
  console.log('\n🔴 DELETING THEMES FROM FIRESTORE...\n');
  const deletedCount = await deleteThemesFromSubject(db, themes);

  // 8. SUCCESS
  console.log('\n🎉 SUCCESS!\n');
  console.log(`✅ Deleted ${deletedCount} theme(s)`);
  console.log(`📌 Subject: ${selectedSubject}`);
  console.log(`\n💡 Tip: Questions linked to these themes are still in DB!\n`);
  console.log('💡 If needed, delete orphaned questions from this subject.\n');
}

// ============================================
// RUN SCRIPT
// ============================================

deleteThemes().catch(error => {
  console.error('\n❌ FATAL ERROR:', error.message);
  process.exit(1);
});