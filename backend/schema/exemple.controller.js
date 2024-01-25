const db = require('../config/db');

exports.getexmemple = async (req, res) => {
  try {
    // Crée le code SQL pour récupérer les données souhaitez
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs :', error);
    res.status(500).send('Erreur du serveur');
  }
};

exports.postexemple = async (req, res) => {
    const { exemple } = req.body; // Récupère les données envoyées par le client

    try {
        // Crée le code SQL pour insérer les données souhaitées
    }catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs :', error);
        res.status(500).send('Erreur du serveur');
    }

};