var mongoose=require('mongoose');

var eventSchema=mongoose.Schema({
    titre:{
        type:String,
        required: true
    },
    description:{
        type:String,
        required:true
    },
    date:{
        type:Date

    },
    datem:{
        type:Date,
        default: Date.now


    }
});

var presse=module.exports=mongoose.model('presse',eventSchema);