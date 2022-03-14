const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const helmet = require('helmet');
require('dotenv').config();

// On récupère les routes des users et des sauces
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');

// Création de l'application express
const app = express();

// Permet d'avoir accès au corps des requêtes (le corps de la requête devient accessible avec req.body)
app.use(express.json());

// Connexion à la base de données MongoDB
mongoose
    .connect(process.env.SECRET_DB, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log("Connexion à MongoDB réussie !"))
    .catch(() => console.log("Connexion à MongoDB échouée !"));

// Tous les utilisateurs peuvent faire des requêtes depuis leur navigateur (plus d'erreurs CORS)
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    next();
});

// La ressource images est gérée de manière statique à chaque fois qu'elle reçoit une requête vers la route /image
app.use('/images', express.static(path.join(__dirname, 'images')));

// Le package helmet est utilisé sur toutes les routes pour les protéger des attaques courantes
app.use(helmet());

// Pour les routes /api/auth & /api/sauces, on utilise les routes exportées plus tôt
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);

module.exports = app;