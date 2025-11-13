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
    id: 'istorie',
    slug: 'istorie',
    name: 'Istorie',
    icon: '🏛️',
    color: '#E63946', // brand-red
    descriptions: {
      educational: 'Învață despre trecut',
      specialist: 'Testează cunoștințele istorice',
      short: 'Călătorie prin istorie',
    },
    isActive: true,
    order: 1,
  },
  {
    id: 'biologie',
    slug: 'biologie',
    name: 'Biologie',
    icon: '🧬',
    color: '#06A77D', // brand-green
    descriptions: {
      educational: 'Descoperă viața',
      specialist: 'Explorează biologia',
      short: 'Știința vieții',
    },
    isActive: true,
    order: 2,
  },
  {
    id: 'geografie',
    slug: 'geografie',
    name: 'Geografie',
    icon: '🌍',
    color: '#1982C4', // brand-blue
    descriptions: {
      educational: 'Descoperă lumea',
      specialist: 'Explorează lumea și Geografia',
      short: 'Hai să explorăm!',
    },
    isActive: true,
    order: 3,
  },
  {
    id: 'matematica',
    slug: 'matematica',
    name: 'Matematică',
    icon: '🔢',
    color: '#6A4C93', // brand-purple
    descriptions: {
      educational: 'Rezolvă probleme',
      specialist: 'Testează logica matematică',
      short: 'Numerele și logica',
    },
    isActive: true,
    order: 4,
  },
  {
    id: 'fizica',
    slug: 'fizica',
    name: 'Fizică',
    icon: '⚛️',
    color: '#F77F00', // brand-orange
    descriptions: {
      educational: 'Înțelege universul',
      specialist: 'Testează cunoștințele de fizică',
      short: 'Legile naturii',
    },
    isActive: true,
    order: 5,
  },
  {
    id: 'chimie',
    slug: 'chimie',
    name: 'Chimie',
    icon: '🧪',
    color: '#FCBF49', // brand-yellow
    descriptions: {
      educational: 'Experimentează',
      specialist: 'Testează cunoștințele de chimie',
      short: 'Reacții și molecule',
    },
    isActive: true,
    order: 6,
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
