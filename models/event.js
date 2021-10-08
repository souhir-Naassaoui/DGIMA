var mongoose=require('mongoose');

var eventSchema=mongoose.Schema({
    nom:{
        type:String,
        required: true
    },
    description:{
        type:String,
        required:true
    },
    image:{
        type: String,

    },
    datem:{
        type:Date,
        default: Date.now

    }
});

var events=module.exports=mongoose.model('events',eventSchema);