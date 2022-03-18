const rateLimit = require('express-rate-limit');

const myRateLimit = rateLimit({
    windowMs: 1 * 60 * 60 * 1000, // 1 heure en millisecondes
    max: 5,
    message: "Vous avez utlisé vos cinq essais, revenez dans une heure !",
    headers: true
});

module.exports = myRateLimit;