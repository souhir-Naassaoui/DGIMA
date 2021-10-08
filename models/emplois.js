var mongoose=require('mongoose');

var eventSchema=mongoose.Schema({
   
    image:{
        type: String,

    },
    nom:{
        type: String,

    },
    datem:{
        type:Date,
        default: Date.now


    }
});

var emplois=module.exports=mongoose.model('emplois',eventSchema);