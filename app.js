// app.js
const express = require('express');
const catMe = require("cat-me");
const path = require('path');
const bodyParser = require('body-parser');
const oracledb = require('oracledb');
const cors = require('cors');
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

const app = express();
app.use(cors()); 
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Informations de connexion
const connectionConfig = {
  user: 'SMI1002_020',     
  password: '93rcua29',    // Votre mot de passe Oracle
  connectString: 'gaia.emp.uqtr.ca:1521/coursbd.uqtr.ca' // Par exemple 'localhost:1521/XEPDB1'
};



// async function connectToOracle() {
//   let connection;

//   try {

//     // Connexion à la base de données
//     connection = await oracledb.getConnection(connectionConfig);
//     console.log('Connexion réussie à la base de données Bd_bibliotheque !');

  
//   console.log('Données insérées manuellement avec succès !');


//    // Récupérer les données existantes
//    const result = await connection.execute(
//     `SELECT * 
//      FROM UTILISATEUR`
//   );
  
//   console.log(result.rows);

//   //   // Affichage des résultats
//   //   console.log('Méta-données des résultats :');
//   //   result.rows.forEach(item => {
//   //     console.log(item);
//   // });

//   } catch (err) {
//     console.error('Erreur lors de la connexion ou de l\'exécution de la requête :', err);
//   } finally {
//     // Toujours fermer la connexion après utilisation
//     if (connection) {
//       try {
//         await connection.close();
//       } catch (err) {
//         console.error('Erreur lors de la fermeture de la connexion :', err);
//       }
//     }
//   }
// }


// Configuration du moteur de templates EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware pour servir les fichiers statiques


// Middleware pour parser les données des formulaires


// Routes
const indexRoutes = require('./routes/indexRoutes');
app.use('/', indexRoutes);

// Afficher le chats en console
console.log(catMe());

// connectToOracle();
app.use(cors()); // Autorise les requêtes cross-origin si nécessaire
// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});