const mongoose = require('mongoose');

var stageSchema = mongoose.Schema({
    entreprise: { type: String, required: 'This field is required.' },
    responsable: { type: String, required: 'This field is required.' },
    adresse: { type: String, required: 'This field is required.' },
    telephones: { type: Number, required: 'This field is required.' },
    email: { type: String, required: 'This field is required.' },
    siteWeb: { type: String },
    nombrePostes: { type: Number, required: 'This field is required.' },
    publication: { type: Date,default: new Date()},
    type: { type: String, required: 'This field is required.'  },
    titreOffre: { type: String , required: 'This field is required.' },
    Description: { type: String , required: 'This field is required.' },
    Missions: { type: String  },
    Competences: { type: String },
});

stageSchema.path('email').validate((val)=>{
    emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(val);
}, 'Invalid e-mail.');
var stage=module.exports=mongoose.model('stage',stageSchema);

