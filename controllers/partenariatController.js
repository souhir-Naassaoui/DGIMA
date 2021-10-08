const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
var Partner=require ('../models/partenariat');

require('dotenv').config();



router.get('/',(req,res)=>{
    res.render("partenariat/add");
});


router.post('/',(req,res)=>{

    if(req.body._id == '')
        insertRecord(req,res);
    else
        updateRecord(req,res);
});
function insertRecord(req,res){
    var partner = new Partner();
    partner.nomPartenaire = req.body.nom;
    partner.typeAaccord = req.body.type;
    partner.objetAccord = req.body.objet;
    partner.dateSignature = req.body.date;
    partner.dureAccord = req.body.duree;
    partner.save((err,doc)=>{
        if(!err) {
            res.redirect('/partners/partenaires');
        }
        else {
            if(err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("partenariat/editPartenariat",{
                    partenaire: req.body
                });
            }
            else
                console.log('Error during record insertion : ' + err);
        }
    });
}

function updateRecord(req,res){
    Partner.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc)=>{
        if(!err) { res.redirect('/partners/partenaires'); }
        else {
            if(err.name == 'ValidationError'){
                handleValidationError(err,req.body);
                res.render("partenariat/editPartenariat",{
                    partenaire: req.body
                });
            }
            else
                console.log('Error during record update : '+err);
        }
    });
}


router.get('/partenaires',(req,res)=>{
    Partner.find((err, docs)=>{
        if(!err){
            res.render("partenariat/partenaires",{
                list: docs
            });
        }else{
            console.log('Error in retrieving partners list : '+err);
        }
    });
});

router.get('/partenaires2',(req,res)=>{
    Partner.find((err, docs)=>{
        if(!err){
            res.render("partenariat/partenairesEtudiant",{
                list: docs
            });
        }else{
            console.log('Error in retrieving partners list : '+err);
        }
    });
});



function handleValidationError(err,body){
    for(field in err.errors){
        switch(err.errors[field].path){
            case 'nomPartenaire':
                body['nomPartenaireError'] = err.errors[field].message;
                break;
            case 'typeAaccord':
                body['typeAaccordError'] = err.errors[field].message;
                break;
            case 'objetAccord':
                body['objetAccordError'] = err.errors[field].message;
                break;
            case 'dateSignature':
                body['dateSignatureError'] = err.errors[field].message;
                break;
            case 'dureAccord':
                body['dateSignatureError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}
router.get('/:id',(req,res)=>{
    Partner.findById(req.params.id, (err,doc)=>{
        if(!err){
            res.render("partenariat/editPartenariat",{
                partenaire: doc
            })
        }
    });
});



router.get('/delete/:id',(req,res)=>{
    Partner.findByIdAndRemove(req.params.id, (err,doc)=>{
        if(!err){
            res.redirect('/partners/partenaires');
        }else{
            console.log('Error in partner delete :' + err);
        }
    });
});


module.exports = router;
