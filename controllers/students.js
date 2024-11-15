const Student = require('../models/Student');
const User = require('../models/User');
const Course = require('../models/Course');

exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .populate('user', 'name email createdAt')
      .populate('courses', 'name duration');

    res.json({
      success: true,
      data: students
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des étudiants',
      error: error.message
    });
  }
};

exports.createStudent = async (req, res) => {
  try {
    const { name, courses } = req.body;

    // Créer l'utilisateur avec un email et mot de passe générés
    const email = `${name.toLowerCase().replace(/\s+/g, '.')}@school.com`;
    const password = Math.random().toString(36).slice(-8); // Génère un mot de passe aléatoire

    const user = await User.create({
      name,
      email,
      password,
      userType: 'student'
    });

    // Créer l'étudiant
    const student = await Student.create({
      user: user._id,
      courses: courses || []
    });

    // Peupler les données
    const populatedStudent = await Student.findById(student._id)
      .populate('user', 'name')
      .populate('courses', 'name duration');

    res.status(201).json({
      success: true,
      data: populatedStudent,
      credentials: { email, password } // Retourner les credentials générés
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de l\'étudiant',
      error: error.message
    });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const { name, courses } = req.body;
    const studentId = req.params.id;

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Étudiant non trouvé'
      });
    }

    // Mettre à jour le nom de l'utilisateur
    await User.findByIdAndUpdate(student.user, { name });

    // Mettre à jour les cours
    student.courses = courses;
    await student.save();

    const updatedStudent = await Student.findById(studentId)
      .populate('user', 'name')
      .populate('courses', 'name duration');

    res.json({
      success: true,
      data: updatedStudent
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de l\'étudiant',
      error: error.message
    });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Étudiant non trouvé'
      });
    }

    // Supprimer l'utilisateur associé
    await User.findByIdAndDelete(student.user);

    // Supprimer l'étudiant
    await student.remove();

    res.json({
      success: true,
      message: 'Étudiant supprimé avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de l\'étudiant',
      error: error.message
    });
  }
}; 