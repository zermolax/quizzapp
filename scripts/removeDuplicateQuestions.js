// removeDuplicateQuestions.js - Remove duplicate questions from Firestore
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, doc, query, orderBy } from 'firebase/firestore';

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

async function removeDuplicates() {
  try {
    console.log('🔍 Starting duplicate detection...\n');

    // Fetch all questions
    const questionsRef = collection(db, 'questions');
    const q = query(questionsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    console.log(`📊 Total questions in database: ${snapshot.size}\n`);

    // Group by unique content (question text + themeId)
    const questionMap = new Map();
    const duplicates = [];

    snapshot.docs.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      const key = `${data.question}|${data.themeId}|${data.difficulty}`;

      if (questionMap.has(key)) {
        // This is a duplicate - keep the OLDER one (first created)
        const existing = questionMap.get(key);
        const existingDate = existing.data.createdAt?.toDate() || new Date(0);
        const currentDate = data.createdAt?.toDate() || new Date(0);

        if (currentDate > existingDate) {
          // Current is newer, mark it as duplicate
          duplicates.push({
            id: docSnapshot.id,
            question: data.question,
            themeId: data.themeId,
            createdAt: currentDate
          });
        } else {
          // Existing is newer, replace it and mark existing as duplicate
          duplicates.push({
            id: existing.id,
            question: existing.data.question,
            themeId: existing.data.themeId,
            createdAt: existingDate
          });
          questionMap.set(key, {
            id: docSnapshot.id,
            data: data
          });
        }
      } else {
        // First occurrence
        questionMap.set(key, {
          id: docSnapshot.id,
          data: data
        });
      }
    });

    console.log(`✅ Unique questions: ${questionMap.size}`);
    console.log(`❌ Duplicates found: ${duplicates.length}\n`);

    if (duplicates.length === 0) {
      console.log('🎉 No duplicates found! Database is clean.\n');
      process.exit(0);
    }

    // Show duplicates
    console.log('📋 Duplicate questions to be deleted:\n');
    duplicates.forEach((dup, index) => {
      console.log(`${index + 1}. ${dup.question.substring(0, 60)}... (${dup.themeId}) - ${dup.createdAt.toISOString()}`);
    });

    console.log('\n⚠️  WARNING: This will DELETE the above questions from Firestore!');
    console.log('⚠️  Press Ctrl+C NOW to cancel, or wait 5 seconds to proceed...\n');

    // Wait 5 seconds before deleting
    await new Promise(resolve => setTimeout(resolve, 5000));

    console.log('🗑️  Starting deletion...\n');

    let deleted = 0;
    for (const dup of duplicates) {
      try {
        await deleteDoc(doc(db, 'questions', dup.id));
        deleted++;
        if (deleted % 10 === 0) {
          console.log(`   Deleted ${deleted}/${duplicates.length}...`);
        }
      } catch (error) {
        console.error(`   ❌ Failed to delete ${dup.id}:`, error.message);
      }
    }

    console.log(`\n🎉 SUCCESS!`);
    console.log(`   Total duplicates deleted: ${deleted}`);
    console.log(`   Remaining questions: ${questionMap.size}`);
    console.log(`   Database is now clean!\n`);

    process.exit(0);

  } catch (error) {
    console.error('❌ Error removing duplicates:', error);
    console.error('\nStack trace:', error.stack);
    process.exit(1);
  }
}

// Run cleanup
removeDuplicates();
