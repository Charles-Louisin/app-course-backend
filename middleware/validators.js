const { body, param } = require('express-validator');

exports.registerValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Le nom est requis')
    .isLength({ min: 2, max: 50 })
    .withMessage('Le nom doit contenir entre 2 et 50 caractères'),
  
  body('email')
    .trim()
    .notEmpty()
    .withMessage('L\'email est requis')
    .isEmail()
    .withMessage('Email invalide')
    .normalizeEmail(),
  
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Le mot de passe est requis')
    .isLength({ min: 6 })
    .withMessage('Le mot de passe doit contenir au moins 6 caractères'),
  
  body('userType')
    .trim()
    .notEmpty()
    .withMessage('Le type d\'utilisateur est requis')
    .isIn(['administrator', 'student', 'instructor'])
    .withMessage('Type d\'utilisateur invalide')
];

exports.loginValidator = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('L\'email est requis')
    .isEmail()
    .withMessage('Email invalide')
    .normalizeEmail(),
  
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Le mot de passe est requis')
];

exports.courseValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Le nom du cours est requis')
    .isLength({ min: 2, max: 100 })
    .withMessage('Le nom du cours doit contenir entre 2 et 100 caractères'),
  
  body('duration')
    .trim()
    .notEmpty()
    .withMessage('La durée est requise'),
  
  body('teachingDays')
    .isArray()
    .withMessage('Les jours d\'enseignement doivent être un tableau')
    .custom((value) => {
      const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      return value.every(day => validDays.includes(day));
    })
    .withMessage('Jours d\'enseignement invalides'),
  
  body('instructors')
    .isArray()
    .withMessage('Les instructeurs doivent être un tableau')
    .custom((value) => value.every(id => id.match(/^[0-9a-fA-F]{24}$/)))
    .withMessage('ID d\'instructeur invalide')
];

exports.userUpdateValidator = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Le nom doit contenir entre 2 et 50 caractères'),
  
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Email invalide')
    .normalizeEmail(),
  
  body('courses')
    .optional()
    .isArray()
    .withMessage('Les cours doivent être un tableau')
    .custom((value) => value.every(id => id.match(/^[0-9a-fA-F]{24}$/)))
    .withMessage('ID de cours invalide')
];

exports.idValidator = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('L\'ID est requis')
    .isMongoId()
    .withMessage('ID invalide')
]; 