// routes/routes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const pagesController = require('../controllers/pages.controller');
const { login_user, register_user, logout_user } = require('../controllers/user.controller');

const router = express.Router();

// Set up storage configuration for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Path to the uploads directory
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Define the upload route
router.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).send({ message: 'No file uploaded' });
    }
    const imageUrl = `/uploads/${req.file.filename}`;
    res.status(200).send({ url: imageUrl });
});

// User Authentication Routes
router.post('/login', login_user);
router.post('/register', register_user);
router.post('/logout', logout_user);

// Page Routes
router.post('/pages', upload.any(), pagesController.createPage);
router.put('/pages/:id', upload.any(), pagesController.updatePage);
router.get('/pages/:id', pagesController.fetchPageById);

module.exports = router;
