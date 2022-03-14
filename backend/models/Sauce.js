const mongoose = require('mongoose');

// Grâce à mongoose on peut créer des schémas (ici une sauce créée par un utilisateur devra respecter ce schéma de sauce)
const sauceSchema = mongoose.Schema({
    userId: {type: String, required: true},
    name: {type: String, required: true},
    manufacturer: {type: String, required: true},
    description: {type: String, required: true},
    mainPepper: {type: String, required: true},
    imageUrl: {type: String, required: true},
    heat: {type: Number, required: true},
    likes: {type: Number, default: 0, required: false},
    dislikes: {type: Number, default: 0, required: false},
    usersLiked: {type: [String], required: false},
    usersDisliked: {type: [String], required: false}
});

module.exports = mongoose.model('Sauce', sauceSchema);