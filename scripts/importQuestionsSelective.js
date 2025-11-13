/**
 * Script: Import Specific Questions File into Firestore
 * Usage: node scripts/importQuestionsSelective.js
 * 
 * Permite selectarea fișierului JSON care să fie importat
 * WITH pre-import validation checklist
 * Uses interactive CLI or command-line argument
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, writeBatch, doc, getDocs, query, where } from 'firebase/firestore';

// Get current directory (for ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
 * Lista toate .json files din src/data/
 */
function getAvailableFiles(dataDir) {
  const files = fs.readdirSync(dataDir);
  return files.filter(file => {
    // Exclude template files
    if (file.includes('TEMPLATE') || file.includes('template')) return false;
    if (file.includes('subjects') || file.includes('themes')) return false;
    if (file.includes('new-')) return false;
    if (file.endsWith('.json')) return true;
    return false;
  });
}

/**
 * Interactive menu - user picks file
 */
async function selectFileInteractive(files) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    console.log('\n📁 Available question files:\n');
    files.forEach((file, index) => {
      console.log(`  ${index + 1}. ${file}`);
    });
    console.log(`  ${files.length + 1}. Cancel\n`);

    rl.question('Select file number: ', (answer) => {
      rl.close();
      const choice = parseInt(answer) - 1;
      
      if (choice === files.length) {
        console.log('\n❌ Cancelled\n');
        process.exit(0);
      }
      
      if (choice < 0 || choice >= files.length) {
        console.error('\n❌ Invalid selection\n');
        process.exit(1);
      }
      
      resolve(files[choice]);
    });
  });
}

/**
 * Încarcă întrebări din fișier JSON
 */
function loadQuestionsFromFile(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`❌ Error reading file: ${error.message}`);
    process.exit(1);
  }
}

/**
 * Get all subjects from Firestore
 */
async function getAvailableSubjects(db) {
  try {
    const snapshot = await getDocs(collection(db, 'subjects'));
    const subjects = {};
    snapshot.forEach(doc => {
      subjects[doc.id] = doc.data().name;
    });
    return subjects;
  } catch (error) {
    console.error(`❌ Error fetching subjects: ${error.message}`);
    return {};
  }
}

/**
 * Get all themes from Firestore
 */
async function getAvailableThemes(db) {
  try {
    const snapshot = await getDocs(collection(db, 'themes'));
    const themes = {};
    snapshot.forEach(doc => {
      themes[doc.id] = {
        name: doc.data().name,
        subjectId: doc.data().subjectId
      };
    });
    return themes;
  } catch (error) {
    console.error(`❌ Error fetching themes: ${error.message}`);
    return {};
  }
}

/**
 * Extract unique subject and theme IDs from questions
 */
function extractUniqueIds(questions) {
  const subjects = new Set();
  const themes = new Set();

  questions.forEach(q => {
    if (q.subjectId) subjects.add(q.subjectId);
    if (q.themeId) themes.add(q.themeId);
  });

  return {
    subjects: Array.from(subjects),
    themes: Array.from(themes)
  };
}

/**
 * Pre-import validation checklist
 */
async function preImportChecklist(db, fileName, questions) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const subjects = await getAvailableSubjects(db);
  const themes = await getAvailableThemes(db);
  const { subjects: fileSubjects, themes: fileThemes } = extractUniqueIds(questions);

  return new Promise((resolve) => {
    console.log('\n' + '='.repeat(60));
    console.log('🔍 PRE-IMPORT VALIDATION CHECKLIST');
    console.log('='.repeat(60) + '\n');

    console.log(`📄 File: ${fileName}`);
    console.log(`📊 Total questions: ${questions.length}\n`);

    // ===== CHECK 1: SubjectID =====
    console.log('1️⃣  SUBJECT VERIFICATION\n');
    console.log(`   Questions use subject(s): ${fileSubjects.join(', ')}`);
    
    fileSubjects.forEach(subj => {
      if (subjects[subj]) {
        console.log(`   ✅ "${subj}" → "${subjects[subj]}" (EXISTS)`);
      } else {
        console.log(`   ❌ "${subj}" → NOT FOUND in DB!`);
      }
    });

    // ===== CHECK 2: ThemeID =====
    console.log('\n2️⃣  THEME VERIFICATION\n');
    console.log(`   Questions use theme(s): ${fileThemes.join(', ')}\n`);
    
    let allThemesValid = true;
    fileThemes.forEach(themeId => {
      if (themes[themeId]) {
        const theme = themes[themeId];
        console.log(`   ✅ "${themeId}"`);
        console.log(`      → Name: "${theme.name}"`);
        console.log(`      → Subject: "${theme.subjectId}" (${subjects[theme.subjectId] || 'UNKNOWN'})\n`);
      } else {
        console.log(`   ❌ "${themeId}" → NOT FOUND in DB!\n`);
        allThemesValid = false;
      }
    });

    // ===== WARNING IF ISSUES =====
    if (!allThemesValid || fileSubjects.some(s => !subjects[s])) {
      console.log('⚠️  WARNING: Some subjects or themes are not found in database!\n');
    }

    // ===== CONFIRMATION =====
    console.log('='.repeat(60));
    console.log('\n❓ Have you verified:\n');
    console.log('  [ ] SubjectID matches the discipline');
    console.log('  [ ] ThemeID matches the actual theme\n');

    rl.question('Type "CONFIRM" to proceed with import or press Enter to cancel: ', (answer) => {
      rl.close();
      
      if (answer === 'CONFIRM') {
        console.log('\n✅ Confirmed! Proceeding with import...\n');
        resolve(true);
      } else {
        console.log('\n❌ Import cancelled\n');
        resolve(false);
      }
    });
  });
}

/**
 * Validează structura unei întrebări
 */
function validateQuestion(question, index, fileName) {
  const requiredFields = ['id', 'question', 'answers', 'difficulty', 'subjectId', 'themeId', 'category', 'explanation'];
  const errors = [];

  requiredFields.forEach(field => {
    if (!question[field]) {
      errors.push(`Question #${index + 1} (${fileName}): Missing required field "${field}"`);
    }
  });

  // Validate answers
  if (Array.isArray(question.answers)) {
    if (question.answers.length !== 4) {
      errors.push(`Question #${index + 1}: Must have exactly 4 answers, got ${question.answers.length}`);
    }

    const correctCount = question.answers.filter(a => a.correct === true).length;
    if (correctCount !== 1) {
      errors.push(`Question #${index + 1}: Must have exactly 1 correct answer, got ${correctCount}`);
    }
  }

  // Validate difficulty
  if (!['easy', 'medium', 'hard'].includes(question.difficulty)) {
    errors.push(`Question #${index + 1}: Invalid difficulty "${question.difficulty}"`);
  }

  return errors;
}

/**
 * Validează toate întrebările din fișier
 */
function validateAllQuestions(questions, fileName) {
  let allErrors = [];

  questions.forEach((question, index) => {
    const errors = validateQuestion(question, index, fileName);
    allErrors = allErrors.concat(errors);
  });

  return allErrors;
}

/**
 * Afișează statistici frumoase
 */
function printStats(fileName, totalQuestions, validQuestions, invalidQuestions) {
  console.log('\n📊 STATISTICS:');
  console.log(`   File: ${fileName}`);
  console.log(`   Total questions: ${totalQuestions}`);
  console.log(`   ✅ Valid: ${validQuestions}`);
  console.log(`   ❌ Invalid: ${invalidQuestions}`);
}

// ============================================
// MAIN IMPORT FUNCTION
// ============================================

async function importQuestions() {
  console.log('🚀 Starting selective questions import...\n');

  // 1. LOAD FIREBASE CONFIG
  console.log('📱 Loading Firebase config...');
  const firebaseConfig = await loadFirebaseConfig();
  console.log('✅ Firebase config loaded\n');

  // 2. INIT FIREBASE
  console.log('🔗 Initializing Firebase...');
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  console.log('✅ Firebase initialized\n');

  // 3. GET FILE SELECTION
  const dataDir = path.join(__dirname, '../src/data');
  const availableFiles = getAvailableFiles(dataDir);

  if (availableFiles.length === 0) {
    console.error('❌ No question files found in src/data/');
    console.error('   Expected files like: bio-u1-easy-gimnaziu.json\n');
    process.exit(1);
  }

  console.log(`📂 Found ${availableFiles.length} question file(s)\n`);

  let selectedFile;
  
  // Check if file passed as argument
  if (process.argv[2]) {
    selectedFile = process.argv[2];
    if (!availableFiles.includes(selectedFile)) {
      console.error(`❌ File not found: ${selectedFile}`);
      console.error(`\n📁 Available files:`);
      availableFiles.forEach(f => console.error(`   - ${f}`));
      process.exit(1);
    }
    console.log(`✅ Using file: ${selectedFile}\n`);
  } else {
    // Interactive selection
    selectedFile = await selectFileInteractive(availableFiles);
    console.log(`✅ Selected: ${selectedFile}\n`);
  }

  // 4. LOAD QUESTIONS
  const filePath = path.join(dataDir, selectedFile);
  console.log(`📖 Loading questions from: ${selectedFile}`);

  const questions = loadQuestionsFromFile(filePath);
  console.log(`✅ Loaded ${questions.length} questions\n`);

  // 5. PRE-IMPORT VALIDATION CHECKLIST
  const proceedWithImport = await preImportChecklist(db, selectedFile, questions);
  
  if (!proceedWithImport) {
    process.exit(0);
  }

  // 6. VALIDATE QUESTIONS
  console.log('🔍 Validating questions...');
  const validationErrors = validateAllQuestions(questions, selectedFile);

  if (validationErrors.length > 0) {
    console.error('\n❌ VALIDATION ERRORS:');
    validationErrors.forEach(error => console.error(`   ${error}`));
    process.exit(1);
  }

  console.log('✅ All questions are valid\n');

  // 7. UPLOAD TO FIRESTORE (BATCH)
  console.log('📤 Uploading to Firestore...');

  const batch = writeBatch(db);
  const questionsCollection = collection(db, 'questions');

  questions.forEach((question) => {
    const docRef = doc(questionsCollection, question.id);
    batch.set(docRef, {
      ...question,
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

  // 8. SUCCESS
  printStats(selectedFile, questions.length, questions.length, 0);

  console.log('\n🎉 SUCCESS!');
  console.log(`   ${questions.length} questions imported to Firestore`);
  console.log(`   From file: ${selectedFile}\n`);
  console.log('💡 Next: Upload more questions or check app!\n');
}

// ============================================
// RUN SCRIPT
// ============================================

importQuestions().catch(error => {
  console.error('\n❌ FATAL ERROR:', error.message);
  process.exit(1);
});