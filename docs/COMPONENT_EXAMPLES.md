# 🧩 Component Examples - Copy & Paste Ready

Exemple practice de componente folosind design system-ul QuizzApp.
Toate componentele sunt **copy-paste ready** și respectă pattern-urile de design.

---

## 📦 Table of Contents

1. [Buttons](#buttons)
2. [Cards](#cards)
3. [Hero Sections](#hero-sections)
4. [Navigation](#navigation)
5. [Stats & Metrics](#stats--metrics)
6. [Modals](#modals)
7. [Forms](#forms)
8. [Badges & Tags](#badges--tags)
9. [Loading States](#loading-states)
10. [Animations](#animations)

---

## 🔘 Buttons

### Primary Button (Earth Tone)

```jsx
<button
  className="bg-deep-brown dark:bg-off-white
             text-off-white dark:text-deep-brown
             border-4 border-deep-brown dark:border-off-white
             px-6 py-3
             font-heading font-bold uppercase text-sm
             tracking-wide
             transition-all duration-150
             hover:-translate-x-1 hover:-translate-y-1
             hover:shadow-brutal hover:shadow-deep-brown
             dark:hover:shadow-off-white
             active:translate-x-0 active:translate-y-0
             active:shadow-none"
>
  Click Me
</button>
```

### Secondary Button (Neon)

```jsx
<button
  className="bg-neon-pink text-off-white
             border-4 border-neon-pink
             px-6 py-3
             font-heading font-bold uppercase text-sm
             transition-all duration-150
             hover:-translate-x-1 hover:-translate-y-1
             hover:shadow-brutal hover:shadow-deep-brown
             hover:bg-neon-cyan hover:border-neon-cyan"
>
  Start Quiz!
</button>
```

### Outline Button

```jsx
<button
  className="bg-transparent
             text-deep-brown dark:text-off-white
             border-4 border-deep-brown dark:border-off-white
             px-6 py-3
             font-heading font-bold uppercase text-sm
             transition-all duration-150
             hover:bg-deep-brown dark:hover:bg-off-white
             hover:text-off-white dark:hover:text-deep-brown"
>
  Cancel
</button>
```

### Icon Button

```jsx
<button
  className="w-12 h-12
             bg-deep-brown dark:bg-off-white
             text-off-white dark:text-deep-brown
             border-4 border-deep-brown dark:border-off-white
             flex items-center justify-center
             text-xl
             transition-all duration-150
             hover:bg-neon-cyan hover:text-deep-brown
             hover:rotate-12"
  aria-label="Toggle dark mode"
>
  🌙
</button>
```

### Difficulty Buttons (Group)

```jsx
<div className="flex gap-2">
  {/* Easy */}
  <button className="flex-1 bg-[#8B9B7A] text-off-white
                     border-4 border-deep-brown
                     px-4 py-3 font-heading font-bold uppercase text-xs
                     hover:-translate-y-1 hover:shadow-[0_4px_0_#2D2416]
                     transition-all duration-150">
    🟢 Ușor
  </button>

  {/* Medium */}
  <button className="flex-1 bg-[#FF6B00] text-off-white
                     border-4 border-deep-brown
                     px-4 py-3 font-heading font-bold uppercase text-xs
                     hover:-translate-y-1 hover:shadow-[0_4px_0_#2D2416]
                     transition-all duration-150">
    🟡 Mediu
  </button>

  {/* Hard */}
  <button className="flex-1 bg-[#FF0080] text-off-white
                     border-4 border-deep-brown
                     px-4 py-3 font-heading font-bold uppercase text-xs
                     hover:-translate-y-1 hover:shadow-[0_4px_0_#2D2416]
                     transition-all duration-150">
    🔴 Greu
  </button>
</div>
```

---

## 🃏 Cards

### Basic Card with Neon Accent

```jsx
<div
  className="bg-cream dark:bg-warm-brown
             border-5 border-warm-brown dark:border-sand
             p-6 relative
             transition-all duration-200
             hover:-translate-x-1 hover:-translate-y-1
             hover:shadow-brutal-lg hover:shadow-deep-brown
             group"
>
  {/* Left accent bar */}
  <div
    className="absolute top-0 left-0 w-3 h-full
               transition-all duration-300
               group-hover:w-5"
    style={{ backgroundColor: '#00FFFF' }}
  ></div>

  {/* Icon */}
  <div className="text-5xl mb-4 filter grayscale
                  group-hover:grayscale-0 transition-all duration-300">
    🎨
  </div>

  {/* Title */}
  <h3 className="text-xl font-heading font-black uppercase
                 tracking-tight text-deep-brown dark:text-off-white
                 mb-2">
    Card Title
  </h3>

  {/* Description */}
  <p className="text-sm font-body text-deep-brown/70
                dark:text-off-white/70 leading-snug mb-4">
    Card description goes here. Keep it concise and informative.
  </p>

  {/* CTA */}
  <button className="text-sm font-heading font-bold uppercase
                     text-neon-cyan hover:text-neon-pink
                     transition-colors duration-150">
    Learn More →
  </button>
</div>
```

### Subject Card with Stats

```jsx
<div className="bg-cream dark:bg-warm-brown
                border-5 border-warm-brown dark:border-sand
                p-6 relative min-h-[400px] flex flex-col
                hover:-translate-x-1 hover:-translate-y-1
                hover:border-deep-brown
                transition-all duration-200 group">

  {/* Vertical accent bar */}
  <div className="absolute top-0 left-0 w-3 h-full
                  transition-all duration-300 group-hover:w-5"
       style={{ backgroundColor: '#FF0080' }}>
  </div>

  {/* Header: Icon + Title */}
  <div className="flex items-center gap-3 mb-3 relative z-10">
    <div className="text-5xl filter grayscale
                    group-hover:grayscale-0 transition-all duration-300">
      📚
    </div>
    <h3 className="text-xl font-heading font-black uppercase
                   tracking-tight text-deep-brown dark:text-off-white">
      Limba Română
    </h3>
  </div>

  {/* Description */}
  <p className="text-sm text-deep-brown/70 dark:text-off-white/70
                mb-4 relative z-10">
    Testează cunoștințele de limba română
  </p>

  {/* Stats */}
  <div className="text-center py-4 mb-4 relative z-10">
    <div className="flex items-center justify-center gap-4">
      <div className="text-center">
        <p className="text-3xl font-mono font-black text-deep-brown
                      dark:text-off-white"
           style={{ textShadow: '2px 2px 0 #FF0080' }}>
          12
        </p>
        <p className="text-xs font-heading font-bold uppercase
                      tracking-wide text-deep-brown/70
                      dark:text-off-white/70 mt-1">
          Teme
        </p>
      </div>

      <div className="text-4xl text-deep-brown/30 dark:text-off-white/30">
        •
      </div>

      <div className="text-center">
        <p className="text-3xl font-mono font-black text-deep-brown
                      dark:text-off-white"
           style={{ textShadow: '2px 2px 0 #FF0080' }}>
          240+
        </p>
        <p className="text-xs font-heading font-bold uppercase
                      tracking-wide text-deep-brown/70
                      dark:text-off-white/70 mt-1">
          Întrebări
        </p>
      </div>
    </div>
  </div>

  {/* CTA Button */}
  <button className="w-full bg-deep-brown dark:bg-off-white
                     text-off-white dark:text-deep-brown
                     border-4 border-deep-brown dark:border-off-white
                     px-6 py-3 mt-auto
                     font-heading font-bold uppercase text-sm
                     hover:-translate-y-1 hover:shadow-brutal
                     hover:shadow-deep-brown transition-all duration-150">
    Vezi Tematici →
  </button>
</div>
```

### Stat Card with Neon Highlight

```jsx
<div className="bg-neon-lime border-6 border-deep-brown
                p-6 relative">
  {/* Left border accent */}
  <div className="absolute top-0 left-0 w-3 h-full bg-deep-brown"></div>

  {/* Stat */}
  <div className="text-center">
    <p className="font-mono text-xs uppercase tracking-widest
                  text-deep-brown mb-2 font-bold">
      Locul Tău
    </p>
    <p className="font-heading text-6xl font-black text-deep-brown">
      #42
    </p>
  </div>
</div>
```

---

## 🦸 Hero Sections

### Hero with Background Pattern

```jsx
<section className="py-20 pt-32 bg-deep-brown dark:bg-off-white
                    relative overflow-hidden">
  {/* Background grid pattern */}
  <div className="absolute inset-0 opacity-5 pointer-events-none">
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `
          repeating-linear-gradient(
            0deg, transparent, transparent 2px,
            currentColor 2px, currentColor 3px
          ),
          repeating-linear-gradient(
            90deg, transparent, transparent 2px,
            currentColor 2px, currentColor 3px
          )`
      }}
    ></div>
  </div>

  {/* Content */}
  <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
    {/* Subtitle */}
    <span className="font-mono text-sm font-bold uppercase
                     tracking-widest text-neon-cyan block mb-4">
      // Subtitle Here
    </span>

    {/* Main Title */}
    <h1 className="text-7xl font-heading font-black mb-6 uppercase
                   leading-tight tracking-tighter
                   text-off-white dark:text-deep-brown">
      <span className="block">Învață prin</span>
      <span className="inline-block bg-neon-pink text-off-white
                       px-4 -rotate-2">
        Joc
      </span>
    </h1>

    {/* Description */}
    <p className="text-xl font-body font-semibold max-w-3xl mx-auto
                  text-off-white/90 dark:text-deep-brown/90 mb-12">
      Descoperă cunoașterea prin quiz-uri interactive și provocatoare
    </p>

    {/* CTA Buttons */}
    <div className="flex gap-4 justify-center flex-wrap">
      <button className="bg-neon-pink text-off-white
                         border-4 border-neon-pink px-8 py-4
                         font-heading font-bold uppercase
                         hover:-translate-x-2 hover:-translate-y-2
                         hover:shadow-brutal-lg hover:shadow-neon-cyan
                         transition-all duration-150">
        Start Acum
      </button>

      <button className="bg-transparent text-off-white
                         dark:text-deep-brown
                         border-4 border-off-white dark:border-deep-brown
                         px-8 py-4 font-heading font-bold uppercase
                         hover:bg-off-white hover:text-deep-brown
                         dark:hover:bg-deep-brown dark:hover:text-off-white
                         transition-all duration-150">
        Află Mai Mult
      </button>
    </div>
  </div>
</section>
```

### Hero with Stats Grid

```jsx
<section className="py-16 bg-deep-brown dark:bg-off-white">
  <div className="max-w-7xl mx-auto px-4 text-center">
    <h1 className="text-6xl font-heading font-black
                   text-off-white dark:text-deep-brown mb-12">
      Statistici Impresionante
    </h1>

    {/* Stats Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
      {/* Stat 1 */}
      <div className="text-center">
        <p className="text-6xl font-mono font-bold
                      text-off-white dark:text-deep-brown"
           style={{ textShadow: '3px 3px 0 #00FFFF' }}>
          15
        </p>
        <p className="text-sm font-heading font-bold uppercase
                      tracking-widest mt-2
                      text-off-white/80 dark:text-deep-brown/80">
          Discipline
        </p>
      </div>

      {/* Stat 2 */}
      <div className="text-center">
        <p className="text-6xl font-mono font-bold
                      text-off-white dark:text-deep-brown"
           style={{ textShadow: '3px 3px 0 #FF0080' }}>
          200+
        </p>
        <p className="text-sm font-heading font-bold uppercase
                      tracking-widest mt-2
                      text-off-white/80 dark:text-deep-brown/80">
          Tematici
        </p>
      </div>

      {/* Stat 3 */}
      <div className="text-center">
        <p className="text-6xl font-mono font-bold
                      text-off-white dark:text-deep-brown"
           style={{ textShadow: '3px 3px 0 #CCFF00' }}>
          5000+
        </p>
        <p className="text-sm font-heading font-bold uppercase
                      tracking-widest mt-2
                      text-off-white/80 dark:text-deep-brown/80">
          Întrebări
        </p>
      </div>
    </div>
  </div>
</section>
```

---

## 🧭 Navigation

### Top Navigation Bar

```jsx
<nav className="bg-off-white dark:bg-deep-brown
                border-b-4 border-deep-brown dark:border-off-white
                fixed top-0 left-0 right-0 z-50">
  <div className="max-w-7xl mx-auto px-6 py-4">
    <div className="flex justify-between items-center">
      {/* Logo */}
      <div className="flex items-center gap-4">
        <h1 className="font-heading font-black text-2xl uppercase
                       tracking-tight text-deep-brown dark:text-off-white
                       cursor-pointer">
          Quizz<span className="text-neon-pink">Fun</span>
        </h1>
      </div>

      {/* Actions */}
      <div className="flex gap-2 items-center">
        {/* Dark mode toggle */}
        <button
          className="w-12 h-12 bg-deep-brown dark:bg-off-white
                     text-off-white dark:text-deep-brown
                     border-4 border-deep-brown dark:border-off-white
                     hover:bg-neon-cyan hover:text-deep-brown
                     hover:rotate-12 transition-all duration-150
                     flex items-center justify-center text-xl"
        >
          🌙
        </button>

        {/* Profile */}
        <button
          className="bg-deep-brown dark:bg-off-white
                     text-off-white dark:text-deep-brown
                     border-4 border-deep-brown dark:border-off-white
                     px-4 py-2 font-heading font-bold uppercase text-sm
                     hover:-translate-x-1 hover:-translate-y-1
                     hover:shadow-brutal hover:shadow-deep-brown
                     dark:hover:shadow-off-white
                     transition-all duration-150"
        >
          Profil
        </button>

        {/* Logout */}
        <button
          className="bg-[#E63946] text-white
                     border-4 border-[#E63946]
                     px-4 py-2 font-heading font-bold uppercase text-sm
                     hover:-translate-x-1 hover:-translate-y-1
                     hover:shadow-brutal hover:shadow-[#E63946]
                     transition-all duration-150"
        >
          Logout
        </button>
      </div>
    </div>
  </div>
</nav>
```

---

## 📊 Stats & Metrics

### Metric Card

```jsx
<div className="bg-sand border-4 border-warm-brown p-6 relative">
  {/* Top accent bar */}
  <div className="absolute top-0 left-0 right-0 h-2 bg-neon-cyan"></div>

  {/* Label */}
  <p className="font-mono text-xs uppercase tracking-widest
                text-warm-brown mb-2 font-bold">
    Quiz-uri Jucate
  </p>

  {/* Value */}
  <p className="font-heading text-5xl font-black text-deep-brown">
    125
  </p>
</div>
```

### Progress Bar

```jsx
<div>
  <div className="flex justify-between items-center mb-2">
    <span className="font-heading font-bold text-sm uppercase
                     text-deep-brown dark:text-off-white">
      Progres
    </span>
    <span className="font-mono text-sm font-bold text-neon-cyan">
      75%
    </span>
  </div>

  {/* Progress bar container */}
  <div className="h-6 bg-sand border-4 border-deep-brown relative
                  overflow-hidden">
    {/* Progress fill */}
    <div
      className="h-full bg-neon-lime transition-all duration-500"
      style={{ width: '75%' }}
    >
      {/* Stripes pattern */}
      <div className="absolute inset-0 opacity-20"
           style={{
             backgroundImage: `repeating-linear-gradient(
               45deg,
               transparent,
               transparent 10px,
               rgba(0,0,0,0.1) 10px,
               rgba(0,0,0,0.1) 20px
             )`
           }}>
      </div>
    </div>
  </div>
</div>
```

---

## 🪟 Modals

### Centered Modal

```jsx
{/* Backdrop */}
<div className="fixed inset-0 bg-deep-brown/90 dark:bg-off-white/90
                flex items-center justify-center z-[2000] p-4">

  {/* Modal */}
  <div className="bg-cream dark:bg-warm-brown
                  border-6 border-deep-brown dark:border-off-white
                  max-w-lg w-full p-8 relative">

    {/* Top accent bar */}
    <div className="absolute top-0 left-0 right-0 h-3 bg-neon-pink"></div>

    {/* Header */}
    <h2 className="font-heading text-3xl font-black uppercase
                   text-deep-brown dark:text-off-white mb-6">
      🎲 Alege Dificultatea
    </h2>

    {/* Content */}
    <p className="font-body text-base text-deep-brown
                  dark:text-off-white mb-6">
      Selectează nivelul de dificultate pentru quiz-ul tău:
    </p>

    {/* Options */}
    <div className="space-y-3 mb-6">
      <button className="w-full bg-[#8B9B7A] text-off-white
                         border-4 border-deep-brown px-6 py-4
                         font-heading font-bold uppercase text-base
                         hover:-translate-x-1 hover:-translate-y-1
                         hover:shadow-brutal hover:shadow-deep-brown
                         transition-all duration-150">
        🟢 Ușor
      </button>

      <button className="w-full bg-[#FF6B00] text-off-white
                         border-4 border-deep-brown px-6 py-4
                         font-heading font-bold uppercase text-base
                         hover:-translate-x-1 hover:-translate-y-1
                         hover:shadow-brutal hover:shadow-deep-brown
                         transition-all duration-150">
        🟡 Mediu
      </button>

      <button className="w-full bg-[#FF0080] text-off-white
                         border-4 border-deep-brown px-6 py-4
                         font-heading font-bold uppercase text-base
                         hover:-translate-x-1 hover:-translate-y-1
                         hover:shadow-brutal hover:shadow-deep-brown
                         transition-all duration-150">
        🔴 Dificil
      </button>
    </div>

    {/* Cancel */}
    <button className="w-full bg-sand text-deep-brown
                       border-4 border-warm-brown px-6 py-3
                       font-heading font-bold uppercase text-sm
                       hover:-translate-x-1 hover:-translate-y-1
                       hover:shadow-brutal hover:shadow-warm-brown
                       transition-all duration-150">
      ← Înapoi
    </button>
  </div>
</div>
```

---

## 📝 Forms

### Input Field

```jsx
<div className="mb-4">
  <label className="block font-heading font-bold uppercase text-xs
                    tracking-wide text-deep-brown dark:text-off-white mb-2">
    Email
  </label>

  <input
    type="email"
    className="w-full bg-cream dark:bg-warm-brown
               text-deep-brown dark:text-off-white
               border-4 border-deep-brown dark:border-off-white
               px-4 py-3 font-body
               focus:outline-none focus:ring-4 focus:ring-neon-cyan
               transition-all duration-150"
    placeholder="numele@example.com"
  />
</div>
```

### Textarea

```jsx
<div className="mb-4">
  <label className="block font-heading font-bold uppercase text-xs
                    tracking-wide text-deep-brown dark:text-off-white mb-2">
    Mesaj
  </label>

  <textarea
    rows={4}
    className="w-full bg-cream dark:bg-warm-brown
               text-deep-brown dark:text-off-white
               border-4 border-deep-brown dark:border-off-white
               px-4 py-3 font-body resize-none
               focus:outline-none focus:ring-4 focus:ring-neon-cyan
               transition-all duration-150"
    placeholder="Scrie mesajul tău aici..."
  />
</div>
```

### Checkbox

```jsx
<label className="flex items-center gap-3 cursor-pointer">
  <input
    type="checkbox"
    className="w-6 h-6 border-4 border-deep-brown dark:border-off-white
               bg-cream dark:bg-warm-brown
               checked:bg-neon-pink checked:border-neon-pink
               focus:ring-4 focus:ring-neon-cyan
               transition-all duration-150"
  />
  <span className="font-body text-sm text-deep-brown dark:text-off-white">
    Sunt de acord cu termenii și condițiile
  </span>
</label>
```

---

## 🏷️ Badges & Tags

### Status Badge

```jsx
{/* Success */}
<span className="inline-block bg-neon-lime text-deep-brown
                 px-3 py-1 border-3 border-deep-brown
                 font-mono text-xs font-bold uppercase">
  Active
</span>

{/* Warning */}
<span className="inline-block bg-neon-orange text-off-white
                 px-3 py-1 border-3 border-deep-brown
                 font-mono text-xs font-bold uppercase">
  Pending
</span>

{/* Error */}
<span className="inline-block bg-[#E63946] text-off-white
                 px-3 py-1 border-3 border-deep-brown
                 font-mono text-xs font-bold uppercase">
  Error
</span>
```

### Category Tag

```jsx
<span className="inline-flex items-center gap-2
                 bg-sand border-3 border-warm-brown
                 px-4 py-2 font-heading font-bold uppercase text-xs">
  <span>📚</span>
  <span>Limba Română</span>
</span>
```

---

## ⏳ Loading States

### Spinner

```jsx
<div className="flex items-center justify-center min-h-screen
                bg-cream dark:bg-deep-brown">
  <div className="text-center">
    {/* Spinner */}
    <div className="w-16 h-16 border-6 border-sand
                    border-t-6 border-t-deep-brown dark:border-t-off-white
                    rounded-full animate-spin mx-auto mb-4">
    </div>

    {/* Text */}
    <p className="font-heading text-xl font-bold text-deep-brown
                  dark:text-off-white">
      Se încarcă...
    </p>
  </div>
</div>
```

### Skeleton Card

```jsx
<div className="bg-cream dark:bg-warm-brown
                border-5 border-warm-brown dark:border-sand
                p-6 animate-pulse">

  {/* Icon skeleton */}
  <div className="w-12 h-12 bg-sand dark:bg-deep-brown mb-4"></div>

  {/* Title skeleton */}
  <div className="h-6 bg-sand dark:bg-deep-brown mb-2 w-3/4"></div>

  {/* Description skeletons */}
  <div className="h-4 bg-sand dark:bg-deep-brown mb-2"></div>
  <div className="h-4 bg-sand dark:bg-deep-brown mb-2 w-5/6"></div>

  {/* Button skeleton */}
  <div className="h-10 bg-sand dark:bg-deep-brown mt-4"></div>
</div>
```

---

## 🎬 Animations

### Fade In

```jsx
<div className="animate-fadeIn">
  Content appears smoothly
</div>

{/* Add to CSS */}
<style>{`
  @keyframes fadeIn {
    from { opacity: 0; transform: scale(0.9); }
    to { opacity: 1; transform: scale(1); }
  }
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out;
  }
`}</style>
```

### Slide Up

```jsx
<div className="animate-slideUp">
  Content slides up
</div>

{/* Add to CSS */}
<style>{`
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-slideUp {
    animation: slideUp 0.4s ease-out;
  }
`}</style>
```

### Hover Lift

```jsx
<div
  className="transition-all duration-200"
  style={{ transition: 'all 0.2s ease' }}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = 'translate(-3px, -3px)';
    e.currentTarget.style.boxShadow = '3px 3px 0 #2D2416';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = 'translate(0, 0)';
    e.currentTarget.style.boxShadow = 'none';
  }}
>
  Hover pentru lift effect
</div>
```

---

## 🎨 Color Usage Examples

### Neon Highlight on Hover

```jsx
<button
  className="bg-deep-brown text-off-white px-6 py-3
             border-4 border-deep-brown
             font-heading font-bold uppercase
             transition-all duration-150
             hover:bg-neon-cyan hover:text-deep-brown
             hover:border-neon-cyan"
>
  Hover Me
</button>
```

### Text Shadow for Emphasis

```jsx
<h1
  className="text-6xl font-heading font-black text-deep-brown"
  style={{ textShadow: '4px 4px 0 var(--neon-pink)' }}
>
  Bold Title
</h1>
```

### Gradient Background (Advanced)

```jsx
<div
  className="p-12 border-6 border-deep-brown"
  style={{
    background: 'linear-gradient(135deg, #F5F1E8 0%, #C8B7A6 100%)'
  }}
>
  <h2 className="text-4xl font-heading font-black text-deep-brown">
    Gradient Background
  </h2>
</div>
```

---

## 💡 Pro Tips

### 1. Combining Multiple Effects

```jsx
<button
  className="
    /* Base styles */
    bg-cream text-deep-brown
    border-5 border-deep-brown
    px-8 py-4

    /* Typography */
    font-heading font-bold uppercase text-sm

    /* Hover: translate + shadow + color change */
    hover:-translate-x-2 hover:-translate-y-2
    hover:shadow-brutal-lg hover:shadow-neon-pink
    hover:bg-neon-pink hover:text-off-white
    hover:border-neon-pink

    /* Active state */
    active:translate-x-0 active:translate-y-0
    active:shadow-none

    /* Transition */
    transition-all duration-150
  "
>
  Multi-Effect Button
</button>
```

### 2. Responsive Design

```jsx
<div className="
  /* Mobile first */
  grid grid-cols-1 gap-4 p-4

  /* Tablet */
  md:grid-cols-2 md:gap-6 md:p-6

  /* Desktop */
  lg:grid-cols-4 lg:gap-8 lg:p-8
">
  {/* Cards */}
</div>
```

### 3. Dark Mode Toggle Pattern

```jsx
<div className="
  bg-cream dark:bg-warm-brown
  text-deep-brown dark:text-off-white
  border-deep-brown dark:border-off-white
">
  Content adapts to theme
</div>
```

---

**Toate componentele sunt testate și production-ready!** 🚀

*Copiază, pastează, personalizează după nevoie.*
