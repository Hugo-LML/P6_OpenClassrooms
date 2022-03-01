const express = require('express');
const router = express.Router();

const User = require('../models/User');

router.post('/signup',(req, res, next) => {
    const user = new User({
        ...req.body
    });
    user.save()
        .then(() => {
            res.status(201).json({message: 'Inscription réussie !'});
            console.log('Inscription réussie !');
        })
        .catch(error => {
            res.status(400).json({error});
            console.log('Error !');
        });
});

module.exports = router;