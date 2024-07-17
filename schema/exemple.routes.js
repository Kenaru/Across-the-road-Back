// routes/get.routes.js
const express = require('express');
const router = express.Router();
const getController = require('../controllers/exemple.controller');

// Définir les routes pour les requêtes qui commencent par /api/get

// Exemple de route pour récupérer le compte de la table AssoWebsite
router.get('/postexemple', getController.getexemple);
router.post('/postexemple', fpController.postexemple);
