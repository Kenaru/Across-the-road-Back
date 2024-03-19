const jwt = require('jsonwebtoken');

// Middleware pour vérifier le token JWT
const verifyToken = (req, res, next) => {
    // Récupérer le token de l'en-tête Authorization
    const token = req.headers.authorization;

    // Vérifier si le token est présent
    if (!token) {
        return res.status(401).json({ success: false, message: 'No token provided' });
    }

    try {
        // Vérifier et décoder le token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        // Ajouter les informations utilisateur décodées à l'objet de requête pour une utilisation ultérieure
        req.user = decoded;

        // Passer à la prochaine fonction middleware
        next();
    } catch (error) {
        // Erreur de vérification du token
        return res.status(401).json({ success: false, message: 'Invalid token' });
    }
};

module.exports = verifyToken;
