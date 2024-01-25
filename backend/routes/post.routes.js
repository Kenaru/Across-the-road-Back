    // routes/post.routes.js
    const express = require('express');
    const router = express.Router();
    const postController = require('../controllers/post.controller');
    const fpController = require('../controllers/fp.controller')

    // Définir les routes pour les requêtes qui commencent par /api/post

    router.post('/login', postController.login_user);
    router.post('/register', postController.register_user);
    router.post('/forgot-password', fpController.forgotpassword);
    router.post('/reset-password', fpController.reset_password);
    router.post('/logout', postController.logout_user);
    

    // Ajoutez d'autres routes selon vos besoins...

    module.exports = router;