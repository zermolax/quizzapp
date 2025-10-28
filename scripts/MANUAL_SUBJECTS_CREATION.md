# 📚 Ghid: Creare Manuală Colecție Subjects în Firebase Console

## Pași de urmat (5 minute):

### 1️⃣ Deschide Firebase Console
```
https://console.firebase.google.com/project/quizzapp-e45dc/firestore
```

### 2️⃣ Click pe "Start Collection"
- Click pe butonul "**Start collection**" (dacă e prima colecție)
- SAU click pe "**Add collection**" (dacă există deja colecții)

### 3️⃣ Nume Colecție
```
Collection ID: subjects
```
Click "**Next**"

---

## 📄 Document 1 - ISTORIE

### Document ID:
```
istorie
```

### Fields (adaugă câmp cu câmp):

| Field Name        | Type    | Value                                               |
|-------------------|---------|-----------------------------------------------------|
| `name`            | string  | `Istorie`                                           |
| `slug`            | string  | `istorie`                                           |
| `description`     | string  | `Explorează evenimente și personalități din istorie` |
| `icon`            | string  | `📚`                                                |
| `color`           | string  | `#E63946`                                           |
| `order`           | number  | `1`                                                 |
| `totalThemes`     | number  | `5`                                                 |
| `totalQuestions`  | number  | `0`                                                 |
| `isPublished`     | boolean | `true`                                              |

✅ Click "**Save**"

---

## 📄 Document 2 - GEOGRAFIE

Click "**Add document**" în colecția subjects

### Document ID:
```
geografie
```

### Fields:

| Field Name        | Type    | Value                                                    |
|-------------------|---------|----------------------------------------------------------|
| `name`            | string  | `Geografie`                                              |
| `slug`            | string  | `geografie`                                              |
| `description`     | string  | `Descoperă țări, capitale și fenomene geografice`       |
| `icon`            | string  | `🌍`                                                     |
| `color`           | string  | `#06A77D`                                                |
| `order`           | number  | `2`                                                      |
| `totalThemes`     | number  | `0`                                                      |
| `totalQuestions`  | number  | `0`                                                      |
| `isPublished`     | boolean | `false`                                                  |

✅ Click "**Save**"

---

## 📄 Document 3 - BIOLOGIE

Click "**Add document**" în colecția subjects

### Document ID:
```
biologie
```

### Fields:

| Field Name        | Type    | Value                                          |
|-------------------|---------|------------------------------------------------|
| `name`            | string  | `Biologie`                                     |
| `slug`            | string  | `biologie`                                     |
| `description`     | string  | `Învață despre viața, organisme și ecosisteme` |
| `icon`            | string  | `🧬`                                           |
| `color`           | string  | `#6A4C93`                                      |
| `order`           | number  | `3`                                            |
| `totalThemes`     | number  | `0`                                            |
| `totalQuestions`  | number  | `0`                                            |
| `isPublished`     | boolean | `false`                                        |

✅ Click "**Save**"

---

## ✅ Verificare

După ce ai creat toate documentele, verifică în Firestore că:

```
📁 subjects/
  ├── 📄 istorie (9 fields)
  ├── 📄 geografie (9 fields)
  └── 📄 biologie (9 fields)
```

---

## ➡️ Următorul Pas

După ce ai terminat, **anunță-mă** și voi continua cu:
- **FAZA 1.2**: Migrarea themes cu câmpul `subjectId`

---

## 💡 Tips

- **Copy-Paste**: Poți copia valorile direct din acest fișier
- **Field Types**: Asigură-te că selectezi tipul corect (string/number/boolean)
- **Document IDs**: Trebuie să fie EXACT ca în ghid (istorie, geografie, biologie)
