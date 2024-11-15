const Course = require('../models/Course');
const Instructor = require('../models/Instructor');

exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate({
      path: 'instructors',
      populate: { path: 'user', select: 'name email' }
    });
    
    res.json({
      success: true,
      data: courses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des cours',
      error: error.message
    });
  }
};

exports.createCourse = async (req, res) => {
  try {
    const { name, duration, teachingDays, instructors } = req.body;

    const course = await Course.create({
      name,
      duration,
      teachingDays,
      instructors
    });

    // Mettre à jour les instructeurs avec le nouveau cours
    await Promise.all(
      instructors.map(instructorId =>
        Instructor.findByIdAndUpdate(
          instructorId,
          { $push: { courses: course._id } },
          { new: true }
        )
      )
    );

    res.status(201).json({
      success: true,
      data: course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du cours',
      error: error.message
    });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const { name, duration, teachingDays, instructors } = req.body;
    const courseId = req.params.id;

    // Récupérer l'ancien cours pour comparer les instructeurs
    const oldCourse = await Course.findById(courseId);
    if (!oldCourse) {
      return res.status(404).json({
        success: false,
        message: 'Cours non trouvé'
      });
    }

    // Mettre à jour le cours
    const course = await Course.findByIdAndUpdate(
      courseId,
      { name, duration, teachingDays, instructors },
      { new: true }
    );

    // Mettre à jour les relations avec les instructeurs
    const oldInstructors = oldCourse.instructors.map(id => id.toString());
    const newInstructors = instructors.map(id => id.toString());

    // Retirer le cours des anciens instructeurs qui ne sont plus associés
    const removedInstructors = oldInstructors.filter(id => !newInstructors.includes(id));
    await Promise.all(
      removedInstructors.map(instructorId =>
        Instructor.findByIdAndUpdate(
          instructorId,
          { $pull: { courses: courseId } }
        )
      )
    );

    // Ajouter le cours aux nouveaux instructeurs
    const addedInstructors = newInstructors.filter(id => !oldInstructors.includes(id));
    await Promise.all(
      addedInstructors.map(instructorId =>
        Instructor.findByIdAndUpdate(
          instructorId,
          { $push: { courses: courseId } }
        )
      )
    );

    res.json({
      success: true,
      data: course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du cours',
      error: error.message
    });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Cours non trouvé'
      });
    }

    // Retirer le cours de tous les instructeurs associés
    await Promise.all(
      course.instructors.map(instructorId =>
        Instructor.findByIdAndUpdate(
          instructorId,
          { $pull: { courses: course._id } }
        )
      )
    );

    await course.remove();

    res.json({
      success: true,
      message: 'Cours supprimé avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du cours',
      error: error.message
    });
  }
}; 