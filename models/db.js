const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://souhirdb:dfgMpp23@cluster0.hgd49.mongodb.net/ENIS?retryWrites=true&w=majority\n' +
    '\n',
    { useNewUrlParser: true,
        useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));
require('./stage.model');
require('./partenariat.model');


