// controllers/userController.js
const User = require('../models/User');

exports.getUsers = (req, res) => {
  const books = User.books;
  res.render('users/index', { books });
};


// Fonction pour rechercher des livres en fonction de la requête
exports.searchBooks = (req, res) => {
  const query = req.query.q ? req.query.q.toLowerCase() : "";
  const filteredBooks = User.books.filter(book => book.title.toLowerCase().includes(query));
  res.json(filteredBooks);
};

exports.getUserById = (req, res) => {
  const user = User.findById(req.params.id);
  if (user) {
    res.render('users/show', { user });
  } else {
    res.status(404).send('Utilisateur non trouvé');
  }
};