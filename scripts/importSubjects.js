/**
 * Script: Import Subjects into Firestore
 * Usage: node scripts/importSubjects.js
 * 
 * Citește config din src/services/firebase.js și încarcă subjects în Firestore
 * Uses ES modules (import/export)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, writeBatch, doc } from 'firebase/firestore';

// Get current directory (for ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================
// LOAD FIREBASE CONFIG FROM firebase.js
// ============================================

async function loadFirebaseConfig() {
  try {
    // Import firebase config
    const firebaseModule = await import('../src/services/firebase.js');
    
    // Get the firebaseConfig from the module
    const firebaseConfig = firebaseModule.firebaseConfig;
    
    if (!firebaseConfig || !firebaseConfig.projectId) {
      throw new Error('Invalid firebase config structure');
    }
    
    console.log('✅ Firebase config loaded from src/services/firebase.js');
    return firebaseConfig;
  } catch (error) {
    console.error(`❌ Error loading firebase config: ${error.message}`);
    console.error('\n💡 Make sure src/services/firebase.js exports firebaseConfig');
    process.exit(1);
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Validează structura unui subject
 */
function validateSubject(subject, index) {
  const requiredFields = ['id', 'slug', 'name', 'description', 'icon', 'color', 'order'];
  const errors = [];

  requiredFields.forEach(field => {
    if (!subject[field]) {
      errors.push(`Subject #${index + 1}: Missing required field "${field}"`);
    }
  });

  // Validează types
  if (typeof subject.id !== 'string') errors.push(`Subject #${index + 1}: "id" must be string`);
  if (typeof subject.order !== 'number') errors.push(`Subject #${index + 1}: "order" must be number`);
  if (typeof subject.isPublished !== 'boolean') {
    errors.push(`Subject #${index + 1}: "isPublished" must be boolean`);
  }

  return errors;
}

/**
 * Validează toate subjects-urile
 */
function validateAllSubjects(subjects) {
  let allErrors = [];

  subjects.forEach((subject, index) => {
    const errors = validateSubject(subject, index);
    allErrors = allErrors.concat(errors);
  });

  return allErrors;
}

/**
 * Încarcă subjects din JSON file
 */
function loadSubjectsFromFile(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`❌ Error reading file: ${error.message}`);
    process.exit(1);
  }
}

/**
 * Afișează statistici frumoase
 */
function printStats(totalSubjects, validSubjects, invalidSubjects) {
  console.log('\n📊 STATISTICS:');
  console.log(`   Total subjects: ${totalSubjects}`);
  console.log(`   ✅ Valid: ${validSubjects}`);
  console.log(`   ❌ Invalid: ${invalidSubjects}`);
}

// ============================================
// MAIN IMPORT FUNCTION
// ============================================

async function importSubjects() {
  console.log('🚀 Starting subjects import...\n');

  // 1. LOAD FIREBASE CONFIG
  console.log('📱 Loading Firebase config...');
  const firebaseConfig = await loadFirebaseConfig();
  console.log(`   Project ID: ${firebaseConfig.projectId}\n`);

  // 2. INIT FIREBASE
  console.log('🔗 Initializing Firebase...');
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  console.log('✅ Firebase initialized\n');

  // 3. LOAD SUBJECTS FROM JSON
  const filePath = path.join(__dirname, '../src/data/new-subjects.json');
  console.log(`📂 Loading subjects from: new-subjects.json`);

  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`);
    console.error(`\n💡 Make sure you created the file:`);
    console.error(`   src/data/new-subjects.json`);
    process.exit(1);
  }

  const subjects = loadSubjectsFromFile(filePath);
  console.log(`✅ Loaded ${subjects.length} subjects\n`);

  // 4. VALIDATE SUBJECTS
  console.log('🔍 Validating subjects...');
  const validationErrors = validateAllSubjects(subjects);

  if (validationErrors.length > 0) {
    console.error('\n❌ VALIDATION ERRORS:');
    validationErrors.forEach(error => console.error(`   ${error}`));
    process.exit(1);
  }

  console.log('✅ All subjects are valid\n');

  // 5. UPLOAD TO FIRESTORE (BATCH)
  console.log('📤 Uploading to Firestore...');

  const batch = writeBatch(db);
  const subjectsCollection = collection(db, 'subjects');

  subjects.forEach((subject) => {
    const docRef = doc(subjectsCollection, subject.id);
    batch.set(docRef, {
      ...subject,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });

  try {
    await batch.commit();
    console.log(`✅ Batch committed successfully\n`);
  } catch (error) {
    console.error(`\n❌ Error uploading batch: ${error.message}`);
    console.error(`\nDebug info:`);
    console.error(`   Firebase Project: ${firebaseConfig.projectId}`);
    console.error(`   Error code: ${error.code}`);
    process.exit(1);
  }

  // 6. SUCCESS
  printStats(subjects.length, subjects.length, 0);

  console.log('\n🎉 SUCCESS!');
  console.log(`   ${subjects.length} subjects imported to Firestore`);
  console.log('\n💡 Next step: Create themes for each subject\n');
}

// ============================================
// RUN SCRIPT
// ============================================

importSubjects().catch(error => {
  console.error('\n❌ FATAL ERROR:', error.message);
  process.exit(1);
});