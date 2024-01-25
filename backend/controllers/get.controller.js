const db = require('../config/db');

exports.getCountAssoWebsite = async (req, res) => {
  try {
    // Exécutez la requête SQL pour compter les lignes dans la table AssoWebsite
    const [results] = await db.query('SELECT COUNT(*) AS nbrAssoWebsite FROM AssoWebsite');

    // Renvoyer les résultats en tant que JSON
    res.json(results[0]); // Assurez-vous de renvoyer le premier résultat (premier élément du tableau) si disponible
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs :', error);
    res.status(500).send('Erreur du serveur');
  }
};

exports.getCountUsers = async (req, res) => {
  try {
    // Exécutez la requête SQL pour compter les lignes dans la table Users
    const [results] = await db.query('SELECT COUNT(*) AS nbrUser FROM Users');

    // Renvoyer les résultats en tant que JSON
    res.json(results[0]); // Assurez-vous de renvoyer le premier résultat (premier élément du tableau) si disponible
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs :', error);
    res.status(500).send('Erreur du serveur');
  }
};

exports.getCountAssoOnline = async (req, res) => {
  try {
    // Exécutez la requête SQL pour compter les lignes dans la table AssoTable
    const [results] = await db.query('SELECT COUNT(*) AS AssoOnline FROM AssoTable');

    // Renvoyer les résultats en tant que JSON
    res.json(results[0]); // Assurez-vous de renvoyer le premier résultat (premier élément du tableau) si disponible
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs :', error);
    res.status(500).send('Erreur du serveur');
  }
};

exports.getprezOnline = async (req, res) => {
  try {
    // Exécutez la requête SQL pour compter les lignes dans la table AssoLead
    const [results] = await db.query('SELECT COUNT(*) AS prezOnline FROM AssoLead');

    // Renvoyer les résultats en tant que JSON
    res.json(results[0]); // Assurez-vous de renvoyer le premier résultat (premier élément du tableau) si disponible
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs :', error);
    res.status(500).send('Erreur du serveur');
  }
};

exports.getAdminOnline = async (req, res) => {
  try {
    // Exécutez la requête SQL pour compter les lignes dans la table Users avec la permission '_dev'
    const [results] = await db.query("SELECT COUNT(*) AS AdminOnline FROM `Users` WHERE `Permission` = '_dev'");

    // Renvoyer les résultats en tant que JSON
    res.json(results[0]); // Assurez-vous de renvoyer le premier résultat (premier élément du tableau) si disponible
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs :', error);
    res.status(500).send('Erreur du serveur');
  }
};

exports.getUserConnected = async (req, res) => {
  const userId = req.params.userId;

  // Vérifier l'état de connexion dans la base de données
  db.get(`SELECT is_logged_in FROM Users WHERE user_id = ?`, [userId], (err, user) => {
      if (err) {
          console.error('Erreur lors de la requête:', err);
          return res.status(500).json({ success: false, message: 'Erreur du serveur' });
      }

      if (user) {
          // Renvoyer l'état de connexion
          return res.json({ success: true, isLoggedIn: user.is_logged_in });
      } else {
          return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
      }
  });
};

exports.checkUserSession = async (req, res) => {
  async function checkUserSession(userId) {
    // Effectuez une requête à la base de données pour récupérer les détails de la session de l'utilisateur
    const [rows] = await db.query('SELECT * FROM sessions WHERE user_id = ? ORDER BY login_time DESC LIMIT 1', [userId]);

    if (rows.length > 0) {
        const session = rows[0];
        const loginTime = new Date(session.login_time).getTime(); // Temps de connexion en millisecondes
        const currentTime = new Date().getTime(); // Temps actuel en millisecondes
        const sessionDuration = 12 * 60 * 60 * 1000; // Durée de session en millisecondes (12 heures)

        const elapsedTime = currentTime - loginTime; // Temps écoulé depuis la connexion

        // Vérifiez si la session est toujours valide en fonction de la durée
        const isSessionValid = elapsedTime < sessionDuration;
        if (isSessionValid) {
            // Calculez le temps restant de la session
            const timeRemaining = sessionDuration - elapsedTime;
            const timeRemainingHours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const timeRemainingMinutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));

            return {
                isLoggedIn: true,
                timeRemainingHours,
                timeRemainingMinutes
            };
        }
    }

    // Si aucune session valide n'est trouvée ou si la session a expiré
    return {
        isLoggedIn: false
    };
}

  const userId = req.query.userId; // Obtenez l'ID de l'utilisateur de la requête
  try {
      // Vérifiez la session de l'utilisateur en utilisant l'ID
      const sessionDetails = await checkUserSession(userId);

      if (sessionDetails.isLoggedIn) {
          // L'utilisateur est connecté, renvoyez les détails de la session
          res.status(200).json({
              success: true,
              message: 'User is logged in',
              timeRemainingHours: sessionDetails.timeRemainingHours,
              timeRemainingMinutes: sessionDetails.timeRemainingMinutes
          });
      } else {
          // L'utilisateur n'est pas connecté ou la session a expiré
          await db.query('UPDATE Users SET is_logged_in = 0 WHERE id = ?', [userId]);
          await db.query('DELETE FROM sessions WHERE user_id = ?', [userId]);
          res.status(401).json({ success: false, message: 'User is not logged in' });
      }
  } catch (error) {
      console.error('Error checking user session:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

