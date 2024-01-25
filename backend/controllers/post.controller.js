const db = require('../config/db');
const crypto = require('crypto');
const sendLogToDiscord = require('../utils/logtodiscord');



exports.login_user = async (req, res) => {
    const { mail, password } = req.body;

    try {
        const [rows] = await db.query('SELECT * FROM Users WHERE mail = ?', [mail]);
        if (rows.length > 0) {
            const user = rows[0];
            const hashedPassword = hashPassword(password);
            if (hashedPassword === user.password) {
                // Logique de connexion réussie
                let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
                if (ip) {
                    // Extrait la première adresse IP en cas de plusieurs adresses
                    ip = ip.split(',')[0];
                    // Conversion d'une adresse IPv6 mappée en IPv4 (si applicable)
                    if (ip.startsWith('::ffff:')) {
                        ip = ip.substring(7);
                    }
                }

                sendLogToDiscord('Connexion Utilisateur', {
                    Mail: mail,
                    'Nom / Prénom': `${user.lastname} ${user.firstname}`,
                    IP: ip || 'IP non disponible', // Utiliser 'IP non disponible' si l'IP n'est pas détectée
                    Host: req.hostname
                });
                // L'utilisateur existe, les détails sont corrects
                await db.query('UPDATE Users SET is_logged_in = 1 WHERE mail = ?', [mail]);
                const loginTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
                await db.query('INSERT INTO sessions (user_id, login_time, logout_time) VALUES (?, ?, DATE_ADD(?, INTERVAL 12 HOUR))', [user.id, loginTime, loginTime]);

                res.status(200).json({ success: true, message: 'Login successful' });
            } else {
                // Mauvais mot de passe
                res.status(401).json({ success: false, message: 'Invalid username or password' });
            }
        } else {
            // Aucun utilisateur trouvé avec l'email fourni
            res.status(401).json({ success: false, message: 'Invalid username or password' });
        }
    } catch (error) {
        console.error('Error executing MySQL query:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};


exports.register_user = async (req, res) => {
    const { mail, lastname, firstname, birthday, phonenumber, password, confirmPassword } = req.body;

    // Regex pour vérifier le mot de passe
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#°.£¤µ,?\\§;!ù%²$=%^~'\-`\/\[\]&*()_+{}|:<>?]).{8,}$/;

    try {
        // Enregistrement réussi
        sendLogToDiscord('Création Compte Utilisateur', {
            Mail: mail,
            'Nom / Prénom': `${lastname} ${firstname}`,
            IP: req.ip,
            Host: req.hostname
        });
        if (!passwordRegex.test(password)) {
            // Le mot de passe ne correspond pas aux critères requis
            console.log(password);
            console.log(passwordRegex.test(password));
            return res.status(400).json({ success: false, message: 'Le mot de passe doit faire au moins 8 caractères et contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial.' });
        }

        if (password !== confirmPassword) {
            // Les mots de passe ne correspondent pas
            return res.status(400).json({ success: false, message: 'Les mots de passe ne correspondent pas.' });
        }

        // Hacher le mot de passe avec SHA-256
        const hashedPassword = hashPassword(password);
        
        // Procéder à l'inscription avec le mot de passe haché
        await db.query('INSERT INTO Users SET ?', { mail, lastname, firstname, birthday, phonenumber, password: hashedPassword, reset_token: null, reset_token_expires: null });

        res.status(201).json({ success: true, message: 'Inscription réussie', targetDiv: 'respons' });
    } catch (error) {
        console.error('Error executing MySQL query:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error', targetDiv: 'respons' });
    }
};

exports.logout_user = async (req, res) => {
    const { mail } = req.body; // Vous devrez transmettre l'email de l'utilisateur lors de la déconnexion

    try {
        // Logique de déconnexion
        sendLogToDiscord('Déconnexion Utilisateur', {
            Mail: mail,
            IP: req.ip,
            Host: req.hostname
        });
        // Mettez à jour la base de données pour indiquer que l'utilisateur s'est déconnecté
        await db.query('UPDATE Users SET is_logged_in = 0 WHERE mail = ?', [mail]);
        const logoutTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
        await db.query('UPDATE sessions SET logout_time = ? WHERE user_id = (SELECT id FROM Users WHERE mail = ?) ORDER BY login_time DESC LIMIT 1', [logoutTime, mail]);

        res.status(200).json({ success: true, message: 'Logout successful' });
    } catch (error) {
        console.error('Error executing MySQL query:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};


// Fonction pour hacher le mot de passe avec SHA-256
function hashPassword(password) {
    const hash = crypto.createHash('sha256');
    hash.update(password);
    return hash.digest('hex');
}

