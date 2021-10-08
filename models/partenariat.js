const mongoose = require('mongoose');

var partnersSchema = mongoose.Schema({
    nomPartenaire: { type: String, required: 'This field is required.' },
    typeAaccord: { type: String, required: 'This field is required.' },
    objetAccord: { type: String, required: 'This field is required.' },
    dureAccord: { type: Number, required: 'This field is required.' },
    dateSignature: { type: Date},
});

var partner=module.exports=mongoose.model('partner',partnersSchema);

