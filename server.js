'use strict';

var express = require('express');
const bodyParser= require('body-parser')
const expressValidator = require('express-validator');
const multer= require('multer');
var session = require('express-session');
const passport = require('passport');
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');
require('./config/passport')(passport);

var routes = require('./routes/index.js');
var ev = require('./routes/events.js');
var ad = require('./routes/admin.js');
var etudiant = require('./routes/etudiant.js');


const fs =require('fs');
const path = require('path');

var fileUpload = require('express-fileupload');

var port = process.env.PORT || 3000;
global.__basedir = __dirname;

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/myproject',{
    useCreateIndex:true,
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log('conected to mongodb');
}).catch((error)=>{
    console.log(error);

})

var app = express();

// ================================================================
// setup our express application
// ================================================================
app.use('/public', express.static(process.cwd() + '/public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}))
//app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
})
/*app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
  });*/
  app.use(session({
    secret:'keyboard cat',
    resave:true,
    saveUninitialized:true
}));
app.use(fileUpload());
app.locals.errors =null; 
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});


//...

app.use(expressValidator({
  errorFormatter:function(param,msg,value){
    var namespace =param.split('.')
    , root = namespace.shift()
    , formParam = root;

    while(namespace.length){
      formParam+='[' +namespace.shift() + ']';
    }
    return{
      param : formParam,
      msg : msg,
      value : value
    };
  },
  customValidators: {
    isImage: function (value, filename){
      var extension = (path.extname(filename)).toLowerCase();
      switch(extension){
        case '.jpg':
          return '.jpg';
        case '.png':
          return '.png';
          case '.pdf':
            return '.pdf';
        default:
          return false;
      }
    }
  }

}));

/*app.use(session({ cookie: { maxAge: 60000 }, 
                  secret: 'woot',
                  resave: false, 
                  saveUninitialized: false}));*/
// ================================================================
// setup routes
// ================================================================
//routes(app);
app.use('/',routes);
app.use('/event',ev);
app.use('/admin',ad);
app.use('/etudiant',etudiant);
app.use('/users', require('./routes/users.js'));


var pages = require ('./routes/pages.js');
var adminPages = require ('./routes/admin_pages.js');
var adminModules = require ('./routes/admin_modules.js');
var adminCourses = require ('./routes/admin_courses.js');
var Courses = require ('./routes/courses');


app.use('/admin/pages', adminPages);
app.use('/admin/modules', adminModules);
app.use('/admin/courses', adminCourses);
app.use('/p',pages);
app.use('/c', Courses);


const stageController = require('./controllers/stageController');
const recController = require('./controllers/recController');

const rechercheController = require('./controllers/chercheController');
const infoController = require('./controllers/internationalController');
const partenariatController = require('./controllers/partenariatController');

app.use('/stage',stageController);
app.use('/recrutement',recController);

app.use('/recherche',rechercheController);
app.use('/infos',infoController);
app.use('/partners',partenariatController);

// ================================================================
// start our server
// ================================================================
app.listen(port, function() {
    console.log('Server listening on port ' + port + '...');
});
