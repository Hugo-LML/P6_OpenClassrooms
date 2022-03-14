const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
    // On lance le code présent dans le try
    try {
        // On récupère le token présent dans le header authorization
        const token = req.headers.authorization.split(' ')[1];
        // On vérifie si le token correspond à la clé secrète JWT
        const decodedToken = jwt.verify(token, process.env.SECRET_JWT_KEY);
        // On récupère le userId du decodedToken
        const userId = decodedToken.userId;
        // On crée l'attribut auth qu'on ajoute à la requête pour lui attribuer ensuite l'userId
        req.auth = {userId};
        // Si le userId de la requête est différent de la constante userId on renvoie une erreur
        if (req.body.userId && req.body.userId !== userId) {
            throw 'User ID non valable !';
        }
        // Sinon on passe à la suite avec la méthode next()
        else {
            next();
        }
    }
    // On capte l'erreur s'il y en a une dans le catch
    catch (error) {
        res.status(401).json({error: error | 'Requête non authentifiée !'});
    }
}