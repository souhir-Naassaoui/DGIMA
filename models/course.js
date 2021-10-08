var mongoose = require('mongoose');

// Course Schema
var CourseSchema = mongoose.Schema({
   
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String
    },
    image: {
        type: String
        
    },
    module: {
        type: String,
        
    },
    teacher: {
        type: String
        
    }
    ,
    desc: {
        type: String,
        required: true
    }
    
    
    
});

var Course = module.exports = mongoose.model('Course', CourseSchema);
