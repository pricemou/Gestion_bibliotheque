// routes/indexRoutes.js
const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

// Page d'accueil
router.get('/', (req, res) => {
  res.render('home');
});


// Liste des utilisateurs
router.get('/users', userController.getUsers);

// Détails d'un utilisateur
router.get('/users/:id', userController.getUserById);

// Route pour la recherche
router.get('/search', userController.searchBooks);

module.exports = router;