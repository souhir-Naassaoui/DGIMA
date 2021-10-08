var express = require('express');
var router = express.Router();


// Get Module model
var Module = require('../models/module');
// get module index


    router.get('/', function (req, res) {
        Module.find(function (err, modules) {
            if (err)
                return console.log(err);
            res.render('admin/modules', {
                modules: modules
            });
        });  
});



// get add modules


router.get('/add-module', function(req, res) {
    
    var title = "";
    var section="";
    var semestre="";
    
    res.render('admin/add_module',{
       title : title,
       section:section,
       semestre:semestre
       
    });
    
});



/*
 * POST add module
 */
router.post('/add-module', function (req, res) {

    req.checkBody('title', 'Title must have a value.').notEmpty();
    

    var title = req.body.title;
    var slug = title.replace(/\s+/g, '-').toLowerCase();
    var section = req.body.section;
    var semestre = req.body.semestre;


    var errors = req.validationErrors();

    if (errors) {
        res.render('admin/add_module', {
            errors: errors,
            title: title,
            section:section,
            semestre:semestre
           
            
        });
    } else {
        Module.findOne({slug: slug}, function (err, module) {
            if (module) {
                req.flash('danger', 'Module title exists, choose another.');
                res.render('admin/add_module', {
                    title: title,
                    section:section,
                    semestre:semestre
                    
                });
            } else {
                var module = new Module({
                    title: title,
                    slug: slug,
                    section:section,
                    semestre:semestre

                    
                });

                module.save(function (err) {
                    if (err)
                        return console.log(err);


                    req.flash('success', 'Module added!');
                    res.redirect('/admin/modules');
                });
            }
        });
    }

});

 // post pages index

/* router.post('/reorder-pages', function (req, res) {
    var ids = req.body['id[]'];

    sortPages(ids, function () {
        Page.find({}).sort({sorting: 1}).exec(function (err, pages) {
            if (err) {
                console.log(err);
            } else {
                req.app.locals.pages = pages;
            }
        });
    });

});  */
// get edit module


router.get('/edit-module/:title', function(req, res) {
    
    Module.findOne({title: req.params.title}, function(err, page) {
        if (err){
            return console.log(err); }
        else{
        res.render('admin/edit_module', {
            title: page.title,
            section: page.section,
            semestre: page.semestre,

            id: page._id,
        });
    }
    });

});

/*
 * POST edit module
 */
router.post('/edit-module/:title', function (req, res) {

    req.checkBody('title', 'Title must have a value.').notEmpty();
    

    var title = req.body.title;
    var slug = title.replace(/\s+/g, '-').toLowerCase();
    var section = req.body.section;
    var semestre = req.body.semestre;

    var id = req.body.id;

    var errors = req.validationErrors();

    if (errors) {
        res.render('admin/edit_module', {
            errors: errors,
            title: title,
            section:section,
            semestre:semestre,
            
            id: id
        });
    } else {
        Module.findOne({slug: slug, _id: {'$ne': id}}, function (err, page) {
            if (page) {
                req.flash('danger', 'module title exists , choose another.');
                res.render('admin/edit_module', {
                    title: title,
                    section:section,
                    semestre:semestre,
                    id: id
                });
            } else {

                Module.findById(id, function (err, module) {
                    if (err)
                        return console.log(err);

                    module.title = title;
                    module.slug = slug;
                    module.section=section;
                    module.semestre=semestre;

                    module.save(function (err) {
                        if (err)
                            return console.log(err);

                           

                        req.flash('success', 'Module edited!');
                        res.redirect('/admin/modules');

                       // res.redirect('/admin/pages/edit-module/' + id);
                    });

                });


            }
        });
    }

});
/*
 * GET delete category
 */
router.get('/delete-module/:id', function (req, res) {
    Module.findByIdAndRemove(req.params.id, function (err) {
        if (err)
            return console.log(err);

        Module.find(function (err, modules) {
            if (err) {
                console.log(err);}
           
        });

        req.flash('success', 'module deleted!');
        res.redirect('/admin/modules');
    });
});



//exports
module.exports = router;
