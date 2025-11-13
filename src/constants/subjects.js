/**
 * SUBJECTS_CONFIG - Metadate statice pentru discipline
 *
 * Single source of truth pentru toate informațiile statice despre discipline.
 * Datele dinamice (themesCount, questionsCount) se calculează din Firestore.
 *
 * Usage:
 * import { SUBJECTS_CONFIG } from '../constants/subjects';
 */

export const SUBJECTS_CONFIG = [
  {
    id: 'limba-romana',
    slug: 'limba-romana',
    name: 'Limba Română',
    icon: '📚',
    color: '#E63946',
    descriptions: {
      educational: 'Învață limba română',
      specialist: 'Testează cunoștințele de limba română',
      short: 'Literatura și gramatica',
    },
    isActive: true,
    order: 1,
  },
  {
    id: 'matematica',
    slug: 'matematica',
    name: 'Matematică',
    icon: '🔢',
    color: '#6A4C93',
    descriptions: {
      educational: 'Rezolvă probleme',
      specialist: 'Testează logica matematică',
      short: 'Numerele și logica',
    },
    isActive: true,
    order: 2,
  },
  {
    id: 'istorie',
    slug: 'istorie',
    name: 'Istorie',
    icon: '🏛️',
    color: '#8B4513',
    descriptions: {
      educational: 'Învață despre trecut',
      specialist: 'Testează cunoștințele istorice',
      short: 'Călătorie prin istorie',
    },
    isActive: true,
    order: 3,
  },
  {
    id: 'geografie',
    slug: 'geografie',
    name: 'Geografie',
    icon: '🌍',
    color: '#1982C4',
    descriptions: {
      educational: 'Descoperă lumea',
      specialist: 'Explorează lumea și Geografia',
      short: 'Hai să explorăm!',
    },
    isActive: true,
    order: 4,
  },
  {
    id: 'biologie',
    slug: 'biologie',
    name: 'Biologie',
    icon: '🧬',
    color: '#06A77D',
    descriptions: {
      educational: 'Descoperă viața',
      specialist: 'Explorează biologia',
      short: 'Știința vieții',
    },
    isActive: true,
    order: 5,
  },
  {
    id: 'fizica',
    slug: 'fizica',
    name: 'Fizică',
    icon: '⚛️',
    color: '#F77F00',
    descriptions: {
      educational: 'Înțelege universul',
      specialist: 'Testează cunoștințele de fizică',
      short: 'Legile naturii',
    },
    isActive: true,
    order: 6,
  },
  {
    id: 'chimie',
    slug: 'chimie',
    name: 'Chimie',
    icon: '🧪',
    color: '#FCBF49',
    descriptions: {
      educational: 'Experimentează',
      specialist: 'Testează cunoștințele de chimie',
      short: 'Reacții și molecule',
    },
    isActive: true,
    order: 7,
  },
  {
    id: 'engleza',
    slug: 'engleza',
    name: 'Limba Engleză',
    icon: '🇬🇧',
    color: '#DC143C',
    descriptions: {
      educational: 'Învață engleza',
      specialist: 'Testează cunoștințele de engleză',
      short: 'English language',
    },
    isActive: true,
    order: 8,
  },
  {
    id: 'franceza',
    slug: 'franceza',
    name: 'Limba Franceză',
    icon: '🇫🇷',
    color: '#002395',
    descriptions: {
      educational: 'Învață franceza',
      specialist: 'Testează cunoștințele de franceză',
      short: 'Langue française',
    },
    isActive: true,
    order: 9,
  },
  {
    id: 'educatie-plastica',
    slug: 'educatie-plastica',
    name: 'Educație Plastică',
    icon: '🎨',
    color: '#FF1493',
    descriptions: {
      educational: 'Descoperă arta',
      specialist: 'Testează cunoștințele despre artă',
      short: 'Culoare și formă',
    },
    isActive: true,
    order: 10,
  },
  {
    id: 'educatie-muzicala',
    slug: 'educatie-muzicala',
    name: 'Educație Muzicală',
    icon: '🎵',
    color: '#9370DB',
    descriptions: {
      educational: 'Învață muzica',
      specialist: 'Testează cunoștințele muzicale',
      short: 'Ritmuri și melodii',
    },
    isActive: true,
    order: 11,
  },
  {
    id: 'educatie-fizica-sport',
    slug: 'educatie-fizica-sport',
    name: 'Educație Fizică',
    icon: '⚽',
    color: '#32CD32',
    descriptions: {
      educational: 'Mișcare și sport',
      specialist: 'Testează cunoștințele sportive',
      short: 'Sport și sănătate',
    },
    isActive: true,
    order: 12,
  },
  {
    id: 'tic',
    slug: 'tic',
    name: 'TIC',
    icon: '💻',
    color: '#4169E1',
    descriptions: {
      educational: 'Tehnologie și informatică',
      specialist: 'Testează cunoștințele digitale',
      short: 'Digital skills',
    },
    isActive: true,
    order: 13,
  },
  {
    id: 'religie',
    slug: 'religie',
    name: 'Religie',
    icon: '✝️',
    color: '#FFD700',
    descriptions: {
      educational: 'Învață despre credință',
      specialist: 'Testează cunoștințele religioase',
      short: 'Credință și valori',
    },
    isActive: true,
    order: 14,
  },
  {
    id: 'educatie-sociala',
    slug: 'educatie-sociala',
    name: 'Educație Socială',
    icon: '🤝',
    color: '#FF6347',
    descriptions: {
      educational: 'Relații și societate',
      specialist: 'Testează cunoștințele sociale',
      short: 'Viața în comunitate',
    },
    isActive: true,
    order: 15,
  },
];

/**
 * Helper functions
 */

// Get active subjects only
export const getActiveSubjects = () => {
  return SUBJECTS_CONFIG.filter(subject => subject.isActive);
};

// Get subject by slug
export const getSubjectBySlug = (slug) => {
  return SUBJECTS_CONFIG.find(subject => subject.slug === slug);
};

// Get subject by id
export const getSubjectById = (id) => {
  return SUBJECTS_CONFIG.find(subject => subject.id === id);
};

// Get subject description by context
export const getSubjectDescription = (slug, context = 'educational') => {
  const subject = getSubjectBySlug(slug);
  return subject?.descriptions[context] || subject?.descriptions.educational || '';
};
