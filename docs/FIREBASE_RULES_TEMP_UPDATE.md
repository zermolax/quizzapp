# 🔧 Actualizare Temporară Firebase Security Rules

## De ce avem nevoie de acest update?

Firebase Security Rules blochează write-urile din scripturi.
Pentru import, trebuie să permitem temporar write-uri pentru colecția `themes` și `questions`.

---

## ⚡ Pași Rapizi (3 minute):

### 1️⃣ Deschide Firebase Console - Rules

```
https://console.firebase.google.com/project/quizzapp-e45dc/firestore/rules
```

### 2️⃣ Găsește secțiunea pentru Firestore Rules

Vei vedea ceva similar cu:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Reguli existente...
  }
}
```

### 3️⃣ Adaugă Reguli TEMPORARE

**ADAUGĂ** următoarele linii ÎNAINTE de ultimul `}`:

```javascript
    // ⚠️ TEMPORAR - Pentru import themes și questions
    match /themes/{themeId} {
      allow read, write: if true;
    }

    match /questions/{questionId} {
      allow read, write: if true;
    }
```

**Exemplu complet:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Reguli existente pentru users, etc...

    // ⚠️ TEMPORAR - Pentru import themes și questions
    match /themes/{themeId} {
      allow read, write: if true;
    }

    match /questions/{questionId} {
      allow read, write: if true;
    }

  }
}
```

### 4️⃣ Publish Rules

- Click pe butonul **"Publish"** (sau **"Deploy"**)
- Așteaptă confirmarea (2-3 secunde)

---

## 🚀 Rulează Scripturile

### Import Themes:
```bash
node scripts/importThemesWithSubjects.js
```

### Migrare Questions (după themes):
```bash
node scripts/migrateQuestionsToSubjects.js
```

---

## 🔒 IMPORTANT: Revert Rules După Import!

După ce scripturile rulează cu succes, **TREBUIE** să revii la Firebase Console și să schimbi:

### De la (TEMPORAR):
```javascript
match /themes/{themeId} {
  allow read, write: if true;  // ❌ Prea permisiv!
}
```

### La (SECURIZAT):
```javascript
match /themes/{themeId} {
  allow read: if true;
  allow write: if request.auth != null;  // ✅ Doar useri autentificați
}
```

### Același lucru pentru `questions`:
```javascript
match /questions/{questionId} {
  allow read: if true;
  allow write: if request.auth != null;  // ✅ Doar useri autentificați
}
```

Apoi click **"Publish"** din nou!

---

## ✅ Checklist Final

- [ ] Actualizat Firebase Rules (TEMPORAR)
- [ ] Rulat `node scripts/importThemesWithSubjects.js` ✅
- [ ] Rulat `node scripts/migrateQuestionsToSubjects.js` ✅
- [ ] REVERT Firebase Rules la versiunea SECURIZATĂ ⚠️
- [ ] Verificat că aplicația funcționează normal

---

## ⚠️ Notă de Securitate

Nu lăsa rules-urile cu `allow write: if true` permanent!
Oricine ar putea modifica datele din Firestore!
