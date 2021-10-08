var express = require('express');
var router = express.Router();
var fs = require('fs-extra');

// Get Course model
var Course = require('../models/course');
var Module = require('../models/module');

/*
 * get all courses to student
 */
router.get('/', function (req, res) {
    Course.find(function(err,course){
        if(err) return console.log(err);
        res.render('all_courses',{
            title: "All Courses",
            course : course
        });
    });
});
   
    

/*
 * GET courses by module
 */
router.get('/:module', function (req, res) {

    var moduleSlug = req.params.module;

    Module.find({slug: moduleSlug}, function (err, c) {
        Course.find({module: moduleSlug}, function (err, courses) {
            if (err)
                console.log(err);

            res.render('admin/mod_courses', {
                title: moduleSlug,
                courses: courses
            });
        });
    });

});
/*router.get('/:section/:sem', function (req, res) {
    var section=req.params.section;
    var sem = req.params.sem;

    Module.find({semestre: sem,section:section}, function (err, c) {
            if (err)
                console.log(err);

            res.render('pages/modules', {
                c:c
            });
        });
    });*/
  
   /* router.get('/:section/:sem/:module', function (req, res) {
        var section=req.params.section;
        var sem = req.params.sem;
        var moduleSlug = req.params.module;
    
        Module.find({semestre: sem,section:section,slug: moduleSlug}, function (err, c) {
            Course.find({module: moduleSlug}, function (err, courses) {
                if (err)
                    console.log(err);
    
                res.render('admin/mod_courses', {
                    title: moduleSlug,
                    courses: courses
                });
            });
        });
    
    });*/

/*
 * GET course details
 */
router.get('/:module/:slug/:id', function (req, res) {

    var galleryImages = null;
    var id = req.params.id;
    Course.find({slug: req.params.slug}, function (err, course) {
        if (err) {
            console.log(err);
        } else {
            var galleryDir = 'public/course_image/' + id + '/gallery';

            fs.readdir(galleryDir, function (err, files) {
                if (err) {
                    console.log(err);
                } else {
                    galleryImages = files;

                    res.render('lescourspdf', {
                        title: course.title,
                        id:id,
                        galleryImages: galleryImages,
                        
                    });
                }
            });
        }
    });

});



// Exports
module.exports = router;