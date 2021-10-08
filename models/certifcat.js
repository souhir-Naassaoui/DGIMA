var mongoose=require('mongoose');

var eventSchema=mongoose.Schema({
   
    titre:{
        type: String,

    },
    description:{
        type: String,

    }
});

var certificat=module.exports=mongoose.model('certificat',eventSchema);