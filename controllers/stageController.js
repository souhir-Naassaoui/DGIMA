require('dotenv').config();
const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
//const Stage = mongoose.model('Stage');
var Stage=require ('../models/stage');
var nodemailer = require('nodemailer');
const fs = require('fs');
const multer = require('multer');
var to;
var subject;
var body;
var path

router.get('/',(req,res)=>{
    res.render("stage/add");
});


router.post('/',(req,res)=>{

    if(req.body._id == '')
        insertRecord(req,res);
    else
       updateRecord(req,res);
});
function insertRecord(req,res){
    var stage = new Stage();
    stage.entreprise = req.body.entreprise;
    stage.responsable = req.body.responsable;
    stage.adresse = req.body.adresse;
    stage.telephones = req.body.telephones;
    stage.email = req.body.email;
    stage.titreOffre = req.body.titreOffre;
    stage.nombrePostes = req.body.nombrePostes;
    stage.type = req.body.type;
    stage.publication=Date.now();
    stage.Description = req.body.Description;
    stage.Missions=req.body.Missions;
    stage.Competences=req.body.Competences;
    stage.save((err,doc)=>{
        if(!err) {
            res.redirect('stage/list');
        }
        else {
            if(err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("stage/editStage",{
                    stage: req.body
                });
            }
            else
                console.log('Error during record insertion : ' + err);
        }
    });
}

function updateRecord(req,res){
    Stage.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc)=>{
        if(!err) { res.redirect('stage/list'); }
        else {
            if(err.name == 'ValidationError'){
                handleValidationError(err,req.body);
                res.render("stage/editStage",{
                    stage: req.body
                });
            }
            else
                console.log('Error during record update : '+err);
        }
    });
}

/*
router.get('/liste',(req,res)=>{
    Stage.find((err, docs)=>{
        if(!err){
            res.render("stage/list",{
                list: docs
            });
        }else{
            console.log('Error in retrieving stage list : '+err);
        }
    });
});
 */



router.get('/list',(req,res)=>{
    try {
        var query= {} ;
        var page=1;
        var perpage=4;
        if(req.query.page!=null){
            page= req.query.page
        }
        query.skip=(perpage * page)-perpage;
        query.limit=perpage;
        // let keyword = req.query.kw || '';

        Stage.find({},{},query,(err,data)=>{
            if(err){
                console.log(err);
            }
            Stage.count((err,count)=>{
                if(err){
                    console.log(err)
                }
                res.render("stage/list",{
                    //kw:keyword,
                    list:data,
                    current:page,
                    pages:Math.ceil(count/perpage)
                });
            });
        });
    } catch (error) {
        console.log(error);
    }
});


router.get('/listEtudiant',(req,res)=>{
    try {
        var query= {} ;
        var page=1;
        var perpage=4;
        if(req.query.page!=null){
            page= req.query.page
        }
        query.skip=(perpage * page)-perpage;
        query.limit=perpage;
        // let keyword = req.query.kw || '';

        Stage.find({},{},query,(err,data)=>{
            if(err){
                console.log(err);
            }
            Stage.count((err,count)=>{
                if(err){
                    console.log(err)
                }
                res.render("stage/listEtudiant",{
                    //kw:keyword,
                    list:data,
                    current:page,
                    pages:Math.ceil(count/perpage)
                });
            });
        });
    } catch (error) {
        console.log(error);
    }
});

router.get('/search',(req,res)=>{
    try {
        var query= {} ;
        var page=1;
        var perpage=4;
        if(req.query.page!=null){
            page= req.query.page
        }
        query.skip=(perpage * page)-perpage;
        query.limit=perpage;
        let keyword = req.query.kw;
        if (keyword == ''){
            res.redirect('list');
        }else {
            Stage.find({ titreOffre: { $regex: ".*(?i)" + keyword + ".*" } },{},query,(err,data)=>{
                if(err){
                    console.log(err);
                }
                Stage.count((err,count)=>{
                    if(err){
                        console.log(err)
                    }
                    res.render("stage/recherche",{
                        kw:keyword,
                        list:data,
                        current:page,
                        pages:Math.ceil(count/perpage)
                    });
                });
            });
        }


    } catch (error) {
        console.log(error);
    }
});

router.get('/searchEtudiant',(req,res)=>{
    try {
        var query= {} ;
        var page=1;
        var perpage=4;
        if(req.query.page!=null){
            page= req.query.page
        }
        query.skip=(perpage * page)-perpage;
        query.limit=perpage;
        let keyword = req.query.kw;
        if (keyword == ''){
            res.redirect('listEtudiant');
        }else {
            Stage.find({ titreOffre: { $regex: ".*(?i)" + keyword + ".*" } },{},query,(err,data)=>{
                if(err){
                    console.log(err);
                }
                Stage.count((err,count)=>{
                    if(err){
                        console.log(err)
                    }
                    res.render("stage/rechercheEtudiant",{
                        kw:keyword,
                        list:data,
                        current:page,
                        pages:Math.ceil(count/perpage)
                    });
                });
            });
        }


    } catch (error) {
        console.log(error);
    }
});

function handleValidationError(err,body){
    for(field in err.errors){
        switch(err.errors[field].path){
            case 'entreprise':
                body['entrepriseError'] = err.errors[field].message;
                break;
            case 'email':
                body['emailError'] = err.errors[field].message;
                break;
            case 'responsable':
                body['responsableError'] = err.errors[field].message;
                break;
            case 'adresse':
                body['adresseError'] = err.errors[field].message;
                break;
            case 'telephones':
                body['telephonesError'] = err.errors[field].message;
                break;
            case 'type':
                body['typeError'] = err.errors[field].message;
                break;
            case 'Description':
                body['descriptionError'] = err.errors[field].message;
                break;
            case 'titreOffre':
                body['titreOffreError'] = err.errors[field].message;
                break;

            case 'nombrePostes':
                body['nombrePostesError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}

router.get('/:id',(req,res)=>{
    Stage.findById(req.params.id, (err,doc)=>{
        if(!err){
            res.render("stage/editStage",{
                stage: doc
            })
        }
    });
});

router.get('/description/:id',(req,res)=>{
    Stage.findById(req.params.id, (err,doc)=>{
        if(!err){
            res.render("stage/descriptionStage",{
                viewTitle: "Offre de stage",
                stage: doc
            })
        }
    });
});


router.get('/delete/:id',(req,res)=>{
    Stage.findByIdAndRemove(req.params.id, (err,doc)=>{
        if(!err){
            res.redirect('/stage/list');
        }else{
            console.log('Error in stage delete :' + err);
        }
    });
});


var Storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, "./images");
    },
    filename: function(req, file, callback) {
        callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    }
});

var upload = multer({
    storage: Storage
}).single("image"); //Field name and max count

router.post('/sendemail',(req,res) => {
    upload(req,res,function(err){
        if(err){
            console.log(err)
            return res.end("Something went wrong!");
        }else{
            from=req.body.from
            pass=req.body.pass
            to = req.body.to
            subject = req.body.subject
            body = req.body.body
            path = req.file.path
            console.log(to)
            console.log(subject)
            console.log(body)
            console.log(req.file)
            console.log(req.files)
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user:from,
                    pass: pass
                }
            });

            var mailOptions = {
                from: 'souhir.naassaoui@enis.tn',
                to: to,
                subject:subject,
                text:body,
                attachments: [
                    {
                        path: path
                    }
                ]
            };

            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                    fs.unlink(path,function(err){
                        if(err){
                            return res.end(err)
                        }else{
                            console.log("deleted")
                            return res.redirect('/stage/listEtudiant');
                        }
                    })
                }
            });
        }
    })
})


module.exports = router;
