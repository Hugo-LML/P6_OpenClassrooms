const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const passwordValidator = require('../middleware/passwordValidator');
const rateLimit = require('../middleware/rateLimit');

// Toutes les routes sauces sont gérées ici (les controllers sont associés aux routes correspondantes)
// Les middlewares sont passés aux routes dans un ordre précis pour qu'ils soient tous effectifs correctement
router.post('/signup', passwordValidator, userCtrl.signup);
router.post('/login', rateLimit, userCtrl.login);

module.exports = router;