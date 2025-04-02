// routes/indexRoutes.js
const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

// Page d'accueil
// router.get('/', (req, res) => {
//   res.render('home');
// });


// Liste des utilisateurs
router.get('/users', userController.getUsers);
router.get('/documents', userController.getDocuments);
router.post('/documents/add', userController.addDocument);
router.get('/reservations', userController.getReservation);
router.post('/reservations/add', userController.addReservation)
router.get('/emprunts', userController.getEmprunt);
router.post('/emprunts/add', userController.addEmprunts);
router.get('/emprunts', userController.getEmprunt);

// Détails d'un utilisateur
// router.get('/users/:id', userController.getUserById);

// Route pour la recherche
// router.get('/search', userController.searchBooks);

module.exports = router;