const express = require('express');
const router = express.Router();
const {
  getInstructors,
  createInstructor,
  updateInstructor,
  deleteInstructor
} = require('../controllers/instructors');
const { protect, authorize } = require('../middleware/auth');

// Toutes les routes nécessitent une authentification
router.use(protect);

// Routes accessibles à tous les utilisateurs authentifiés
router.get('/', getInstructors);

// Routes pour administrateurs uniquement
router.post('/', authorize('administrator'), createInstructor);
router.put('/:id', authorize('administrator'), updateInstructor);
router.delete('/:id', authorize('administrator'), deleteInstructor);

module.exports = router; 