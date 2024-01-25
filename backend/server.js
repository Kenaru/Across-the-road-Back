const express = require('express');
const cors = require('cors');
const db = require('./config/db'); // Chemin vers votre fichier de configuration de la base de données
const get = require('./routes/get.routes'); // Chemin vers votre fichier de routes
const post = require('./routes/post.routes'); // Chemin vers votre fichier de routes


const app = express();
const port = 5000;

app.use(cors());

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes et autres configurations...
app.use('/api/get', get);
app.use('/api/post', post);

// Lancer le serveur
app.listen(port, () => console.log('Le serveur fonctionne sur le port ' + port));
console.log('Lien de connexion au serveur http://127.0.0.1:5500');