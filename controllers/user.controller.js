const db = require('../config/db');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const sendLogToDiscord = require('../utils/logtodiscord');
const logger = require('../config/logger');
require('dotenv').config({ path: '../config/.env' });

const SECRET_KEY = process.env.SECRET_KEY;

if (!SECRET_KEY) {
    throw new Error('SECRET_KEY is not defined in the environment variables');
}

function hashPassword(password) {
    const hash = crypto.createHash('sha256');
    hash.update(password);
    return hash.digest('hex');
}

exports.register_user = async (req, res) => {
    const { email, last_name, first_name, birthdate, phone, password, confirmPassword } = req.body;

    console.log('Registration attempt with:', req.body);

    if (password !== confirmPassword) {
        console.log('Passwords do not match.');
        return res.status(400).json({ success: false, message: 'Les mots de passe ne correspondent pas.' });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#°.,£¤µ?\\§;!ù%²$=%^~'\-`\/\[\]&*()_+{}|:<>?]).{8,}$/;
    if (!passwordRegex.test(password)) {
        console.log('Password does not meet complexity requirements.');
        return res.status(400).json({ success: false, message: 'Le mot de passe doit contenir au moins 8 caractères, dont une majuscule, une minuscule, un chiffre et un caractère spécial.' });
    }

    if (!birthdate) {
        console.log('Birthdate is required.');
        return res.status(400).json({ success: false, message: 'La date de naissance est obligatoire.' });
    }

    const hashedPassword = hashPassword(password);
    console.log('Hashed password:', hashedPassword);

    try {
        const query = 'INSERT INTO users (last_name, first_name, birthdate, email, phone, password) VALUES (?, ?, ?, ?, ?, ?)';
        const values = [last_name, first_name, birthdate, email, phone, hashedPassword];
        console.log('Executing query:', query);
        console.log('With values:', values);

        const [result] = await db.query(query, values);
        console.log('User registered successfully with ID:', result.insertId);
        logger.info(`User registered successfully with ID: ${result.insertId}`);
        res.status(201).json({ success: true, message: 'Inscription réussie' });
    } catch (error) {
        console.error('Erreur lors de l’exécution de la requête MySQL:', error);
        logger.error(`Error during user registration: ${error.message}`);
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ success: false, message: 'Email déjà existant' });
        } else {
            res.status(500).json({ success: false, message: 'Erreur Serveur Interne' });
        }
    }
};



exports.login_user = async (req, res) => {
    const { email, password } = req.body;

    console.log('Tentative de connexion pour:', email);

    try {
        const [rows] = await db.query('SELECT id, last_name, first_name, password FROM users WHERE email = ?', [email]);
        console.log('Database query result:', rows);
        if (rows.length > 0) {
            const user = rows[0];
            const hashedPassword = hashPassword(password);
            console.log('Hashed input password:', hashedPassword);
            if (hashedPassword === user.password) {
                console.log('Mot de passe valide pour:', email);

                sendLogToDiscord('User Login', {
                    Email: email,
                    'Name': `${user.last_name} ${user.first_name}`,
                    IP: req.headers['x-forwarded-for'] || req.connection.remoteAddress
                });

                const token = jwt.sign({
                    id: user.id,
                    name: `${user.first_name} ${user.last_name}`
                }, SECRET_KEY, { expiresIn: '1h' });

                console.log('Generated JWT token:', token);
                logger.info(`User logged in: ${email}, ID: ${user.id}`);

                res.status(200).json({
                    success: true,
                    message: 'Connexion réussie',
                    token: token,
                    user: {
                        id: user.id,
                        name: `${user.first_name} ${user.last_name}`
                    }
                });
            } else {
                console.log('Mot de passe invalide pour:', email);
                res.status(401).json({ success: false, message: 'Mot de passe invalide' });
            }
        } else {
            console.log('Utilisateur non trouvé pour:', email);
            res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
        }
    } catch (error) {
        console.error('Erreur de requête de base de données:', error);
        logger.error(`Error during user login for ${email}: ${error.message}`);
        res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
    }
};

exports.logout_user = async (req, res) => {
    try {
        console.log('User logout request received');
        sendLogToDiscord('Déconnexion Utilisateur', {
            Email: 'N/A',
            IP: req.ip,
            Host: req.hostname
        });
        logger.info(`User logged out: ${req.user.id}`);

        res.status(200).json({ success: true, message: 'Déconnexion réussie' });
    } catch (error) {
        console.error('Erreur lors de l’exécution de la requête:', error);
        logger.error(`Error during user logout: ${error.message}`);
        res.status(500).json({ success: false, message: 'Erreur Serveur Interne' });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        console.log('Fetching all users');
        const [rows] = await db.query('SELECT id, first_name, last_name, birthdate, email, phone FROM users');
        console.log('All users fetched:', rows);
        logger.info(`Fetched all users`);
        res.status(200).json({ success: true, users: rows });
    } catch (error) {
        console.error('Erreur de requête de base de données:', error);
        logger.error(`Error fetching all users: ${error.message}`);
        res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
    }
};

exports.get_profile = async (req, res) => {
    const userId = req.user.id;

    try {
        console.log('Fetching profile for user ID:', userId);
        const [rows] = await db.query('SELECT last_name, first_name, birthdate, email, phone FROM users WHERE id = ?', [userId]);
        console.log('Profile fetch result:', rows);
        if (rows.length > 0) {
            const user = rows[0];
            logger.info(`Fetched profile for user ID: ${userId}`);
            res.status(200).json({ success: true, user });
        } else {
            res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
        }
    } catch (error) {
        console.error('Erreur de requête de base de données:', error);
        logger.error(`Error fetching profile for user ID ${userId}: ${error.message}`);
        res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
    }
};

const formatDate = (dateStr) => {
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month}-${day}`;
};

exports.update_profile = async (req, res) => {
    const userId = req.user.id;
    const { last_name, first_name, birthdate, email, phone } = req.body;

    // Ensure that none of the required fields are null
    if (!last_name || !first_name || !birthdate || !email || !phone) {
        return res.status(400).json({ success: false, message: 'All fields are required and cannot be null' });
    }

    // Convert birthdate to YYYY-MM-DD format
    const formattedBirthdate = formatDate(birthdate);

    try {
        console.log('Updating profile for user ID:', userId);
        const query = 'UPDATE users SET last_name = ?, first_name = ?, birthdate = ?, email = ?, phone = ? WHERE id = ?';
        const values = [last_name, first_name, formattedBirthdate, email, phone, userId];

        console.log('Executing query:', query);
        console.log('With values:', values);

        const [result] = await db.query(query, values);
        console.log('Profile update result:', result);

        if (result.affectedRows > 0) {
            logger.info(`Updated profile for user ID: ${userId}`);
            res.status(200).json({ success: true, message: 'Profil mis à jour avec succès' });
        } else {
            res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
        }
    } catch (error) {
        console.error('Erreur lors de l’exécution de la requête MySQL:', error);
        logger.error(`Error updating profile for user ID ${userId}: ${error.message}`);
        res.status(500).json({ success: false, message: 'Erreur Serveur Interne' });
    }
};