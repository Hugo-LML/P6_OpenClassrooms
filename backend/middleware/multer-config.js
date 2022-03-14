const multer = require('multer');

// On génère les extensions des fichiers
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

// DiskStorage permet de stocker des fichiers sur le disque dur
const storage = multer.diskStorage({
    // On renseigne la destination des fichiers à enregister par Multer
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    // On explique à Multer quel nom de fichier sera enregistré
    filename: (req, file, callback) => {
        // On remplace les espaces par des tirets du bas
        const name = file.originalname.split(' ').join('_');
        // On crée l'extension du fichier grâce au dictionnaire
        const extension = MIME_TYPES[file.mimetype];
        // On crée le filename avec le nom + la date + l'extension
        callback(null, name + Date.now() + '.' + extension);
    }
});

// On exporte le middleware multer en précisant qu'il s'agit de fichiers uniques et qu'ils contiennent des images
module.exports = multer({storage}).single('image');