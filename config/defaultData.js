const Course = require('../models/Course');

const defaultCourses = [
  {
    name: 'Web Development',
    duration: '6 mois',
    teachingDays: ['Monday', 'Wednesday', 'Friday']
  },
  {
    name: 'Web Design',
    duration: '4 mois',
    teachingDays: ['Tuesday', 'Thursday']
  },
  {
    name: 'Cyber Security',
    duration: '8 mois',
    teachingDays: ['Monday', 'Wednesday', 'Friday']
  }
];

const initializeDefaultCourses = async () => {
  try {
    // Vérifier si des cours existent déjà
    const existingCourses = await Course.find();
    if (existingCourses.length === 0) {
      // Si aucun cours n'existe, ajouter les cours par défaut
      await Course.insertMany(defaultCourses);
      console.log('Cours par défaut ajoutés avec succès');
    }
  } catch (error) {
    console.error('Erreur lors de l\'initialisation des cours par défaut:', error);
  }
};

module.exports = initializeDefaultCourses; 