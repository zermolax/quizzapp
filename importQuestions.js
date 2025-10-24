// importQuestions.js
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, writeBatch, doc } from 'firebase/firestore';
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

async function importQuestions() {
  try {
    console.log('🚀 Starting questions import...\n');

    // Citește toate fișierele JSON din src/data/
    const dataDir = join(__dirname, 'src', 'data');
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

        batchQuestions.forEach((question) => {
          const docRef = doc(collection(db, 'questions'));
          batch.set(docRef, {
            ...question,
            createdAt: new Date(),
            updatedAt: new Date()
          });
        });

        await batch.commit();
        totalBatches++;
        console.log(`   ✅ Batch ${i + 1}/${batches} committed (${batchQuestions.length} questions)`);
      }

      totalImported += questions.length;
      console.log(`   ✅ Total from ${file}: ${questions.length} questions\n`);
    }

    console.log(`\n🎉 SUCCESS!`);
    console.log(`   Total files: ${files.length}`);
    console.log(`   Total batches: ${totalBatches}`);
    console.log(`   Total questions imported: ${totalImported}\n`);
    
    process.exit(0);

  } catch (error) {
    console.error('❌ Error importing questions:', error);
    console.error('\nStack trace:', error.stack);
    process.exit(1);
  }
}

// Run import
importQuestions();