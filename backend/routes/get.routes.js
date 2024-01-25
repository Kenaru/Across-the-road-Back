// routes/get.routes.js
const express = require('express');
const router = express.Router();
const getController = require('../controllers/get.controller');

// Définir les routes pour les requêtes qui commencent par /api/get

// Exemple de route pour récupérer le compte de la table AssoWebsite
router.get('/countAssoWebsite', getController.getCountAssoWebsite);
router.get('/countAssoOnline', getController.getCountAssoOnline);
router.get('/UsersCount', getController.getCountUsers);
router.get('/CountprezOnline', getController.getprezOnline);
router.get('/AdminOnline', getController.getAdminOnline);
router.get('/checkUserSession', getController.checkUserSession);

// Ajoutez d'autres routes selon vos besoins...

module.exports = router;
