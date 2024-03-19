    // routes/post.routes.js
    const express = require('express');
    const router = express.Router();
    const loginController = require('../controllers/connection.controller');
    const fpController = require('../controllers/fp.controller')

    // Définir les routes pour les requêtes qui commencent par /api/post

    router.post('/connection', loginController.login_user);
    router.post('/register', loginController.register_user);
    router.post('/forgot-password', fpController.forgotpassword);
    router.post('/reset-password', fpController.reset_password);
    router.post('/logout', loginController.logout_user);
    

    // Ajoutez d'autres routes selon vos besoins...

    module.exports = router;