const oracledb = require('oracledb');

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

const connectionConfig = {
  user: 'SMI1002_020',
  password: '93rcua29',
  connectString: 'gaia.emp.uqtr.ca:1521/coursbd.uqtr.ca'
};

// Fonction pour récupérer les utilisateurs et les envoyer à la vue
async function getUsers(req, res) {
  let connection;

  try {
    // Connexion à la base de données
    connection = await oracledb.getConnection(connectionConfig);
    console.log('Connexion réussie à la base de données Bd_bibliotheque !');

    // Exécution de la requête SQL
    const result = await connection.execute(`SELECT * FROM UTILISATEUR`);

    // Vérifier si des utilisateurs existent
    if (result.rows.length === 0) {
      return res.render('users/users', { users: [] });
    }

    // Rendre la vue avec les utilisateurs
    res.render('users/users', { users: result.rows });

  } catch (err) {
    console.error('Erreur lors de la récupération des utilisateurs :', err);
    es.status(500).json({ message: "Erreur serveur", error: err.message, stack: err.stack });

  } finally {
    // Fermeture de la connexion
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Erreur lors de la fermeture de la connexion :', err);
      }
    }
  }
}

// Fonction pour récupérer les documents
async function getDocuments(req, res) {
  let connection;

  try {
    // Connexion à la base de données
    connection = await oracledb.getConnection(connectionConfig);
    console.log('Connexion réussie à la base de données Bd_bibliotheque !');

    // Exécution de la requête SQL
    const result = await connection.execute(`SELECT * FROM DOCUMENTS`);
    console.log(result.rows);
    

    // Vérifier si des documents existent
    if (result.rows.length === 0) {
      return res.render('users/documents', { documents: [] });
    }

    // Rendre la vue avec les documents
    res.render('users/documents', { documents: result.rows });

  } catch (err) {
    console.error('Erreur lors de la récupération des documents :', err);
    res.status(500).json({ message: "Erreur serveur" });

  } finally {
    // Fermeture de la connexion
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Erreur lors de la fermeture de la connexion :', err);
      }
    }
  }
}


async function addDocument(req, res) {
  let connection;

  try {
    connection = await oracledb.getConnection(connectionConfig);
    
    const { titre, auteur, isbn, categorie, nombreExemplaires, disponible } = req.body;

    // console.log("Titre reçu:", titre);
    // console.log("Auteur reçu:", auteur);
    // console.log("ISBN reçu:", isbn);
    // console.log("Catégorie reçue:", categorie);
    // console.log("Nombre d'exemplaires reçu:", nombreExemplaires);
    // console.log("Disponible reçu:", disponible);

    await connection.execute(
      `INSERT INTO DOCUMENTS (titre, auteur, isbn, categorie, nombreExemplaires, disponible)
       VALUES (:titre, :auteur, :isbn, :categorie, :nombreExemplaires, :disponible)`,
      {
        titre, 
        auteur, 
        isbn, 
        categorie, 
        nombreExemplaires: Number(nombreExemplaires), 
        disponible: Number(disponible)
      },
      { autoCommit: true }
    );
    
    console.log("Document inséré avec succès !");
    res.status(200).json({ message: 'Document ajouté avec succès' });

  } catch (err) {
    console.error('❌ Erreur lors de l\'ajout du document :', err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });

  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('❌ Erreur lors de la fermeture de la connexion :', err);
      }
    }
  }
}


async function getReservation(req, res) {
  let connection;

  try {
    connection = await oracledb.getConnection(connectionConfig);

    // Récupérer la liste des réservations
    const reservationsResult = await connection.execute(`
      SELECT r.idReservation, r.dateReservation, r.dateExpiration, r.statut, u.nom, u.prenom, d.titre
      FROM Reservation r
      JOIN Utilisateur u ON r.idUtilisateur = u.idUtilisateur
      JOIN Documents d ON r.idDocument = d.idDocument
    `, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });

    // console.log('Réservations:', reservationsResult.rows);

    // Récupérer les autres données (users et documents)
    const usersResult = await connection.execute(
      `SELECT idUtilisateur, nom, prenom FROM Utilisateur`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    const documentsResult = await connection.execute(
      `SELECT idDocument, titre FROM Documents WHERE disponible = 1`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    
    

    // Rendre la vue avec toutes les données
    res.render('users/reservation', { 
      reservations: reservationsResult.rows,
      users: usersResult.rows,
      documents: documentsResult.rows
    });

  } catch (err) {
    console.error('Erreur lors de la récupération des données :', err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Erreur lors de la fermeture de la connexion :', err);
      }
    }
  }
}


async function getEmprunt(req, res) {
  let connection;

  try {
    connection = await oracledb.getConnection(connectionConfig);

    // Récupérer les emprunts
    const empruntResult = await connection.execute(`
      SELECT e.idEmprunt, e.dateEmprunt, e.dateRetourPrevue, e.dateRetourEffective, e.enRetard,
             u.nom, u.prenom, d.titre
      FROM Emprunt e
      JOIN Utilisateur u ON e.idUtilisateur = u.idUtilisateur
      JOIN Documents d ON e.idDocument = d.idDocument
    `, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });

    console.log("Données des emprunts récupérées :", empruntResult.rows); 

    // Récupérer la liste des utilisateurs
    const usersResult = await connection.execute(
      `SELECT idUtilisateur, nom, prenom FROM Utilisateur`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    // Récupérer la liste des documents
    const documentsResult = await connection.execute(
      `SELECT idDocument, titre FROM Documents WHERE disponible = 1`, // ou une condition selon tes besoins
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    // Rendre la vue avec les emprunts, les utilisateurs et les documents
    res.render('users/emprunt', {
      emprunts: empruntResult.rows,
      users: usersResult.rows,
      documents: documentsResult.rows
    });

  } catch (err) {
    console.error('Erreur lors de la récupération des emprunts :', err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  } finally {
    // Toujours fermer la connexion après utilisation
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Erreur lors de la fermeture de la connexion :', err);
      }
    }
  }
}


async function addDocument(req, res) {
  let connection;

  try {
    connection = await oracledb.getConnection(connectionConfig);
    
    const { titre, auteur, isbn, categorie, nombreExemplaires, disponible } = req.body;

    await connection.execute(
      `INSERT INTO DOCUMENTS (titre, auteur, isbn, categorie, nombreExemplaires, disponible)
       VALUES (:titre, :auteur, :isbn, :categorie, :nombreExemplaires, :disponible)`,
      {
        titre, 
        auteur, 
        isbn, 
        categorie, 
        nombreExemplaires: Number(nombreExemplaires), 
        disponible: Number(disponible)
      },
      { autoCommit: true }
    );
    
    console.log("Document inséré avec succès !");
    res.status(200).json({ message: 'Document ajouté avec succès' });

  } catch (err) {
    console.error('❌ Erreur lors de l\'ajout du document :', err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });

  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('❌ Erreur lors de la fermeture de la connexion :', err);
      }
    }
  }
}


async function addReservation(req, res) {
  let connection;
  try {
      console.log("Corps de la requête reçu :", req.body); // Vérifie les données reçues

      const { idUtilisateur, idDocument, dateExpiration, statut } = req.body;

      if (!idUtilisateur || !idDocument || !dateExpiration || !statut) {
          return res.status(400).json({ message: "Données manquantes" });
      }

      connection = await oracledb.getConnection(connectionConfig);

      await connection.execute(
          `INSERT INTO Reservation (idUtilisateur, idDocument, dateExpiration, statut)
          VALUES (:idUtilisateur, :idDocument, :dateExpiration, :statut)`,
          {
              idUtilisateur: Number(idUtilisateur),
              idDocument: Number(idDocument),
              dateExpiration: dateExpiration,
              statut: statut
          },
          { autoCommit: true }
      );

      console.log("Réservation ajoutée avec succès !");
      res.status(200).json({ message: 'Réservation ajoutée avec succès' });

  } catch (err) {
      console.error('Erreur lors de l\'ajout de la réservation :', err);
      res.status(500).json({ message: "Erreur serveur", error: err.message });
  } finally {
      if (connection) {
          try {
              await connection.close();
          } catch (err) {
              console.error('Erreur lors de la fermeture de la connexion :', err);
          }
      }
  }
}

async function addEmprunts(req, res) {
  let connection;
  try {
    console.log("Corps de la requête reçu :", req.body); // Vérifie les données reçues

    const { idUtilisateur, idDocument, dateRetourPrevue } = req.body;

    if (!idUtilisateur || !idDocument || !dateRetourPrevue) {
      return res.status(400).json({ message: "Données manquantes" });
    }

    connection = await oracledb.getConnection(connectionConfig);

    // Insérer l'emprunt dans la table Emprunt
    await connection.execute(
      `INSERT INTO Emprunt (idUtilisateur, idDocument, dateEmprunt, dateRetourPrevue)
      VALUES (:idUtilisateur, :idDocument, SYSDATE, :dateRetourPrevue)`,
      {
        idUtilisateur: Number(idUtilisateur),
        idDocument: Number(idDocument),
        dateRetourPrevue: dateRetourPrevue
      },
      { autoCommit: true }
    );

    console.log("Emprunt ajouté avec succès !");
    res.status(200).json({ message: 'Emprunt ajouté avec succès' });

  } catch (err) {
    console.error('Erreur lors de l\'ajout de l\'emprunt :', err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Erreur lors de la fermeture de la connexion :', err);
      }
    }
  }
}


module.exports = { 
  getUsers,
  getDocuments,
  addDocument,
  getReservation,
  getEmprunt,
  addReservation,
  addEmprunts,
};
