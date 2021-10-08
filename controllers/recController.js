require('dotenv').config();
const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
var Stage=require ('../models/recrutement');


router.get('/',(req,res)=>{
    res.render("recrutement/add");
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
    stage.publication=Date.now();
    stage.Description = req.body.Description;
    stage.Missions=req.body.Missions;
    stage.Competences=req.body.Competences;
    stage.save((err,doc)=>{
        if(!err) {
            res.redirect('recrutement/list');
        }
        else {
            if(err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("recrutement/editStage",{
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
        if(!err) { res.redirect('recrutement/list'); }
        else {
            if(err.name == 'ValidationError'){
                handleValidationError(err,req.body);
                res.render("recrutement/editStage",{
                    stage: req.body
                });
            }
            else
                console.log('Error during record update : '+err);
        }
    });
}


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
                res.render("recrutement/list",{
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
                res.render("recrutement/listEtudiant",{
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
                    res.render("recrutement/recherche",{
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
                    res.render("recrutement/rechercheEtudiant",{
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
            res.render("recrutement/editStage",{
                stage: doc
            })
        }
    });
});

router.get('/description/:id',(req,res)=>{
    Stage.findById(req.params.id, (err,doc)=>{
        if(!err){
            res.render("recrutement/descriptionStage",{
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




module.exports = router;
