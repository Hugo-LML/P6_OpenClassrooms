const passwordValidator = require('password-validator');

const passwordSchema = new passwordValidator();

// Le mot de passe qui sera testé doit retourner true pour chaque méthodes appliquées à passwordSchema
passwordSchema.is().min(8);
passwordSchema.is().max(64);
passwordSchema.has().uppercase();
passwordSchema.has().lowercase();
passwordSchema.has().digits();
passwordSchema.has().not().spaces();

module.exports = passwordSchema;