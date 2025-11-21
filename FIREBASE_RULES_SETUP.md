# 🔐 Firebase Rules pentru Challenges

## 📋 Instrucțiuni pas cu pas

### 1. Deschide Firebase Console
- Du-te la: https://console.firebase.google.com/
- Selectează proiectul tău: **quizzapp** (sau numele proiectului)

### 2. Navighează la Firestore Rules
- Click pe **Firestore Database** în sidebar
- Click pe tab-ul **Rules** (sus, lângă Data, Indexes)

### 3. Adaugă Rules pentru Challenges

Găsește secțiunea unde ai deja rules pentru `subjects`, `themes`, `questions`, etc.

**ADAUGĂ acestea ÎNAINTE de ultima paranteză închisă `}`:**

```javascript
// Rules pentru Challenges (1v1)
match /challenges/{challengeId} {
  // Oricine autentificat poate citi challenges
  allow read: if request.auth != null;

  // Oricine autentificat poate crea challenge
  allow create: if request.auth != null;

  // Doar creatorii pot actualiza propriile challenges
  // SAU participanții pot adăuga rezultatele lor
  allow update: if request.auth != null;

  // Doar creatorul poate șterge challenge-ul
  allow delete: if request.auth != null &&
                   resource.data.createdBy.uid == request.auth.uid;
}

// Rules pentru Daily Challenges (per user)
match /users/{userId}/dailyChallenges/{date} {
  // Doar user-ul poate să-și citească propriile challenges
  allow read: if request.auth != null && request.auth.uid == userId;

  // Doar user-ul poate să-și scrie propriile challenges
  allow write: if request.auth != null && request.auth.uid == userId;
}

// Rules pentru Daily Leaderboard
match /dailyLeaderboard/{date}/scores/{userId} {
  // Toți userii autentificați pot citi leaderboard-ul
  allow read: if request.auth != null;

  // Doar user-ul poate să-și scrie propriul scor
  allow write: if request.auth != null && request.auth.uid == userId;
}
```

### 4. Exemplu complet de Rules

Iată cum ar trebui să arate **ÎNTREGUL** fișier de rules (inclusiv ce ai deja + cele noi):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Rules existente pentru Users
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;

      // Subcollections pentru user
      match /badges/{badgeId} {
        allow read: if request.auth != null;
        allow write: if request.auth != null && request.auth.uid == userId;
      }

      // ADAUGĂ AICI Daily Challenges
      match /dailyChallenges/{date} {
        allow read: if request.auth != null && request.auth.uid == userId;
        allow write: if request.auth != null && request.auth.uid == userId;
      }

      // Challenge History
      match /challengeHistory/{challengeId} {
        allow read: if request.auth != null && request.auth.uid == userId;
        allow write: if request.auth != null && request.auth.uid == userId;
      }
    }

    // Rules existente pentru Subjects, Themes, Questions
    match /subjects/{subjectId} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    match /themes/{themeId} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    match /questions/{questionId} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    match /badges/{badgeId} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    match /quizSessions/{sessionId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null && resource.data.userId == request.auth.uid;
      allow delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }

    // ADAUGĂ AICI Challenges (1v1)
    match /challenges/{challengeId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null;
      allow delete: if request.auth != null &&
                       resource.data.createdBy.uid == request.auth.uid;
    }

    // ADAUGĂ AICI Daily Leaderboard
    match /dailyLeaderboard/{date}/scores/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 5. Publish Rules

- După ce ai adăugat rules-urile, click pe **Publish** (buton albastru sus-dreapta)
- Confirmă publish-ul
- **GATA!** 🎉

---

## ✅ Verificare

După ce ai publicat rules-urile, testează:

1. **Daily Challenge:**
   - Refresh app-ul
   - Click pe "🌟 Daily Challenge"
   - Ar trebui să meargă fără erori

2. **1v1 Challenge:**
   - Click pe "⚔️ 1v1" în header
   - Selectează difficulty + subject
   - Click "Creează Provocare"
   - **Ar trebui să creeze challenge-ul fără eroare!**

---

## 🐛 Dacă încă nu merge

Verifică în **Browser Console** (F12):
- Dacă vezi erori de tip "PERMISSION_DENIED"
- Screenshot la console și trimite-mi-l

Verifică în **Firebase Console → Firestore → Rules**:
- Dacă rules-urile au fost publicate corect
- Dacă nu sunt erori de sintaxă (o să apară în roșu)

---

## 📝 Note

- Rules-urile **NU** afectează baza de date existentă
- Rules-urile **DOAR** controlează cine poate citi/scrie date
- Dacă ai deja date în Firestore, ele rămân neschimbate
- Regula `if request.auth != null` înseamnă: "doar userii autentificați"
- Regula `if request.auth.uid == userId` înseamnă: "doar proprietarul datelor"

---

Succes! 🚀
