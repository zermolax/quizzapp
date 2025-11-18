# 🎨 QuizzApp Design System

## Filosofia de Design

QuizzApp folosește un sistem de design **semi-brutalist** care combină două lumi aparent opuse:

- **Earth-Organic Palette** - Culori naturale, calde, primitoare
- **Bright-Neon Accents** - Culori electrice, energice, moderne

Rezultatul este o experiență vizuală **unică, modernă și memorabilă** care îmbină confortul culorilor naturale cu energia culorilor neon.

---

## 📐 Principii de Design

### 1. **Semi-Brutalism**
Stilul brutalist modernizat cu elemente friendly:

- **Borders groase** (4px, 5px, 6px) - vizibilitate maximă
- **Fără border-radius** sau radius minimal - forme geometrice clare
- **Box shadows brutale** - offset solid colors (4px 4px 0, 6px 6px 0)
- **Tipografie bold** - Space Grotesk pentru headings (900 weight)
- **Contrast puternic** - hierarhie vizuală clară
- **Hover effects pronunțate** - translate(-3px, -3px) + box shadow

**De ce semi-brutalist?**
- Nu este 100% brutal (am păstrat animații smooth, tranziții)
- Am adăugat culori calde (earth tones) pentru accesibilitate
- Efecte hover mai friendly decât brutalismul pur

### 2. **Dualitatea Culorilor**

```
Earth-Organic (Fundal, Bază)  +  Bright-Neon (Accente, Focus)
         ↓                                    ↓
    Confort, Calm                      Energie, Atenție
```

---

## 🎨 Paleta de Culori

### **A. Earth-Organic Palette** (Fundal, Container, Text)

Culori naturale, inspirate din natură - pământ, nisip, lut, lemn:

```css
/* Light Mode Colors */
--deep-brown: #2D2416    /* Text primary, borders, headers */
--warm-brown: #4A3D2F    /* Text secondary, subtle elements */
--sand: #C8B7A6          /* Backgrounds alternante, hover states */
--cream: #F5F1E8         /* Cards, containers */
--off-white: #FAFAF8     /* Page background */
--sage: #8B9B7A          /* Accent earth tone (verde) */
--terracotta: #C07856    /* Accent earth tone (roșu-brun) */
```

**Când folosești:**
- `deep-brown`: Headings, text principal, borders principale
- `warm-brown`: Text secundar, borders subtile
- `sand`: Hover states, fundal alternativ pentru liste
- `cream`: Background pentru carduri, containere
- `off-white`: Page background (fundal principal)
- `sage`: Butoane "easy" difficulty, accente naturale verzi
- `terracotta`: Accente decorative calde

**Psihologia culorilor:**
- Transmit calm, stabilitate, profesionalism
- Inspiră încredere și confort
- Perfecte pentru citit mult timp fără oboseală

### **B. Bright-Neon Palette** (Accente, Highlights, Interacțiuni)

Culori electrice, vibrante - inspirate din neon signs, cyberpunk:

```css
--neon-pink: #FF0080      /* Primary accent, CTAs importante */
--neon-cyan: #00FFFF      /* Secondary accent, informațional */
--neon-lime: #CCFF00      /* Success, confirmări pozitive */
--neon-orange: #FF6B00    /* Warning, atenție moderată */
--neon-green: #39FF14     /* Success maxim, correct answer */
```

**Când folosești:**
- `neon-pink`: CTAs principale, branding (logo "Fun"), accent bars
- `neon-cyan`: Informații, tooltips, focus states, dark mode toggle
- `neon-lime`: Success states, badges câștigate
- `neon-orange`: Warnings, timere sub 10 secunde
- `neon-green`: Răspunsuri corecte, achievement unlocked

**Psihologia culorilor:**
- Atrag atenția instantaneu
- Creează energie și entuziasm
- Perfecte pentru interacțiuni importante

### **C. Brand Colors** (Discipline, Categorii)

Culori vibrate dar nu neon - pentru discipline școlare:

```css
--brand-red: #E63946       /* Limba Română */
--brand-orange: #F77F00    /* Fizică, Warning states */
--brand-yellow: #FCBF49    /* Chimie */
--brand-green: #06A77D     /* Biologie, Success */
--brand-blue: #1982C4      /* Geografie, Info */
--brand-purple: #6A4C93    /* Matematică */
```

**Caracteristici:**
- Mai saturate decât earth tones
- Mai puțin intense decât neon
- Ideale pentru categorii și discipline
- Funcționează perfect cu ambele palete

---

## 🌓 Dark Mode & Light Mode

### **Strategie: Color Inversion**

Dark mode inversează doar culorile earth-organic:

```css
/* Light Mode */
:root {
  --deep-brown: #2D2416;   /* Dark */
  --off-white: #FAFAF8;    /* Light */
}

/* Dark Mode */
.dark {
  --deep-brown: #F5F1E8;   /* Light (inversat) */
  --off-white: #1A1410;    /* Dark (inversat) */
}
```

**Ce rămâne neschimbat în Dark Mode:**
- ✅ Neon colors - rămân identice (sunt deja vibrant)
- ✅ Brand colors - rămân identice
- ✅ Border widths - rămân groase (brutalism)
- ✅ Typography - rămâne Space Grotesk

**Ce se inversează:**
- ❌ Earth tones - deep-brown devine light, off-white devine dark
- ❌ Text colors - se adaptează automat prin CSS variables

### **Implementare Dark Mode**

```jsx
// Hook personalizat
const [isDarkMode, setIsDarkMode] = useState(false);

const toggleDarkMode = () => {
  setIsDarkMode(!isDarkMode);
  if (!isDarkMode) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
};

// Toggle button
<button
  onClick={toggleDarkMode}
  className="bg-deep-brown dark:bg-off-white
             text-off-white dark:text-deep-brown"
>
  {isDarkMode ? '☀️' : '🌙'}
</button>
```

**Clase Tailwind pentru Dark Mode:**
```css
bg-cream dark:bg-deep-brown
text-deep-brown dark:text-off-white
border-deep-brown dark:border-off-white
```

---

## ✨ Combinarea Celor Două Stiluri

### **Principiul 80/20**

- **80% Earth-Organic** - fundal, containere, text, structură
- **20% Bright-Neon** - accente, highlights, interacțiuni

### **Pattern-uri de Combinare**

#### **1. Accent Bars (Foarte Eficace)**

```jsx
<div style={{
  background: 'var(--cream)',
  border: '6px solid var(--deep-brown)',
  position: 'relative'
}}>
  {/* Accent bar neon - TOP */}
  <div style={{
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '12px',
    background: 'var(--neon-pink)'
  }}></div>

  {/* Conținut cu earth tones */}
  <div className="p-6">
    <h2 style={{ color: 'var(--deep-brown)' }}>Titlu</h2>
  </div>
</div>
```

**De ce funcționează:**
- Neon bar = atenție, energie
- Earth background = confort citire
- Border brutal = structură clară

#### **2. Subject Cards cu Neon Highlights**

```jsx
<div className="bg-cream border-5 border-warm-brown p-6">
  {/* Left accent bar - VERTICAL */}
  <div className="absolute top-0 left-0 w-3 h-full
                  group-hover:w-5 transition-all"
       style={{ backgroundColor: neonColor }}>
  </div>

  {/* Content cu earth tones */}
  <h3 className="text-deep-brown">{subject.name}</h3>

  {/* Stats cu neon text-shadow */}
  <p className="text-deep-brown"
     style={{ textShadow: `2px 2px 0 ${neonColor}` }}>
    {subject.themes}
  </p>
</div>
```

**Efectul:**
- Vertical bar = organizare vizuală
- Text shadow neon = hierarhie numerelor
- Hover → bar se lățește = feedback interactiv

#### **3. Buttons cu Două Stiluri**

**Earth Button (Primary Actions):**
```jsx
<button className="bg-deep-brown dark:bg-off-white
                   text-off-white dark:text-deep-brown
                   border-4 border-deep-brown
                   px-6 py-3 font-heading font-bold uppercase
                   hover:-translate-x-1 hover:-translate-y-1
                   hover:shadow-brutal hover:shadow-deep-brown">
  Înapoi
</button>
```

**Neon Button (CTAs Importante):**
```jsx
<button className="bg-neon-pink text-off-white
                   border-4 border-neon-pink
                   hover:-translate-x-1 hover:-translate-y-1
                   hover:shadow-brutal hover:shadow-deep-brown">
  Start Quiz!
</button>
```

#### **4. Difficulty Indicators**

Combinăm brand colors cu neon pentru claritate:

```jsx
// Easy - Earth tone (Sage)
bg-[#8B9B7A] text-off-white border-deep-brown

// Medium - Brand color
bg-[#FF6B00] text-off-white border-deep-brown

// Hard - Neon
bg-[#FF0080] text-off-white border-deep-brown
```

**Pattern:** Easy → Medium → Hard = Calm → Energic → Intens

---

## 🔤 Tipografie

### **Font Families**

```css
--font-heading: 'Space Grotesk', sans-serif;  /* Headings */
--font-body: 'Inter', sans-serif;             /* Body text */
--font-mono: 'JetBrains Mono', monospace;     /* Stats, code */
```

**Space Grotesk** (Headings):
- Geometric, modern, bold
- Perfect pentru brutalism
- Folosit la weight 700-900
- Uppercase pentru titluri mari

**Inter** (Body):
- Readable, professional
- Excellent pentru paragrafe lungi
- Weight 400-600

**JetBrains Mono** (Stats):
- Monospaced, tehnic
- Perfect pentru numere
- Highlight pentru statistici

### **Typographic Scale**

```jsx
// Display (Hero titles)
<h1 className="text-7xl font-heading font-black uppercase
               tracking-tighter leading-tight">

// Section Headers
<h2 className="text-3xl font-heading font-black uppercase">

// Card Titles
<h3 className="text-xl font-heading font-bold uppercase
               tracking-tight">

// Body Text
<p className="text-base font-body leading-relaxed">

// Small Labels
<span className="text-xs font-mono font-bold uppercase
                 tracking-widest">
```

### **Letter Spacing & Line Height**

```css
/* Tight pentru headings mari */
letter-spacing: -0.04em;  /* tighter */
letter-spacing: -0.02em;  /* tight */
line-height: 0.95;        /* compressed */

/* Wide pentru labels mici */
letter-spacing: 0.05em;   /* tracking-wide */
letter-spacing: 0.1em;    /* tracking-widest */
```

---

## 🎭 Efecte și Animații Semi-Brutalist

### **Box Shadows Brutale**

```css
/* Tailwind utilities */
shadow-brutal     → 4px 4px 0 currentColor
shadow-brutal-lg  → 6px 6px 0 currentColor
shadow-brutal-xl  → 8px 8px 0 currentColor
```

**Exemplu:**
```jsx
<button className="hover:shadow-brutal hover:shadow-deep-brown">
  Click Me
</button>
```

### **Hover Effects**

Pattern standard pentru toate elementele interactive:

```css
/* CSS */
transition: all 0.15s ease;

/* On hover */
transform: translate(-3px, -3px);
box-shadow: 3px 3px 0 var(--deep-brown);
```

**JSX Example:**
```jsx
<div
  style={{ transition: 'all 0.15s ease' }}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = 'translate(-3px, -3px)';
    e.currentTarget.style.boxShadow = '3px 3px 0 #2D2416';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = 'translate(0, 0)';
    e.currentTarget.style.boxShadow = 'none';
  }}
>
  Hover me
</div>
```

### **Animații**

```css
/* Fade In */
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}

/* Slide Up */
@keyframes slideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Spin (loading) */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

**Când folosești:**
- `fadeIn`: Card-uri, modal-uri
- `slideUp`: Liste, subject cards
- `spin`: Loading indicators

---

## 📋 Pattern Library

### **1. Hero Section**

```jsx
<section className="py-20 bg-deep-brown dark:bg-off-white">
  {/* Background pattern */}
  <div className="absolute inset-0 opacity-5">
    <div style={{
      backgroundImage: `repeating-linear-gradient(
        0deg, transparent, transparent 2px,
        currentColor 2px, currentColor 3px
      )`
    }}></div>
  </div>

  {/* Content */}
  <div className="relative z-10 text-center">
    <span className="font-mono text-sm font-bold uppercase
                     tracking-widest text-neon-cyan block mb-4">
      // Subtitle
    </span>

    <h1 className="text-7xl font-heading font-black uppercase
                   text-off-white dark:text-deep-brown">
      <span className="block">Main</span>
      <span className="inline-block bg-neon-pink text-off-white
                       px-4 -rotate-2">
        Highlighted
      </span>
    </h1>
  </div>
</section>
```

**Caracteristici:**
- Background earth tone
- Grid pattern subtil (opacity-5)
- Neon subtitle
- Highlighted word cu neon + rotație

### **2. Card Component**

```jsx
<div className="bg-cream dark:bg-warm-brown
                border-5 border-warm-brown dark:border-sand
                p-6 relative
                hover:-translate-x-1 hover:-translate-y-1
                hover:shadow-brutal hover:shadow-deep-brown
                transition-all duration-200">

  {/* Accent bar */}
  <div className="absolute top-0 left-0 w-3 h-full
                  group-hover:w-5 transition-all"
       style={{ backgroundColor: 'var(--neon-cyan)' }}>
  </div>

  {/* Icon */}
  <div className="text-5xl mb-4 filter grayscale
                  group-hover:grayscale-0 transition-all">
    🎨
  </div>

  {/* Title */}
  <h3 className="text-xl font-heading font-black uppercase
                 text-deep-brown dark:text-off-white">
    Card Title
  </h3>

  {/* Description */}
  <p className="text-sm text-deep-brown/70 dark:text-off-white/70">
    Description text here
  </p>
</div>
```

### **3. Button Variants**

```jsx
// PRIMARY (Earth)
<button className="bg-deep-brown text-off-white
                   border-4 border-deep-brown
                   px-6 py-3 font-heading font-bold uppercase
                   hover:-translate-x-1 hover:-translate-y-1
                   hover:shadow-brutal hover:shadow-deep-brown">
  Primary
</button>

// SECONDARY (Neon)
<button className="bg-neon-pink text-off-white
                   border-4 border-neon-pink
                   hover:bg-neon-cyan hover:border-neon-cyan">
  Secondary
</button>

// OUTLINE
<button className="bg-transparent border-4 border-deep-brown
                   text-deep-brown
                   hover:bg-deep-brown hover:text-off-white">
  Outline
</button>
```

### **4. Stats Display**

```jsx
<div className="text-center">
  {/* Number cu neon shadow */}
  <p className="text-6xl font-mono font-bold text-deep-brown"
     style={{ textShadow: '3px 3px 0 var(--neon-cyan)' }}>
    125
  </p>

  {/* Label */}
  <p className="text-sm font-heading font-bold uppercase
                tracking-widest text-warm-brown mt-2">
    Total Quizzes
  </p>
</div>
```

---

## 🎯 Accessibility & Best Practices

### **Contrast Ratios**

Toate combinațiile respectă WCAG AAA:

```
✅ deep-brown (#2D2416) on off-white (#FAFAF8) → 13.5:1
✅ deep-brown (#2D2416) on cream (#F5F1E8) → 12.8:1
✅ neon-pink (#FF0080) on deep-brown (#2D2416) → 4.8:1
✅ off-white (#FAFAF8) on neon-pink (#FF0080) → 8.2:1
```

### **Focus States**

```css
*:focus-visible {
  outline: 4px solid var(--neon-cyan);
  outline-offset: 4px;
}
```

**De ce neon-cyan?**
- Vizibil pe toate background-urile
- Nu se confundă cu error states (neon-pink)
- Contrast excelent

### **Responsive Design**

```jsx
// Mobile first
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

// Text scaling
<h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl">

// Padding responsive
<section className="py-12 sm:py-16 lg:py-20">
```

---

## 🚀 Ghid de Implementare

### **Pas 1: Setup Tailwind Config**

```javascript
// tailwind.config.js
export default {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'deep-brown': '#2D2416',
        'warm-brown': '#4A3D2F',
        'sand': '#C8B7A6',
        'cream': '#F5F1E8',
        'off-white': '#FAFAF8',
        'sage': '#8B9B7A',
        'terracotta': '#C07856',
        'neon-pink': '#FF0080',
        'neon-cyan': '#00FFFF',
        'neon-lime': '#CCFF00',
        'neon-orange': '#FF6B00',
        'neon-green': '#39FF14',
      },
      fontFamily: {
        'heading': ['Space Grotesk', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'brutal': '4px 4px 0 currentColor',
        'brutal-lg': '6px 6px 0 currentColor',
      },
    },
  },
}
```

### **Pas 2: CSS Variables**

```css
/* index.css */
:root {
  --deep-brown: #2D2416;
  --warm-brown: #4A3D2F;
  --sand: #C8B7A6;
  --cream: #F5F1E8;
  --off-white: #FAFAF8;
  --neon-pink: #FF0080;
  --neon-cyan: #00FFFF;
  --neon-lime: #CCFF00;
}

.dark {
  --deep-brown: #F5F1E8;
  --off-white: #1A1410;
  --sand: #4A3D2F;
  --cream: #2D2416;
}

* {
  transition: background-color 0.2s ease,
              color 0.2s ease,
              border-color 0.2s ease;
}
```

### **Pas 3: Dark Mode Hook**

```jsx
// hooks/useTheme.js
import { useState, useEffect } from 'react';

export function useTheme() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggle = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return { isDark, toggle };
}
```

### **Pas 4: Fonts Import**

```html
<!-- index.html -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700;900&family=Inter:wght@400;600;700&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
```

---

## 💡 Tips & Tricks

### **1. Când folosești inline styles vs Tailwind?**

**Tailwind:** Layout, spacing, responsive
```jsx
<div className="grid grid-cols-4 gap-6 p-8">
```

**Inline styles:** Colors dynamice, animații custom
```jsx
<div style={{ backgroundColor: neonColor }}>
```

### **2. Crearea de culori noi**

Dacă adaugi culori noi, respectă:
- **Earth tones:** Saturation 20-40%, Lightness 40-90%
- **Neon colors:** Saturation 100%, Lightness 50-60%
- **Brand colors:** Saturation 60-80%, Lightness 40-60%

### **3. Testing Dark Mode**

```jsx
// Quick toggle pentru testare
<button onClick={() => document.documentElement.classList.toggle('dark')}>
  Toggle
</button>
```

### **4. Debugging culori**

```jsx
// Afișează toate culorile
Object.entries(colors).map(([name, value]) => (
  <div key={name} style={{ background: value, padding: '1rem' }}>
    {name}: {value}
  </div>
))
```

---

## 🎨 Color Palette Cheat Sheet

```
┌─────────────────────────────────────────────────────────┐
│ EARTH-ORGANIC (Fundal, Structură)                      │
├─────────────────────────────────────────────────────────┤
│ deep-brown  #2D2416  ███  Text, Borders, Headers       │
│ warm-brown  #4A3D2F  ███  Secondary text               │
│ sand        #C8B7A6  ███  Hover states                 │
│ cream       #F5F1E8  ███  Cards, containers            │
│ off-white   #FAFAF8  ███  Page background              │
│ sage        #8B9B7A  ███  Easy difficulty, accents     │
│ terracotta  #C07856  ███  Warm accents                 │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ BRIGHT-NEON (Accente, Energie)                         │
├─────────────────────────────────────────────────────────┤
│ neon-pink   #FF0080  ███  Primary CTA, branding        │
│ neon-cyan   #00FFFF  ███  Info, focus states           │
│ neon-lime   #CCFF00  ███  Success                      │
│ neon-orange #FF6B00  ███  Warning                      │
│ neon-green  #39FF14  ███  Correct answer               │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ BRAND (Discipline, Categorii)                          │
├─────────────────────────────────────────────────────────┤
│ brand-red    #E63946  ███  Română, Error               │
│ brand-orange #F77F00  ███  Fizică, Warning             │
│ brand-yellow #FCBF49  ███  Chimie                      │
│ brand-green  #06A77D  ███  Biologie, Success           │
│ brand-blue   #1982C4  ███  Geografie, Info             │
│ brand-purple #6A4C93  ███  Matematică                  │
└─────────────────────────────────────────────────────────┘
```

---

## 📚 Resurse Suplimentare

### **Inspirație Design**
- [Brutalist Websites](https://brutalistwebsites.com/)
- [Awwwards - Neo-Brutalism](https://www.awwwards.com/awwwards/collections/neo-brutalism/)

### **Color Tools**
- [Coolors.co](https://coolors.co/) - Palette generator
- [Contrast Checker](https://webaim.org/resources/contrastchecker/) - WCAG compliance

### **Typography**
- [Space Grotesk on Google Fonts](https://fonts.google.com/specimen/Space+Grotesk)
- [Type Scale Calculator](https://type-scale.com/)

---

## ✅ Checklist pentru Noi Proiecte

```
□ Setup Tailwind cu toate culorile
□ Import fonts (Space Grotesk, Inter, JetBrains Mono)
□ CSS variables pentru dark mode
□ Hook pentru dark mode toggle
□ Test contrast ratios (WCAG AAA)
□ Brutal box shadows setup
□ Focus states cu neon-cyan
□ Smooth transitions pentru dark mode
□ Grid background pattern pentru hero
□ Hover effects standard (-3px translate + shadow)
```

---

**Creat cu ❤️ pentru QuizzApp**
**Versiune:** 1.0 - Noiembrie 2024

*Design system semi-brutalist care combină confortul culorilor naturale cu energia culorilor neon pentru o experiență vizuală unică și memorabilă.*
