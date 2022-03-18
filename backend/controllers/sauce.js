const Sauce = require('../models/Sauce');
const fs = require('fs');

// Crée une sauce basé sur le modèle 'Sauce'
exports.createSauce = (req, res, next) => {
    // On extrait l'objet JSON sauce de la requête
    const sauceObject = JSON.parse(req.body.sauce);
    // On supprime l'id naturellement généré par MongoDB
    delete sauceObject._id; 
    // On crée une nouvelle instance du modèle 'Sauce'
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => {
            res.status(201).json({message: 'Objet enregistré !'});
            console.log('Sauce créée !');
        })
        .catch(error => {
            res.status(400).json({error});
            console.log('Erreur');
        });
};

// Affiche toutes les sauces
exports.displaySauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({error}));
}

// Affiche une sauce cliqué par l'utilisateur
exports.displaySauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({error}));
}

// Modifie une sauce
exports.modifySauce = (req, res, next) => {
    // On vérifie si l'image a été modifié avec l'opérateur ternaire (si l'image a été modifié req.file = true)
    const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : {...req.body};
    Sauce.updateOne({_id: req.params.id}, {...sauceObject, id: req.params.id})
        .then(() => res.status(200).json({message: 'Objet modifié !'}))
        .catch(error => res.status(400).json({error}));
}

// Supprime une sauce
exports.deleteSauce = (req, res, next) => {
    // On cherche d'abord l'id de la sauce...
    Sauce.findOne({_id: req.params.id})
        .then(sauce => {
            // Si la sauce n'existe pas on renvoie une erreur
            if (!sauce) {
                return res.status(404).json({error: new Error('Sauce non trouvée !')});
            }
            // Si le userId du créateur de la sauce est différent de celui qui essaye la supprimer, on renvoie une erreur
            if (sauce.userId !== req.auth.userId) {
                return res.status(401).json({error: new Error('Requête non autorisée !')});
            }
            // ...pour le récupérer dans une constante...
            const filename = sauce.imageUrl.split('/images/')[1];
            // ...et supprimer ainsi le fichier correspondant à cet id
            fs.unlink(`images/${filename}`, () => {
                // Une fois que c'est fait on supprime la sauce de la base de données dans le callback de fs.unlink()
                Sauce.deleteOne({_id: req.params.id})
                    .then(() => res.status(200).json({message: 'Objet supprimé !'}))
                    .catch(error => res.status(400).json({error}));
            });
        })
        .catch(error => res.status(500).json({error}));
}

// Like ou dislike une sauce
exports.likeDislike = (req, res, next) => {
    // Si le like dans la requete = 1
    if (req.body.like === 1) {
        Sauce.findOne({_id: req.params.id})
            .then(sauce => {
                // et l'utilisateur n'a pas déjà liké la sauce
                if (sauce.usersLiked.includes(req.body.userId)) {
                    console.error("L'utilisateur a déjà liké cette sauce !");
                }
                // alors on update la sauce en incrémentant le nombre dans la base de données et on pousse dans le tableau usersLiked l'userId
                else {
                    Sauce.updateOne({_id: req.params.id}, {$inc: {likes: 1}, $push: {usersLiked: req.body.userId}})
                        .then(() => res.status(200).json({message: 'Sauce likée !'}))
                        .catch(error => res.status(400).json({error}));
                }
            })
            .catch(error => res.status(400).json({error}));
    }
    // Ou si le like dans la requete = -1
    else if (req.body.like === -1) {
        Sauce.findOne({_id: req.params.id})
            .then(sauce => {
                // et l'utilisateur n'a pas déjà disliké la sauce
                if (sauce.usersDisliked.includes(req.body.userId)) {
                    console.error("L'utilisateur a déjà disliké cette sauce !");
                }
                // alors on update la sauce en décrémentant le nombre dans la base de données et on pousse dans le tableau usersDisliked l'userId
                else {
                    Sauce.updateOne({_id: req.params.id}, {$inc: {dislikes: 1}, $push: {usersDisliked: req.body.userId}})
                        .then(() => res.status(200).json({message: 'Sauce dislikée !'}))
                        .catch(error => res.status(400).json({ error }));
                }
            })
            .catch(error => res.status(400).json({error}));
    }
    // Sinon (donc si like = 0) on vient chercher les données de la sauce avec son id
    else {
        Sauce.findOne({_id: req.params.id})
            // qui nous donne reponse de promesse sauce
            .then(sauce => {
                // si dans la le tableau des usersLiked on y trouve l'userId alors
                if (sauce.usersLiked.includes(req.body.userId)) {
                    // on vient retirer du tableau l'user id et décrémenter de 1 les likes
                    Sauce.updateOne({_id: req.params.id}, {$pull: {usersLiked: req.body.userId}, $inc: {likes: -1}})
                        .then(() => res.status(200).json({message: 'Like supprimé !'}))
                        .catch(error => res.status(400).json({error}));
                }
                // Ou si dans le tableau userDisliked on trouve l'userId alors
                else if (sauce.usersDisliked.includes(req.body.userId)) {
                    // on vient retirer l'userID du tableau userDisliked et on vient décrémenter de 1 les dislikes
                    Sauce.updateOne({_id: req.params.id}, {$pull: {usersDisliked: req.body.userId}, $inc: {dislikes: -1}})
                        .then(() => res.status(200).json({message: 'Dislike supprimé !'}))
                        .catch(error => res.status(400).json({error}));
                }
            })
            .catch(error => res.status(400).json({error}));
    }
}