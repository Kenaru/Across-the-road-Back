const db = require('../config/db');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const sendLogToDiscord = require('../utils/logtodiscord');

require('dotenv').config({ path: './config/.env' });

const SECRET_KEY = process.env.SECRET_KEY;

function hashPassword(password) {
    const hash = crypto.createHash('sha256');
    hash.update(password);
    return hash.digest('hex');
}
exports.register_user = async (req, res) => {
    const { email, last_name, first_name, birthday, phone, password, confirmPassword } = req.body;

    console.log('Registration attempt with:', req.body);

    if (password !== confirmPassword) {
        console.log('Passwords do not match.');
        return res.status(400).json({ success: false, message: 'Les mots de passe ne correspondent pas.' });
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#°.£¤µ,?\\§;!ù%²$=%^~'\-`\/\[\]&*()_+{}|:<>?]).{8,}$/.test(password)) {
        console.log('Password does not meet complexity requirements.');
        return res.status(400).json({ success: false, message: 'Le mot de passe doit contenir au moins 8 caractères, dont une majuscule, une minuscule, un chiffre et un caractère spécial.' });
    }

    const hashedPassword = hashPassword(password);
    console.log('Hashed password:', hashedPassword);

    try {
        const query = 'INSERT INTO users (last_name, first_name, birthdate, email, phone, password) VALUES (?, ?, ?, ?, ?, ?)';
        const values = [last_name, first_name, birthday, email, phone, hashedPassword];
        console.log('Executing query:', query);
        console.log('With values:', values);

        const [result] = await db.query(query, values);
        console.log('User registered successfully with ID:', result.insertId);
        res.status(201).json({ success: true, message: 'Inscription réussie' });
    } catch (error) {
        console.error('Erreur lors de l’exécution de la requête MySQL:', error);
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
        if (rows.length > 0) {
            const user = rows[0];
            const hashedPassword = hashPassword(password);
            if (hashedPassword === user.password) {
                console.log('Mot de passe valide pour:', email);

                sendLogToDiscord('User Login', {
                    Email: email,
                    'Name': `${user.last_name} ${user.first_name}`,
                    IP: req.headers['x-forwarded-for'] || req.connection.remoteAddress
                });

                if (!SECRET_KEY) {
                    throw new Error('SECRET_KEY is not defined');
                }

                const token = jwt.sign({
                    id: user.id,
                    name: `${user.first_name} ${user.last_name}`
                }, SECRET_KEY, { expiresIn: '1h' });

                res.status(200).json({
                    success: true,
                    message: 'Connexion réussie',
                    token: token,
                    user: {
                        id: user.id,
                        name: user.first_name + ' ' + user.last_name
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
        res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
    }
};


exports.logout_user = async (req, res) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ success: false, message: 'Token manquant' });
    }

    try {
        sendLogToDiscord('Déconnexion Utilisateur', {
            Email: 'N/A',
            IP: req.ip,
            Host: req.hostname
        });

        res.status(200).json({ success: true, message: 'Déconnexion réussie' });
    } catch (error) {
        console.error('Erreur lors de l’exécution de la requête:', error);
        res.status(500).json({ success: false, message: 'Erreur Serveur Interne' });
    }
};
