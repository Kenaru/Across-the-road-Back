const express = require('express');
const upload = require('../server'); // Import the Multer instance from server.js
const pagesController = require('../controllers/pages.controller');
const { login_user, register_user, logout_user } = require('../controllers/user.controller');

const router = express.Router();

// User Authentication Routes
router.post('/login', login_user);
router.post('/register', register_user);
router.post('/logout', logout_user);

// Page Routes with file uploads and error handling
router.post('/pages', upload.fields([
    { name: 'navbar_logo', maxCount: 1 },
    { name: 'about_image', maxCount: 10 }, // Set a reasonable limit for maxCount
    { name: 'service_image', maxCount: 10 },
    { name: 'feedback_image', maxCount: 10 },
    { name: 'team_image', maxCount: 10 },
    { name: 'footer_image', maxCount: 1 }
]), async (req, res) => {
    try {
        await pagesController.createPage(req, res);
    } catch (error) {
        console.error('Error creating page:', error);
        res.status(500).send({ error: 'Internal server error', details: error.message });
    }
});

router.put('/pages/:id', upload.fields([
    { name: 'navbar_logo', maxCount: 1 },
    { name: 'about_image', maxCount: 10 },
    { name: 'service_image', maxCount: 10 },
    { name: 'feedback_image', maxCount: 10 },
    { name: 'team_image', maxCount: 10 },
    { name: 'footer_image', maxCount: 1 }
]), async (req, res) => {
    try {
        await pagesController.updatePage(req, res);
    } catch (error) {
        console.error('Error updating page:', error);
        res.status(500).send({ error: 'Internal server error', details: error.message });
    }
});

router.get('/pages/:id', async (req, res) => {
    try {
        await pagesController.fetchPageById(req, res);
    } catch (error) {
        console.error('Error fetching page:', error);
        res.status(500).send({ error: 'Internal server error', details: error.message });
    }
});

module.exports = router;
