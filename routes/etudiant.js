const express=require('express')
const router=express.Router()
var event=require('../models/event');
var certif=require('../models/certifcat');
var press=require('../models/press');
var emploi=require('../models/emplois');
var Course = require('../models/course');
var Module = require('../models/module');

var fs = require('fs-extra');
var auth= require('../config/auth');
var isStudent = auth.ensureAuthenticated;
/*=====================================Affichage=========================================================*/
router.get('/',isStudent,(req,res)=>{
    res.render('/dashboard');
});
router.get('/apropos',(req,res)=>{
    res.render('pages/aboutus');
});

router.get('/pr',(req,res)=>{
    const dat = new Date();
    event.find({datem:{$gte:dat.setDate(dat.getDate() -5)}},(function(err,evn){
        press.find({datem:{$gte:dat.setDate(dat.getDate() -5)}},(function(err,per){
            emploi.find({datem:{$gte:dat.setDate(dat.getDate() -5)}},(function(err,emp){

        if(err) return console.log(err);
        res.render('pages/affichecertif',{
           evn:evn,
            per:per,
            emp:emp
        });       
    }));
    }));

    }));
});
router.get('/affichecertif',(req,res)=>{
    certif.find(function(err,cer){
        if(err) return console.log(err);
        res.render('pages/affichecertif',{
            cer:cer
        });
    });
});
router.get('/affichepresse',(req,res)=>{
    press.find(function(err,per){
        if(err) return console.log(err);
        res.render('pages/affichepresse',{
            per:per
        });
    });
});
router.get('/affichevent',(req,res)=>{
    event.find(function(err,ev){
        if(err) return console.log(err);
        res.render('pages/affichevent',{
            ev:ev
        });
    });
});
router.get('/affichevent/:nom',function(req,res){
    event.findOne({nom:req.params.nom},function(err,page){
      if(err){
          return console.log(err);}
        else{
          var gallerydir ='public/upload/'+ page._id +'/gallery';
          var galleryimage=null;
          fs.readdir(gallerydir, function(err,files){
            if(err){console.log(err);}
            else{
              galleryimage=files;
  
              res.render('pages/affichevent',{
                nom:page.nom,
                description:page.description,
                image:page.image,
                id:page._id,
                galleryimage:galleryimage
              });
            }
          })
        }
      
    });
  });

  router.get('/affichepresse',(req,res)=>{
    press.find(function(err,per){
        if(err) return console.log(err);
        res.render('pages/affichepresse',{
            per:per
        });
    });
});
router.get('/affichdocuemnt',(req,res)=>{
    emploi.find(function(err,emp){
        if(err) return console.log(err);
        res.render('pages/affichdocuement',{
            emp:emp
        });
    });
});
router.get('/affichesection',(req,res)=>{

        res.render('section');
           
    
    });
router.get('/:section/:sem', function (req, res) {
        var section=req.params.section;
        var sem = req.params.sem;
    
        Module.find({semestre: sem,section:section}, function (err, c) {
                if (err)
                    console.log(err);
    
                res.render('pages/modules', {
                    c:c
                });
            });
        });
router.get('/:section/:sem/:module', function (req, res) {
            var section=req.params.section;
            var sem = req.params.sem;
            var moduleSlug = req.params.module;
        
            Module.find({semestre: sem,section:section,slug: moduleSlug}, function (err, c) {
                Course.find({module: moduleSlug}, function (err, courses) {
                    if (err)
                        console.log(err);
        
                    res.render('pages/modules_cours', {
                        title: moduleSlug,
                        courses: courses,
                        section:section,
                        sem:sem
                    });
                });
            });
        
        });
router.get('/:section/:sem/:module/:slug/:id', function (req, res) {
    var section=req.params.section;
    var sem = req.params.sem;
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
        
                            res.render('pages/voircourspdf', {
                                title: course.title,
                                id:id,
                                galleryImages: galleryImages,
                                
                            });
                        }
                    });
                }
            });
        
        });
module.exports=router