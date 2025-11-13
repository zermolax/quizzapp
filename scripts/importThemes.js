
/**
 * Script: Import Themes into Firestore
 * Usage: node scripts/importThemes.js
 * 
 * Citește din src/data/themes.json și încarcă în Firestore
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
    const firebaseModule = await import('../src/services/firebase.js');
    const firebaseConfig = firebaseModule.firebaseConfig;
    
    if (!firebaseConfig || !firebaseConfig.projectId) {
      throw new Error('Invalid firebase config structure');
    }
    
    console.log('✅ Firebase config loaded from src/services/firebase.js');
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
 * Validează structura unei teme
 */
function validateTheme(theme, index) {
  const requiredFields = ['id', 'slug', 'name', 'description', 'icon', 'color', 'subjectId', 'order', 'difficulty', 'topics'];
  const errors = [];

  requiredFields.forEach(field => {
    if (field === 'difficulty' || field === 'topics') {
      if (!Array.isArray(theme[field]) || theme[field].length === 0) {
        errors.push(`Theme #${index + 1}: "${field}" must be a non-empty array`);
      }
    } else if (!theme[field]) {
      errors.push(`Theme #${index + 1}: Missing required field "${field}"`);
    }
  });

  // Validează types
  if (typeof theme.id !== 'string') errors.push(`Theme #${index + 1}: "id" must be string`);
  if (typeof theme.order !== 'number') errors.push(`Theme #${index + 1}: "order" must be number`);
  if (typeof theme.isPublished !== 'boolean') {
    errors.push(`Theme #${index + 1}: "isPublished" must be boolean`);
  }

  // Validează difficulty values
  if (Array.isArray(theme.difficulty)) {
    const validDifficulties = ['easy', 'medium', 'hard'];
    theme.difficulty.forEach(d => {
      if (!validDifficulties.includes(d)) {
        errors.push(`Theme #${index + 1}: Invalid difficulty "${d}". Must be: easy, medium, hard`);
      }
    });
  }

  return errors;
}

/**
 * Validează toate temele
 */
function validateAllThemes(themes) {
  let allErrors = [];

  themes.forEach((theme, index) => {
    const errors = validateTheme(theme, index);
    allErrors = allErrors.concat(errors);
  });

  return allErrors;
}

/**
 * Încarcă teme din JSON file
 */
function loadThemesFromFile(filePath) {
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
function printStats(totalThemes, validThemes, invalidThemes) {
  console.log('\n📊 STATISTICS:');
  console.log(`   Total themes: ${totalThemes}`);
  console.log(`   ✅ Valid: ${validThemes}`);
  console.log(`   ❌ Invalid: ${invalidThemes}`);
}

// ============================================
// MAIN IMPORT FUNCTION
// ============================================

async function importThemes() {
  console.log('🚀 Starting themes import...\n');

  // 1. LOAD FIREBASE CONFIG
  console.log('📱 Loading Firebase config...');
  const firebaseConfig = await loadFirebaseConfig();
  console.log(`   Project ID: ${firebaseConfig.projectId}\n`);

  // 2. INIT FIREBASE
  console.log('🔗 Initializing Firebase...');
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  console.log('✅ Firebase initialized\n');

  // 3. LOAD THEMES FROM JSON
  const filePath = path.join(__dirname, '../src/data/themes-istorie-gimnaziu.json');
  console.log(`📂 Loading themes from: themes-istorie-gimnaziu.json`);

  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`);
    console.error(`\n💡 Make sure you created the file:`);
    console.error(`   src/data/themes.json`);
    console.error(`\n💡 Use THEMES_TEMPLATE.json as reference`);
    process.exit(1);
  }

  const themes = loadThemesFromFile(filePath);
  console.log(`✅ Loaded ${themes.length} themes\n`);

  // 4. VALIDATE THEMES
  console.log('🔍 Validating themes...');
  const validationErrors = validateAllThemes(themes);

  if (validationErrors.length > 0) {
    console.error('\n❌ VALIDATION ERRORS:');
    validationErrors.forEach(error => console.error(`   ${error}`));
    process.exit(1);
  }

  console.log('✅ All themes are valid\n');

  // 5. UPLOAD TO FIRESTORE (BATCH)
  console.log('📤 Uploading to Firestore...');

  const batch = writeBatch(db);
  const themesCollection = collection(db, 'themes');

  themes.forEach((theme) => {
    const docRef = doc(themesCollection, theme.id);
    batch.set(docRef, {
      ...theme,
      totalQuestions: 0,  // Always start at 0
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
  printStats(themes.length, themes.length, 0);

  console.log('\n🎉 SUCCESS!');
  console.log(`   ${themes.length} themes imported to Firestore`);
  console.log('\n💡 Next step: Convert questions with Gemini Flash and import them\n');
}

// ============================================
// RUN SCRIPT
// ============================================

importThemes().catch(error => {
  console.error('\n❌ FATAL ERROR:', error.message);
  process.exit(1);
});