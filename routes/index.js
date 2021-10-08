const express=require('express')
const router=express.Router()
var event=require('../models/event');
var press=require('../models/press');
var certif=require('../models/certifcat');
var chiffres=require('../models/chiffres');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

var emploi=require('../models/emplois');

// Welcome Page
router.get('/welcome', forwardAuthenticated, (req, res) => res.render('welcome'));

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>
  res.render('dashboard', {
    user: req.user
  })
);
router.get('/',(req,res)=>{
    const dat = new Date();
    event.find(function(err,evp){
        if(err) return console.log(err);
        press.find(function(err,pr){
            if(err) return console.log(err);
            certif.find(function(err,cer){
                if(err) return console.log(err);
                chiffres.find(function(err,chiffre){
                    if(err) return console.log(err);
                    event.find({datem:{$gte:dat.setDate(dat.getDate() -5)}},(function(err,evn){
                        press.find({datem:{$gte:dat.setDate(dat.getDate() -5)}},(function(err,per){
                            emploi.find({datem:{$gte:dat.setDate(dat.getDate() -5)}},(function(err,emp){
            res.render('pages/index',{
                pr:pr,
                evp:evp,
                cer:cer,
                chiffre:chiffre,
                evn:evn,
            per:per,
            emp:emp
        });       
    }));
    }));

    }));
        
        });
        });
        });
    });
    

    //res.render('pages/index');
})


module.exports=router
