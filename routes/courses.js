const express = require('express');
const router = express.Router();
const {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse
} = require('../controllers/courses');
const { protect, authorize } = require('../middleware/auth');
const { courseValidator, idValidator } = require('../middleware/validators');
const validateRequest = require('../middleware/validateRequest');

router.get('/', getCourses);

router.use(protect);

router.post('/', 
  authorize('administrator'), 
  courseValidator, 
  validateRequest, 
  createCourse
);

router.put('/:id', 
  authorize('administrator'), 
  idValidator,
  courseValidator, 
  validateRequest, 
  updateCourse
);

router.delete('/:id', 
  authorize('administrator'), 
  idValidator,
  validateRequest, 
  deleteCourse
);

module.exports = router; 