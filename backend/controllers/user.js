const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cryptojs = require('crypto-js');
require('dotenv').config();

const User = require('../models/User');

// Inscription à Piiquante (l'adresse mail et le mot de passe sont hachés avant d'être stockes dans MongoDB)
exports.signup = (req, res, next) => {
    const hashedEmail = cryptojs.HmacSHA256(req.body.email, process.env.SECRET_CRYPTOJS_TOKEN).toString(cryptojs.enc.Base64);
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: hashedEmail,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({message: 'Utilisateur créé !'}))
                .catch(error => res.status(400).json({error}));
        })
        .catch(error => res.status(500).json({error}));
};

// Connexion à Piiquante (si l'adresse mail et le mot de passe sont corrects, alors on renvoie un objet JSON contenant
// le userId et un token avec le package jwt)
exports.login = (req, res, next) => {
    const hashedEmail = cryptojs.HmacSHA256(req.body.email, process.env.SECRET_CRYPTOJS_TOKEN).toString(cryptojs.enc.Base64);
    User.findOne({email: hashedEmail})
        .then(user => {
            if (!user) {
                return res.status(401).json({error: 'Utilisateur non trouvé !'});
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({error: 'Mot de passe incorrect'});
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            {userId: user._id},
                            process.env.SECRET_JWT_KEY,
                            {expiresIn: '24h'}
                        )
                    });
                })
                .catch(error => res.status(500).json({error}));
        })
        .catch(error => res.status(500).json({error}));
};