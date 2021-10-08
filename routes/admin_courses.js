var express = require('express');
var router = express.Router();
var mkdirp = require('mkdirp');
var fs = require('fs-extra');
var resizeImg = require('resize-img');



// Get Course model
var Course = require('../models/course');
// Get Module model
var Module = require('../models/module');
//Get courses index Admin
router.get('/', function (req, res) {
    var count;

    /*Course.count(function (err, c) {
        count = c;
    });*/
   Course.find(function (err, courses) {
    if (err)
    return console.log(err);
        res.render('admin/courses', {
            courses: courses,
            //count: count
        });
    });
});



// get add courses


router.get('/add-course', function(req, res) {
    
    var title = "";
    var slug = "";
    var teacher = "";
    var desc = "";
   var  modules = "";
    Module.find(function(err, modules){
            if (err)
                return console.log(err);
    res.render('admin/add_course',{
       title : title,
       teacher : teacher,
       slug : slug,
       modules : modules,
       desc : desc

    });
});
    
});



/*
 * POST add course
 */
router.post('/add-course', function (req, res) {
    
    req.checkBody('title', 'Title must have a value.').notEmpty();
    req.checkBody('desc', 'description must have a value.').notEmpty();
    req.checkBody('teacher', 'teacher must have a value.').notEmpty();
    req.checkBody('image', 'You must upload an image').isImage(imageFile);
    var title = req.body.title;
    var slug = req.body.title.replace(/\s+/g, '-').toLowerCase();
    var teacher = req.body.teacher;
    var desc = req.body.desc;

    var module = req.body.module;
    var imageFile ;
    

      if(req.files){
        imageFile = req.files.image !== "undefined" ? req.files.image.name : "";
    }
       else{
        imageFile =""; }
    /*var errors = req.validationErrors();

    if (errors) {
        res.render('admin/add_course',{
            errors : errors,
            title : title,
            slug : slug,
            module : module,
            desc : desc,
            teacher:teacher
     
         });
    } else {*/
        Course.findOne({slug: slug}, function (err, course) {
            if (course) {
                req.flash('danger', 'Course title exists, choose another.');
                Module.find(function (err, modules) {
                    res.render('admin/add_course', {
                            teacher:teacher,
                            title : title,
                            slug : slug,
                            modules : modules,
                            desc : desc
                    });
                });
            }else {
                var course = new Course({
                    title: title,
                    teacher:teacher,
                    slug: slug,
                    desc: desc,
                    module: module,
                    image: imageFile
                });

                course.save(function (err) {
                    if (err)
                        return console.log(err);
                        mkdirp('public/course_image/' + course._id, function (err) {
                            return console.log(err);
                        });
                        mkdirp('public/course_image/' + course._id+ '/gallery' ,function(err){
                            return console.log(err);
                          });
                        if (imageFile != "") {
                            var courseImage = req.files.image;
                            var path = 'public/course_image/' + course._id +'/'+ imageFile;
    
                            courseImage.mv(path, function (err) {
                                return console.log(err);
                            });
                        }
    

                   
                       

                    req.flash('success', 'Course added!');
                    res.redirect('/admin/courses');
                });
            }
        });
   // }

});



router.get('/edit-course/:id', function (req, res) {
    var errors;

    if (req.session.errors)
        errors = req.session.errors;
    req.session.errors = null;
    var id = req.params.id;
    Module.find(function (err, modules) {

        Course.findById(req.params.id, function (err, c) {
            if (err) {
                console.log(err);
                res.redirect('/admin/courses');
            } else {
                var galleryDir = 'public/course_image/' + id + '/gallery';
                var galleryImages = null;

                fs.readdir(galleryDir, function (err, files) {
                    if (err) {
                        console.log(err);
                    } else {
                        galleryImages = files;

                        res.render('admin/edit_course', {
                            title: c.title,
                            errors: errors,
                            desc: c.desc,
                            modules: modules,
                            module: c.module,
                            teacher: c.teacher,
                            image: c.image,
                            galleryImages: galleryImages,
                            id: c._id
                        });
                    }
                });
            }
        });

    });

});
/*
 * POST edit course
 */
router.post('/edit-course/:id', function (req, res) {
    var imageFile ;
    if(req.files){
      imageFile= req.files.image!== "undefined" ? req.files.image.name : "";
     }
     else{
        imageFile =""; }
    req.checkBody('title', 'Title must have a value.').notEmpty();
    req.checkBody('desc', 'description must have a value.').notEmpty();
    req.checkBody('teacher', 'teacher must have a value.').notEmpty();
    //req.checkBody('image', 'You must upload an image').isImage(imageFile);
    var title = req.body.title;
   /* var slug = req.body.title.replace(/\s+/g, '-').toLowerCase();
    if (slug == "")*/
      var  slug = title.replace(/\s+/g, '-').toLowerCase();
    var desc = req.body.desc;
    var module = req.body.module;
    var teacher=req.body.teacher;
    var cimage = req.body.cimage;
    var id = req.params.id;


    var errors = req.validationErrors();
    if (errors) {
        console.log(errors);
        
        res.redirect('/admin/courses');}
        

                        
     else {
        Course.findOne({slug: slug, _id: {'$ne': id}}, function (err, c) {
            if (err)
                console.log(err);

            if (c) {
                req.flash('danger', 'Course title exists, choose another.');
                res.redirect('/admin/courses/edit-course/' + id);
            } else {
                Course.findById(id, function (err, c) {
                    if (err)
                        console.log(err);
                    
                      
                    c.title = title;
                    c.slug = slug;
                    c.desc = desc;
                    c.module = module;
                    c.teacher=teacher;
                    if (imageFile != "") {
                        c.image = imageFile;
                    }

                    c.save(function (err) {
                        if (err)
                            console.log(err);

                        if (imageFile != "") {
                            if (cimage != "") {
                                fs.remove('public/course_image/' + id + '/' + cimage, function (err) {
                                    if (err)
                                        console.log(err);
                                });
                            }

                            var courseImage = req.files.image;
                            var path = 'public/course_image/' + id + '/' + imageFile;

                            courseImage.mv(path, function (err) {
                                return console.log(err);
                            });

                        }

                        req.flash('success', 'Course edited!');
                       // res.redirect('/admin/courses/edit-course/' + id);
                       res.redirect('/admin/courses');

                    });

                });
            }
        });
    }
});
/*
 * POST product gallery
 */
router.post('/course-gallery/:id', function (req, res) {

    var courseImage = req.files.file;
    var id = req.params.id;
    var path = 'public/course_image/' + id + '/gallery/' + req.files.file.name;

    courseImage.mv(path, function (err) {
        if (err)
            console.log(err);
      
    });

    res.sendStatus(200);
    //res.render('admin/courses');

});
/*
 * GET delete image
 */
router.get('/delete-image/:image', function (req, res) {

    var originalImage = 'public/course_image/' + req.query.id + '/gallery/' + req.params.image;

    fs.remove(originalImage, function (err) {
        if (err) {
            console.log(err);
        } else {
           
                    req.flash('success', 'Image deleted!');
                    res.redirect('/admin/courses/edit-course/' + req.query.id);
                }
            });
        });
/*
 * GET delete course
 */
router.get('/delete-course/:id',  function (req, res) {

    var id = req.params.id;
    var path = 'public/course_image/' + id;

    fs.remove(path, function (err) {
        if (err) {
            console.log(err);
        } else {
            Course.findByIdAndRemove(id, function (err) {
                if (err) {
                    console.log(err);
                }
            });
            
            req.flash('success', 'Course deleted!');
            res.redirect('/admin/courses');
        }
    });

});


//exports
module.exports = router;