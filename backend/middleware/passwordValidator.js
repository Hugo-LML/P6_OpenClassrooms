const passwordSchema = require('../models/Password');

// Si le mot de passe choisi par l'utilisateur ne respecte pas le schéma, alors on renvoie une erreur
module.exports = (req, res, next) => {
    if (!passwordSchema.validate(req.body.password)) {
        res.status(400).json({message: 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, et un chiffre !'});
    }
    else {
        next();
    }
};