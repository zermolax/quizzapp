/**
 * initializeBadges.js
 *
 * Import badge definitions în Firestore
 *
 * RULARE: node scripts/initializeBadges.js
 */

import { db } from '../src/services/firebase.js';
import { collection, doc, setDoc } from 'firebase/firestore';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function initializeBadges() {
  console.log('🎖️  Pornire inițializare badges...\n');

  try {
    // Read badges from JSON
    const badgesPath = join(__dirname, '../src/data/badges.json');
    const badgesData = JSON.parse(readFileSync(badgesPath, 'utf8'));
    const badges = badgesData.badges;

    console.log(`📋 Găsite ${badges.length} badges în badges.json\n`);

    const badgesRef = collection(db, 'badges');
    let created = 0;

    for (const badge of badges) {
      const badgeDocRef = doc(badgesRef, badge.id);

      await setDoc(badgeDocRef, {
        ...badge,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      console.log(`✅ ${badge.name}`);
      console.log(`   ID: ${badge.id}`);
      console.log(`   Rarity: ${badge.rarity}`);
      console.log(`   Points: ${badge.points}`);
      console.log(`   Category: ${badge.category}`);
      console.log('');

      created++;
    }

    console.log(`\n✨ SUCCES! ${created} badges create în Firestore!\n`);
    console.log('📊 Breakdown:');

    const common = badges.filter(b => b.rarity === 'common').length;
    const rare = badges.filter(b => b.rarity === 'rare').length;
    const epic = badges.filter(b => b.rarity === 'epic').length;
    const legendary = badges.filter(b => b.rarity === 'legendary').length;

    console.log(`   Common: ${common}`);
    console.log(`   Rare: ${rare}`);
    console.log(`   Epic: ${epic}`);
    console.log(`   Legendary: ${legendary}\n`);

    process.exit(0);

  } catch (error) {
    console.error('❌ EROARE:', error);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

// Rulează funcția
initializeBadges();
