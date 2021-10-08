var mongoose=require('mongoose');

var eventSchema=mongoose.Schema({
   
    titre:{
        type: String,

    },
    nombre:{
        type: String,

    }
});

var chiffres=module.exports=mongoose.model('chiffres',eventSchema);