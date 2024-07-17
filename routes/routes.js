const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const blogController = require('../controllers/blog.controller');
const userController = require('../controllers/user.controller');
const {
    insertNavbar,
    insertFooter,
    uploadAboutImage,
    saveAboutSection,
    uploadServiceImage,
    saveService,
    insertTeamMember,
    insertTeamInfo,
    createPage,
    fetchPageById,
    fetchPagesByUserId,
    fetchAllPages
} = require('../controllers/dataController');
const authenticateJWT = require('../middleware/auth');
const { authorizePostOwner, authorizeCommentOwner } = require('../middleware/authorizeOwner');
const upload = require('../config/upload');

// Logs
router.get('/logs', authenticateJWT, (req, res) => {
    const logDirectory = path.join(__dirname, '../logs');
    fs.readdir(logDirectory, (err, files) => {
        if (err) return res.status(500).json({ error: 'Unable to read log directory' });
        const logFiles = files.filter(file => file.endsWith('.log'));
        res.json(logFiles);
    });
});

router.get('/logs/:filename', authenticateJWT, (req, res) => {
    const logDirectory = path.join(__dirname, '../logs');
    const logFile = path.join(logDirectory, req.params.filename);
    fs.readFile(logFile, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Unable to read log file' });
        res.send(data);
    });
});

// CMS Data
router.post('/navbar', authenticateJWT, upload.single('navbar_image'), insertNavbar);
router.post('/footer', authenticateJWT, upload.single('footer_image'), insertFooter);
router.post('/about/upload-image', authenticateJWT, upload.single('about_image'), uploadAboutImage);
router.post('/about/save-section', authenticateJWT, saveAboutSection);
router.post('/service/upload-image', authenticateJWT, upload.single('service_image'), uploadServiceImage);
router.post('/service/save', authenticateJWT, saveService);
router.post('/team/member', authenticateJWT, upload.single('team_image'), insertTeamMember);
router.post('/team/info', authenticateJWT, insertTeamInfo);
router.post('/pages', authenticateJWT, createPage);
router.get('/pages/:id', authenticateJWT, fetchPageById);
router.get('/pages/user/:userId', authenticateJWT, fetchPagesByUserId);
router.get('/pages', authenticateJWT, fetchAllPages);

// User Authentication
router.post('/register', userController.register_user);
router.post('/login', userController.login_user);
router.get('/users', authenticateJWT, userController.getAllUsers);
router.post('/logout', authenticateJWT, userController.logout_user);
router.get('/profile', authenticateJWT, userController.get_profile);
router.put('/profile', authenticateJWT, userController.update_profile);

// Blog Posts
router.get('/posts', authenticateJWT, blogController.getAllPosts);
router.get('/posts/:id', authenticateJWT, blogController.getPostById);
router.post('/posts', authenticateJWT, upload.single('image'), blogController.createPost);
router.put('/posts/:id', authenticateJWT, authorizePostOwner, upload.single('image'), blogController.updatePost);
router.delete('/posts/:id', authenticateJWT, authorizePostOwner, blogController.deletePost);

// Comments
router.post('/comments', authenticateJWT, blogController.createComment);
router.put('/comments/:id', authenticateJWT, authorizeCommentOwner, blogController.updateComment);
router.delete('/comments/:id', authenticateJWT, authorizeCommentOwner, blogController.deleteComment);

module.exports = router;
