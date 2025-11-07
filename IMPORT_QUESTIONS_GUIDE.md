# 📚 Ghid Complet: Cum să Imporți Întrebări în Firestore

## 🎯 Ce ai nevoie să știi

### Structura unei Întrebări în Firestore

Fiecare întrebare (`questions` collection) are următoarea structură:

```javascript
{
  id: "rq003",                    // String (opțional - generat automat de Firestore dacă lipsește)
  question: "Care oraș este...",  // String - textul întrebării
  answers: [                       // Array cu exact 4 răspunsuri
    { text: "Florenta", correct: true },
    { text: "Roma", correct: false },
    { text: "Veneția", correct: false },
    { text: "Milano", correct: false }
  ],
  difficulty: "easy",              // String: "easy", "medium", sau "hard"
  category: "Context istoric",     // String - categoria întrebării
  explanation: "Florenta...",      // String - explicația răspunsului corect
  themeId: "renaissance",          // String - ID-ul temei (ex: "renaissance", "wwi")
  subjectId: "istorie",            // String - ID-ul disciplinei (ex: "istorie", "geografie")
  order: 3,                        // Number - ordinea în quiz (opțional, default 0)
  createdAt: Timestamp,            // Timestamp - generat automat la import
  updatedAt: Timestamp             // Timestamp - generat automat la import
}
```

---

## 📝 Template JSON pentru Întrebări Noi

Salvează întrebările tale în fișiere JSON în `src/data/` cu numele: `questions-{theme-id}.json`

**Exemplu: `src/data/questions-wwii.json`**

```json
[
  {
    "id": "wwii001",
    "themeId": "wwii",
    "difficulty": "easy",
    "question": "În ce an a început al Doilea Război Mondial?",
    "answers": [
      { "text": "1939", "correct": true },
      { "text": "1940", "correct": false },
      { "text": "1941", "correct": false },
      { "text": "1938", "correct": false }
    ],
    "explanation": "Al Doilea Război Mondial a început pe 1 septembrie 1939 când Germania a invadat Polonia.",
    "category": "Cronologie",
    "order": 1
  },
  {
    "id": "wwii002",
    "themeId": "wwii",
    "difficulty": "medium",
    "question": "Ce operațiune militară a marcat debarcarea Aliaților în Normandia?",
    "answers": [
      { "text": "Operațiunea Overlord (D-Day)", "correct": true },
      { "text": "Operațiunea Barbarossa", "correct": false },
      { "text": "Operațiunea Market Garden", "correct": false },
      { "text": "Operațiunea Torch", "correct": false }
    ],
    "explanation": "Operațiunea Overlord, cunoscută și ca D-Day, a avut loc pe 6 iunie 1944 și a fost cea mai mare operațiune amfibie din istorie.",
    "category": "Operațiuni militare",
    "order": 2
  },
  {
    "id": "wwii003",
    "themeId": "wwii",
    "difficulty": "hard",
    "question": "Cine a fost comandantul forțelor germane în Africa de Nord?",
    "answers": [
      { "text": "Erwin Rommel", "correct": true },
      { "text": "Heinz Guderian", "correct": false },
      { "text": "Friedrich Paulus", "correct": false },
      { "text": "Gerd von Rundstedt", "correct": false }
    ],
    "explanation": "Erwin Rommel, supranumit 'Vulpea Deșertului', a comandat Afrika Korps între 1941-1943.",
    "category": "Comandanți militari",
    "order": 3
  }
]
```

---

## 🔑 Reguli Importante

### 1. **Câmpuri Obligatorii**
- ✅ `question` - textul întrebării
- ✅ `answers` - array cu exact 4 răspunsuri (fiecare cu `text` și `correct`)
- ✅ `difficulty` - doar: `"easy"`, `"medium"`, sau `"hard"`
- ✅ `themeId` - ID-ul temei (trebuie să existe în mapare)
- ✅ `category` - categoria întrebării
- ✅ `explanation` - explicația răspunsului corect

### 2. **Câmpuri Opționale**
- `id` - dacă lipsește, Firestore generează automat unul unic
- `order` - ordinea în quiz (default: 0)

### 3. **Reguli de Validare**
- **Exact 4 răspunsuri** pentru fiecare întrebare
- **Exact 1 răspuns corect** (cu `correct: true`)
- **Difficulty** doar: `easy`, `medium`, sau `hard`
- **themeId** trebuie să existe în `THEME_TO_SUBJECT_MAP` din script

---

## 🗺️ Mapare Tematici → Discipline

**IMPORTANT**: Înainte de import, verifică că `themeId`-ul tău există în maparea din script!

Maparea actuală (`scripts/importQuestions.js`, liniile 30-58):

```javascript
const THEME_TO_SUBJECT_MAP = {
  // ISTORIE
  'wwi': 'istorie',
  'wwii': 'istorie',
  'ancient-greece': 'istorie',
  'ancient-rome': 'istorie',
  'middle-ages': 'istorie',
  'renaissance': 'istorie',
  'cold-war': 'istorie',
  'french-revolution': 'istorie',

  // GEOGRAFIE
  'european-capitals': 'geografie',
  'world-geography': 'geografie',
  'physical-geography': 'geografie',

  // BIOLOGIE
  'cell-biology': 'biologie',
  'human-body': 'biologie',
  'ecosystems': 'biologie',
};
```

### Dacă adaugi o temă nouă:

1. Editează `scripts/importQuestions.js`
2. Adaugă maparea în `THEME_TO_SUBJECT_MAP`
3. Exemplu pentru o temă nouă "ww2-pacific":
   ```javascript
   'ww2-pacific': 'istorie',
   ```

---

## 🔥 Reguli Firestore pentru Import

### Înainte de primul import, verifică regulile Firestore:

**Firestore Console** → **Rules** → Actualizează:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // Permite citire tuturor utilizatorilor autentificați
    match /questions/{questionId} {
      allow read: if request.auth != null;
      allow write: if false;  // Doar prin script sau Firebase Console
    }

    match /subjects/{subjectId} {
      allow read: if request.auth != null;
      allow write: if false;
    }

    match /themes/{themeId} {
      allow read: if request.auth != null;
      allow write: if false;
    }

    // Alte reguli pentru users, sessions, etc.
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    match /quizSessions/{sessionId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**Notă**: Regulile de mai sus permit:
- ✅ Citire pentru utilizatori autentificați
- ❌ Scriere doar prin script sau Firebase Console (nu din aplicație)

---

## 🚀 Cum să Rulezi Scriptul de Import

### Pasul 1: Pregătește fișierul JSON

Creează fișierul în `src/data/`:
```bash
touch src/data/questions-wwii.json
```

Completează-l cu întrebări folosind template-ul de mai sus.

### Pasul 2: Actualizează maparea (dacă e nevoie)

Dacă adaugi o temă nouă, editează `scripts/importQuestions.js` și adaugă maparea în `THEME_TO_SUBJECT_MAP`.

### Pasul 3: Rulează scriptul

Din rădăcina proiectului:

```bash
node scripts/importQuestions.js
```

### Output-ul va arăta astfel:

```
🚀 Starting questions import...

📁 Found 6 question files:
   - questions-ancient-greece.json
   - questions-ancient-rome.json
   - questions-middle-ages.json
   - questions-renaissance.json
   - questions-wwi.json
   - questions-wwii.json

📝 Processing questions-wwii.json (50 questions)...
   ✅ Batch 1/1 committed (50 questions)
   ✅ Total from questions-wwii.json: 50 questions (0 skipped)

🎉 SUCCESS!
   Total files: 6
   Total batches: 6
   Total questions imported: 250
   Total questions skipped: 0
```

---

## ⚠️ Troubleshooting

### Error: "no subject mapping for themeId"

**Cauză**: `themeId`-ul din JSON nu există în `THEME_TO_SUBJECT_MAP`

**Soluție**: Adaugă maparea în `scripts/importQuestions.js`:
```javascript
'tema-noua': 'disciplina',
```

### Error: "must have exactly 4 answers"

**Cauză**: O întrebare are mai puțin sau mai mult de 4 răspunsuri

**Soluție**: Verifică că fiecare întrebare are exact 4 opțiuni în array-ul `answers`

### Error: "must have exactly 1 correct answer"

**Cauză**: O întrebare are 0 sau 2+ răspunsuri cu `correct: true`

**Soluție**: Asigură-te că exact un răspuns are `correct: true`

### Error: "invalid difficulty"

**Cauză**: Valoare invalidă pentru `difficulty`

**Soluție**: Folosește doar: `"easy"`, `"medium"`, sau `"hard"`

---

## 📊 Best Practices

### 1. **Naming Convention pentru Fișiere**
```
questions-{theme-slug}.json
```
Exemple:
- `questions-wwii.json`
- `questions-cold-war.json`
- `questions-ancient-egypt.json`

### 2. **ID-uri pentru Întrebări**
- Folosește un prefix + număr: `wwii001`, `wwii002`, etc.
- Sau lasă câmpul `id` gol și Firestore va genera automat

### 3. **Organizare pe Difficulty**
- 40% easy (întrebări de bază)
- 40% medium (întrebări moderate)
- 20% hard (întrebări avansate)

### 4. **Lungimea Textelor**
- **Question**: 10-150 caractere (clar și concis)
- **Answer text**: 5-80 caractere
- **Explanation**: 50-300 caractere (detaliat dar nu prea lung)
- **Category**: 10-30 caractere

### 5. **Calitatea Explicațiilor**
- Explică DE CE este corect răspunsul
- Adaugă context istoric/științific
- Menționează surse sau date importante

---

## 🎓 Exemplu Complet: Disciplină Nouă

### Să adăugăm "Geografie - Capitals of Europe":

**1. Creează fișierul JSON:**
`src/data/questions-european-capitals.json`

```json
[
  {
    "id": "euro-cap-001",
    "themeId": "european-capitals",
    "difficulty": "easy",
    "question": "Care este capitala Franței?",
    "answers": [
      { "text": "Paris", "correct": true },
      { "text": "Lyon", "correct": false },
      { "text": "Marseille", "correct": false },
      { "text": "Toulouse", "correct": false }
    ],
    "explanation": "Paris este capitala și cel mai mare oraș al Franței, situat pe râul Sena.",
    "category": "Capitale Europene",
    "order": 1
  }
]
```

**2. Adaugă maparea în script:**
`scripts/importQuestions.js`, linia ~44:

```javascript
// GEOGRAFIE
'european-capitals': 'geografie',
```

**3. Rulează importul:**
```bash
node scripts/importQuestions.js
```

**4. Verifică în Firestore Console** că întrebările au fost adăugate corect.

---

## 🔗 Link-uri Utile

- **Firestore Console**: https://console.firebase.google.com/project/quizzapp-e45dc/firestore
- **Firebase Rules**: https://console.firebase.google.com/project/quizzapp-e45dc/firestore/rules

---

## 💡 Tips & Tricks

### Import Rapid pentru Testing

Dacă vrei să testezi doar câteva întrebări fără a importa tot fișierul:

1. Creează un fișier temporar: `src/data/questions-test.json`
2. Adaugă 3-5 întrebări
3. Rulează scriptul
4. Șterge fișierul după import

### Backup înainte de Import Masiv

Înainte de a importa 100+ întrebări noi:

1. **Firestore Console** → Export backup
2. Sau folosește Firebase CLI:
   ```bash
   firebase firestore:export backup-$(date +%Y%m%d)
   ```

### Re-import (Update Existing Questions)

Scriptul folosește `batch.set()` care SUPRASCRIE documentele existente cu același ID.

- Dacă vrei să UPDATE-ezi întrebări: păstrează același `id`
- Dacă vrei întrebări NOI: schimbă `id`-ul sau șterge câmpul

---

## 📞 Suport

Dacă întâmpini probleme:
1. Verifică console-ul pentru erori detaliate
2. Verifică că toate câmpurile obligatorii sunt completate
3. Asigură-te că Firestore Rules permit write-ul
4. Contactează: perviat@gmail.com

---

**Mult succes cu adăugarea de conținut! 🚀**
