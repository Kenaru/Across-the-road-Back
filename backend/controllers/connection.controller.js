const db = require('../config/db');
const crypto = require('crypto');
const sendLogToDiscord = require('../utils/logtodiscord');
const jwt = require('jsonwebtoken');



exports.login_user = async (req, res) => {
    const { mail, password } = req.body;
    console.log(mail, password);
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

                // Générer un token JWT
                const token = jwt.sign({ userId: user.id }, 'VrxG8eLc7ywd42q3KLm0tUb6iCoW9nRZPQD5XABYSEzhTJuHkpa1NglFfvMIOsjOlIrGvFwYEeZHztcCVBhpuSqJKdnbDaX0Ukg8omTNQR16fPdWL7jx5yMz2i9q4a3KxwOvMygqX6nARoT1bjH8hcdz9PpfKrQ7SCE0FmGJuZLaYWNkDsI2lT4e3V5BxU683i1Cky9DHL4JpUNVEZuAeQXRvqPOcSnaswG2WBh5x6TgfdMolBrYKIz07jFm8RtSvqldDtHuLcX1NbQaFYIWG2VtrPC3JfMp9BR5xSZkjTo7y80sO6Ee4hKPimAgnzmxJrNFI3S9Lw4msKpRbTuDCq7GXZ8xfHhYVz6jJ1t5dO2WPonAaM0EiyUvQeBkgLCr8wsQ1nKXdpWav3y6e4L2h7bNQlB9r5z0cFmTJfjVgZEtIqMoPxAHDSVuYCG6URoRli0Fd4NAe5c2kXjOhYTrZ1fMWV7mx8K69yPvRQJwbGnIoCsS3zqtDuHpBfEgLKaTnUMjbplE5f9H8oYKctswGRuO6JzF7mvQeBNTd3aP0rSLgqVh4x1XWiVykZI2DAmC', { expiresIn: '1h' });

                res.status(200).json({ success: true, message: 'Login successful', token: token });
            } else {
                // Mauvais mot de passe
                console.log(user);
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
        sendLogToDiscord('Création Compte Utilisateur', {
            Mail: mail,
            'Nom / Prénom': `${lastname} ${firstname}`,
            IP: req.ip,
            Host: req.hostname
        });
    } catch (error) {
        console.error('Error executing MySQL query:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error', targetDiv: 'respons', error});
    }
};

exports.logout_user = async (req, res) => {
    const { token } = req.body;

    try {
        // Vérifiez si le token est valide
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
            if (err) {
                // Le token n'est pas valide, renvoyer une erreur
                return res.status(401).json({ success: false, message: 'Invalid token' });
            } else {
                // Le token est valide, procédez à la déconnexion

                // Logique de déconnexion
                sendLogToDiscord('Déconnexion Utilisateur', {
                    UserId: decoded.userId, // Utilisez l'identifiant de l'utilisateur extrait du token
                    IP: req.ip,
                    Host: req.hostname
                });

                // Répondez avec un message de succès
                res.status(200).json({ success: true, message: 'Logout successful' });
            }
        });
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