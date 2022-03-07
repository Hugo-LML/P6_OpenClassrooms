const Sauce = require('../models/Sauce');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [''],
        usersDisliked: ['']
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

exports.displaySauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({error}));
}

exports.displaySauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({error}));
}

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : {...req.body};
    Sauce.updateOne({_id: req.params.id}, {...sauceObject, id: req.params.id})
        .then(() => res.status(200).json({message: 'Objet modifié !'}))
        .catch(error => res.status(400).json({error}));
}

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({_id: req.params.id})
                    .then(() => res.status(200).json({message: 'Objet supprimé !'}))
                    .catch(error => res.status(400).json({error}));
            });
        })
        .catch(error => res.status(500).json({error}));
}

exports.likeDislike = (req, res, next) => {
    
    let like = req.body.likes;
    let userId = req.body.userId;
    let sauceId = req.params.id;
    console.log(req.body.likes);

    Sauce.findOne({_id: sauceId})
        .then(sauce => {
            let hasTheUserLikedThisSauce = sauce.usersLiked.includes(userId);
            let hasTheUserDislikedThisSauce = sauce.usersDisliked.includes(userId);

            switch (like) {
                case 1:
                    if (hasTheUserLikedThisSauce) {
                        console.error("L'utilisateur a déjà liké cette sauce !");
                    }
                    else {
                        sauce.likes += 1;
                        sauce.usersLiked.push(userId);
                    }
                    if (hasTheUserDislikedThisSauce) {
                        console.error("L'utilisateur doit d'abord annuler son dislike !");
                    }
                    break;
                
                case 0:
                    if (hasTheUserLikedThisSauce) {
                        sauce.likes -= 1;
                        sauce.usersLiked.filter(id => id !== userId);
                    }
                    else {
                        if (hasTheUserDislikedThisSauce) {
                            sauce.dislikes -= 1;
                            sauce.usersDisliked.filter(id => id !== userId)
                        }
                    }
                break;
                    
                case -1:
                    if (hasTheUserDislikedThisSauce) {
                        console.error("L'utilisateur a déjà disliké la sauce !");
                    }
                    else {
                        sauce.dislikes += 1;
                        sauce.usersDisliked.push(userId);
                    }
                    if (hasTheUserLikedThisSauce) {
                        console.error("L'utilisateur doit d'abord annuler son like !");
                    }
                break;

                default:
                    console.log('Erreur !');
            }

            sauce.save()
                .then(() => res.status(201).json({message: 'Statut like/dislike mis à jour !'}))
                .catch(error => res.status(400).json({error}));
        })
    .catch(error => res.status(500).json({error}));

    // switch (like) {
    //     case 1:
    //         Sauce.updateOne({_id: sauceId}, {$push: {usersLiked: userId}, $set: {likes: 1}})
    //             .then(() => res.status(200).json({message: 'Sauce likée !'}))
    //             .catch(error => res.status(400).json({error}));
    //         break;
        
    //     case 0:
    //         Sauce.findOne({_id: sauceId})
    //             .then((sauce) => {
    //                 if (sauce.usersLiked.includes(userId)) {
    //                     Sauce.updateOne({_id: sauceId}, {$pull: {usersLiked: userId}}, {$inc: {likes: -1}})
    //                         .then(() => res.status(200).json({message: 'Sauce unlikée !'}))
    //                         .catch(error => res.status(400).json({error}));
    //                 }
    //                 if (sauce.usersDisliked.includes(userId)) {
    //                     Sauce.updateOne({_id: sauceId}, {$pull: {usersDisliked: userId}}, {$inc: {dislikes: -1}})
    //                         .then(() => res.status(200).json({message: 'Sauce undislikée !'}))
    //                         .catch(error => res.status(400).json({error}));
    //                 }
    //             })
    //             .catch(error => res.status(404).json({error}));
    //         break;
        
    //     case -1:
    //         Sauce.updateOne({_id: sauceId}, {$push: {usersDisliked: userId}}, {$set: {dislikes: 1}})
    //             .then(() => res.status(200).json({message: 'Sauce dislikée !'}))
    //             .catch(error => res.status(400).json({error}));
    //         break;
    
    //     default:
    //         console.log('Pas marché');
    // }
}