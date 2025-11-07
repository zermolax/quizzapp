// importQuestions.js - UPDATED with latest Firestore structure
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, writeBatch, doc, setDoc } from 'firebase/firestore';
import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAfOpufH_Je0IhQhRyX_RSWPDcP6FgL8mA",
  authDomain: "quizzapp-e45dc.firebaseapp.com",
  projectId: "quizzapp-e45dc",
  storageBucket: "quizzapp-e45dc.appspot.com",
  messagingSenderId: "128593704605",
  appId: "1:128593704605:web:a1b2c3d4e5f6g7h8i9j0k1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Get current directory (pentru ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * MAPPING: themeId → subjectId
 * Actualizează această mapare când adaugi noi tematici/discipline
 */
const THEME_TO_SUBJECT_MAP = {
  // ISTORIE
  'wwi': 'istorie',
  'ancient-greece': 'istorie',
  'ancient-rome': 'istorie',
  'middle-ages': 'istorie',
  'renaissance': 'istorie',
  'wwii': 'istorie',
  'cold-war': 'istorie',
  'french-revolution': 'istorie',
  'roman-empire': 'istorie',
  'medieval-europe': 'istorie',

  // GEOGRAFIE
  'european-capitals': 'geografie',
  'world-geography': 'geografie',
  'physical-geography': 'geografie',
  'continents-oceans': 'geografie',
  'countries-flags': 'geografie',

  // BIOLOGIE
  'cell-biology': 'biologie',
  'human-body': 'biologie',
  'ecosystems': 'biologie',
  'genetics': 'biologie',
  'evolution': 'biologie',

  // Adaugă aici noi mapări pentru alte discipline
};

/**
 * Validează structura unei întrebări
 */
function validateQuestion(question, file) {
  const required = ['question', 'answers', 'difficulty', 'themeId', 'category', 'explanation'];
  const missing = required.filter(field => !question[field]);

  if (missing.length > 0) {
    throw new Error(`Question in ${file} is missing required fields: ${missing.join(', ')}`);
  }

  if (!Array.isArray(question.answers) || question.answers.length !== 4) {
    throw new Error(`Question "${question.question}" must have exactly 4 answers`);
  }

  const correctAnswers = question.answers.filter(a => a.correct === true);
  if (correctAnswers.length !== 1) {
    throw new Error(`Question "${question.question}" must have exactly 1 correct answer`);
  }

  if (!['easy', 'medium', 'hard'].includes(question.difficulty)) {
    throw new Error(`Question "${question.question}" has invalid difficulty: ${question.difficulty}`);
  }

  return true;
}

async function importQuestions() {
  try {
    console.log('🚀 Starting questions import...\n');

    // Citește toate fișierele JSON din src/data/
    // IMPORTANT: Scriptul e în scripts/, deci urcăm un nivel înapoi
    const dataDir = join(__dirname, '..', 'src', 'data');
    const files = readdirSync(dataDir).filter(f =>
      f.startsWith('questions-') && f.endsWith('.json')
    );

    if (files.length === 0) {
      console.log('❌ No question files found in src/data/');
      process.exit(1);
    }

    console.log(`📁 Found ${files.length} question files:\n${files.map(f => `   - ${f}`).join('\n')}\n`);

    let totalImported = 0;
    let totalBatches = 0;
    let totalSkipped = 0;

    for (const file of files) {
      const filePath = join(dataDir, file);
      const content = readFileSync(filePath, 'utf-8');
      const questions = JSON.parse(content);

      console.log(`📝 Processing ${file} (${questions.length} questions)...`);

      // Firestore batch write limit = 500 operations
      // Split în batches dacă ai >500 întrebări per fișier
      const batchSize = 500;
      const batches = Math.ceil(questions.length / batchSize);

      for (let i = 0; i < batches; i++) {
        const batch = writeBatch(db);
        const start = i * batchSize;
        const end = Math.min((i + 1) * batchSize, questions.length);
        const batchQuestions = questions.slice(start, end);

        for (const question of batchQuestions) {
          try {
            // Validează întrebarea
            validateQuestion(question, file);

            // Obține subjectId din mapare
            const subjectId = THEME_TO_SUBJECT_MAP[question.themeId];

            if (!subjectId) {
              console.warn(`   ⚠️  Skipping question "${question.question}" - no subject mapping for themeId: ${question.themeId}`);
              totalSkipped++;
              continue;
            }

            // Pregătește documentul pentru Firestore
            const questionData = {
              question: question.question,
              answers: question.answers.map(a => ({
                text: a.text,
                correct: a.correct
              })),
              difficulty: question.difficulty,
              category: question.category,
              explanation: question.explanation,
              themeId: question.themeId,
              subjectId: subjectId,
              order: question.order || 0,
              createdAt: new Date(),
              updatedAt: new Date()
            };

            // Dacă întrebarea are custom ID, folosește-l; altfel Firestore generează automat
            if (question.id) {
              const docRef = doc(db, 'questions', question.id);
              batch.set(docRef, questionData);
            } else {
              const docRef = doc(collection(db, 'questions'));
              batch.set(docRef, questionData);
            }

          } catch (validationError) {
            console.error(`   ❌ Validation error: ${validationError.message}`);
            totalSkipped++;
          }
        }

        await batch.commit();
        totalBatches++;
        console.log(`   ✅ Batch ${i + 1}/${batches} committed (${batchQuestions.length - totalSkipped} questions)`);
      }

      totalImported += questions.length - totalSkipped;
      console.log(`   ✅ Total from ${file}: ${questions.length} questions (${totalSkipped} skipped)\n`);
    }

    console.log(`\n🎉 SUCCESS!`);
    console.log(`   Total files: ${files.length}`);
    console.log(`   Total batches: ${totalBatches}`);
    console.log(`   Total questions imported: ${totalImported}`);
    console.log(`   Total questions skipped: ${totalSkipped}\n`);

    process.exit(0);

  } catch (error) {
    console.error('❌ Error importing questions:', error);
    console.error('\nStack trace:', error.stack);
    process.exit(1);
  }
}

// Run import
importQuestions();