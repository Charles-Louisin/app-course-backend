require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const initializeDefaultCourses = require('./config/defaultData');
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const studentRoutes = require('./routes/students');
const instructorRoutes = require('./routes/instructors');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./docs/swagger.yaml');

const app = express();


// Connexion à la base de données et initialisation des données
const initialize = async () => {
  await connectDB();
  await initializeDefaultCourses();
};

initialize();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/instructors', instructorRoutes);

// Documentation API
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Gestion des erreurs globale
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Une erreur est survenue sur le serveur',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
}); 