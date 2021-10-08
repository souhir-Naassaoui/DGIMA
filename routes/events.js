const express=require('express')
const router=express.Router()

var fs =require('fs-extra');

var event=require('../models/event');
router.get('/',(req,res)=>{
    event.find(function(err,ev){
        if(err) return console.log(err);
        res.render('pages/evn',{
            ev:ev
        });
    });
});
router.get('/af',(req,res)=>{
    event.find(function(err,ev){
        if(err) return console.log(err);
        res.render('pages/affichevent',{
            ev:ev
        });
    });
});
router.get('/affiche/:nom',function(req,res){
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


module.exports=router