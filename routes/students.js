const express = require('express');
const router = express.Router();
const {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent
} = require('../controllers/students');
const { protect, authorize } = require('../middleware/auth');

// Toutes les routes nécessitent une authentification
router.use(protect);

// Routes accessibles à tous les utilisateurs authentifiés
router.get('/', getStudents);

// Routes pour administrateurs uniquement
router.post('/', authorize('administrator'), createStudent);
router.put('/:id', authorize('administrator'), updateStudent);
router.delete('/:id', authorize('administrator'), deleteStudent);

module.exports = router; 