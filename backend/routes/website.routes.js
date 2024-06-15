// routes/website.routes.js
const express = require('express');
const router = express.Router();
const websiteController = require('../controllers/website.controller');

// Route pour ajouter une nouvelle page de site
router.post('/', websiteController.addWebsitePage);

// Route pour récupérer une page de site
router.get('/:pageId', websiteController.getWebsitePage);

module.exports = router;
