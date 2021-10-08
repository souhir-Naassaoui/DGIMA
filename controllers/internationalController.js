const express = require('express');
var router = express.Router();

const mongoose = require('mongoose');
var Ecoles=require ('../models/ecoles');

router.get('/mobilite',(req,res)=>{
    Ecoles.find((err, docs)=>{
        if(!err){
            res.render("international/mobilité",{
                list: docs
            });
        }else{
            console.log('Error in retrieving schools list : '+err);
        }
    });
});

router.get('/mobiliteEtudiant',(req,res)=>{
    Ecoles.find((err, docs)=>{
        if(!err){
            res.render("international/mobilitéUser",{
                list: docs
            });
        }else{
            console.log('Error in retrieving schools list : '+err);
        }
    });
});

router.get('/',(req,res)=>{
    res.render('international/add');
});
router.get('/politique_international',(req,res)=>{
    res.render('international/politique');
});

router.post('/',(req,res)=>{

    if(req.body._id == '')
        insertRecord(req,res);
    else
        updateRecord(req,res);
});
function insertRecord(req,res){
    var ecoles = new Ecoles();
    ecoles.pays = req.body.pays;
    ecoles.institution = req.body.institution;
    ecoles.dateSignature = req.body.dateSignature;
    ecoles.dureeValidite = req.body.dureeValidite;
    ecoles.save((err,doc)=>{
        if(!err) {
            res.redirect('/infos/mobilite');
        }
        else {
            if(err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("international/edit",{
                    ecole: req.body
                });
            }
            else
                console.log('Error during record insertion : ' + err);
        }
    });
}

function updateRecord(req,res){
    Ecoles.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc)=>{
        if(!err) { res.redirect('/infos/mobilite'); }
        else {
            if(err.name == 'ValidationError'){
                handleValidationError(err,req.body);
                res.render("international/edit",{
                    ecole: req.body
                });
            }
            else
                console.log('Error during record update : '+err);
        }
    });
}


function handleValidationError(err,body){
    for(field in err.errors){
        switch(err.errors[field].path){
            case 'pays':
                body['paysError'] = err.errors[field].message;
                break;
            case 'institution':
                body['institutionError'] = err.errors[field].message;
                break;
            case 'dateSignature':
                body['dateSignatureError'] = err.errors[field].message;
                break;
            case 'dureeValidite':
                body['dureeValiditeError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}

router.get('/:id',(req,res)=>{
    Ecoles.findById(req.params.id, (err,doc)=>{
        if(!err){
            res.render("international/edit",{
                ecole: doc
            })
        }
    });
});

router.get('/delete/:id',(req,res)=>{
    Ecoles.findByIdAndRemove(req.params.id, (err,doc)=>{
        if(!err){
            res.redirect('/infos/mobilite');
        }else{
            console.log('Error in school delete :' + err);
        }
    });
});

module.exports = router;
