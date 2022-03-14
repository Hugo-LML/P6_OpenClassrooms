const express = require('express');
const router = express.Router();
const sauceCtrl = require('../controllers/sauce.js');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

// Toutes les routes sauces sont gérées ici (les controllers sont associés aux routes correspondantes)
// Les middlewares sont passés aux routes dans un ordre précis pour qu'ils soient tous effectifs correctement
router.post('/', auth, multer, sauceCtrl.createSauce);
router.get('/', auth, sauceCtrl.displaySauces);
router.get('/:id', auth, sauceCtrl.displaySauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.post('/:id/like', auth, sauceCtrl.likeDislike);

module.exports = router;