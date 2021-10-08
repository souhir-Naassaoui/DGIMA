const mongoose = require('mongoose');

var ecolesSchema = mongoose.Schema({
    pays: { type: String, required: 'This field is required.' },
    institution: { type: String, required: 'This field is required.' },
    dateSignature: { type: Date, required: 'This field is required.' },
    dureeValidite: { type: String, required: 'This field is required.' },
});


var ecoles=module.exports=mongoose.model('ecoles',ecolesSchema);
