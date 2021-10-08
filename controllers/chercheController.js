const express = require('express');
var router = express.Router();

router.get('/master',(req,res)=>{
   res.render('recherche/master');
});

router.get('/laboratoires',(req,res)=>{
    res.render('recherche/laboratoires');
});

router.get('/ecoleDoctorale',(req,res)=>{
    res.render('recherche/doctorat');
});
module.exports = router;
