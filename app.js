// app.js
const express = require('express');
const app = express();
const catMe = require("cat-me");
const path = require('path');

// Configuration du moteur de templates EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware pour servir les fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));

// Middleware pour parser les données des formulaires
app.use(express.urlencoded({ extended: true }));

// Routes
const indexRoutes = require('./routes/indexRoutes');
app.use('/', indexRoutes);

// Afficher le chats en console
console.log(catMe());

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});