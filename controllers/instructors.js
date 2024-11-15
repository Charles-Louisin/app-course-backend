const Instructor = require('../models/Instructor');
const User = require('../models/User');
const Course = require('../models/Course');

exports.getInstructors = async (req, res) => {
  try {
    const instructors = await Instructor.find()
      .populate('user', 'name email createdAt')
      .populate('courses', 'name duration');

    res.json({
      success: true,
      data: instructors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des instructeurs',
      error: error.message
    });
  }
};

exports.createInstructor = async (req, res) => {
  try {
    const { name, courses } = req.body;

    // Créer l'utilisateur avec un email et mot de passe générés
    const email = `${name.toLowerCase().replace(/\s+/g, '.')}@school.com`;
    const password = Math.random().toString(36).slice(-8);

    const user = await User.create({
      name,
      email,
      password,
      userType: 'instructor'
    });

    // Créer l'instructeur
    const instructor = await Instructor.create({
      user: user._id,
      courses: courses || []
    });

    // Mettre à jour les cours avec le nouvel instructeur
    if (courses && courses.length > 0) {
      await Promise.all(
        courses.map(courseId =>
          Course.findByIdAndUpdate(
            courseId,
            { $push: { instructors: instructor._id } }
          )
        )
      );
    }

    const populatedInstructor = await Instructor.findById(instructor._id)
      .populate('user', 'name')
      .populate('courses', 'name duration');

    res.status(201).json({
      success: true,
      data: populatedInstructor,
      credentials: { email, password }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de l\'instructeur',
      error: error.message
    });
  }
};

exports.updateInstructor = async (req, res) => {
  try {
    const { name, courses } = req.body;
    const instructorId = req.params.id;

    const instructor = await Instructor.findById(instructorId);
    if (!instructor) {
      return res.status(404).json({
        success: false,
        message: 'Instructeur non trouvé'
      });
    }

    // Mettre à jour le nom de l'utilisateur
    await User.findByIdAndUpdate(instructor.user, { name });

    // Mettre à jour les relations avec les cours
    const oldCourses = instructor.courses.map(id => id.toString());
    const newCourses = courses.map(id => id.toString());

    // Retirer l'instructeur des anciens cours
    const removedCourses = oldCourses.filter(id => !newCourses.includes(id));
    await Promise.all(
      removedCourses.map(courseId =>
        Course.findByIdAndUpdate(
          courseId,
          { $pull: { instructors: instructorId } }
        )
      )
    );

    // Ajouter l'instructeur aux nouveaux cours
    const addedCourses = newCourses.filter(id => !oldCourses.includes(id));
    await Promise.all(
      addedCourses.map(courseId =>
        Course.findByIdAndUpdate(
          courseId,
          { $push: { instructors: instructorId } }
        )
      )
    );

    // Mettre à jour les cours de l'instructeur
    instructor.courses = courses;
    await instructor.save();

    const updatedInstructor = await Instructor.findById(instructorId)
      .populate('user', 'name')
      .populate('courses', 'name duration');

    res.json({
      success: true,
      data: updatedInstructor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de l\'instructeur',
      error: error.message
    });
  }
};

exports.deleteInstructor = async (req, res) => {
  try {
    const instructor = await Instructor.findById(req.params.id);
    if (!instructor) {
      return res.status(404).json({
        success: false,
        message: 'Instructeur non trouvé'
      });
    }

    // Retirer l'instructeur de tous les cours
    await Promise.all(
      instructor.courses.map(courseId =>
        Course.findByIdAndUpdate(
          courseId,
          { $pull: { instructors: instructor._id } }
        )
      )
    );

    // Supprimer l'utilisateur associé
    await User.findByIdAndDelete(instructor.user);

    // Supprimer l'instructeur
    await instructor.remove();

    res.json({
      success: true,
      message: 'Instructeur supprimé avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de l\'instructeur',
      error: error.message
    });
  }
}; 