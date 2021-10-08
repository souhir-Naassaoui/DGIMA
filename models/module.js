var mongoose = require('mongoose');

// module Schema
var ModuleSchema = mongoose.Schema({
   
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String
    },
    section:{
        type:String,
        required: true

    },
    semestre:{
        type:String,
        required: true
    }

});

var Module = module.exports = mongoose.model('Module', ModuleSchema);
