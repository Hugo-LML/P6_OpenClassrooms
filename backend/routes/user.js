const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const passwordValidator = require('../middleware/passwordValidator');

// Toutes les routes sauces sont gérées ici (les controllers sont associés aux routes correspondantes)
// Les middlewares sont passés aux routes dans un ordre précis pour qu'ils soient tous effectifs correctement
router.post('/signup', passwordValidator, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;