const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Grâce à mongoose on peut créer des schémas (ici une compte créée par un utilisateur devra respecter ce schéma)
const userSchema = mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true}
});

// On vérifie que l'email rentré par l'utilisateur est unique
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);