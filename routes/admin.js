var express=require('express')
var router=express.Router()
var multer= require('multer');
var fs =require('fs-extra');
var mkdirp =require('mkdirp');
var resizeImg =require('resize-img');
const controller = require("../controllers/file.controller");
var Page=require ('../models/event');
var Press=require ('../models/press');
var Emploi=require ('../models/emplois');
var Certif=require ('../models/certifcat');
var Chiffre=require ('../models/chiffres');
var Emploi=require ('../models/emplois');
const bcrypt = require('bcryptjs');
const passport = require('passport');
// Load User model
const User = require('../models/User');
//const userAdmin = require('../models/adminuser');

const { forwardAuthenticated } = require('../config/auth');
var auth= require('../config/auth');
var isadmin = auth.isAdmin;
/*=====================================Affichage=========================================================*/
router.get('/',isadmin,(req,res)=>{
    res.render('admin/admin');
});

router.get('/events',(req,res)=>{
    Page.find(function(err,even){
      if(err) return console.log(err);
      res.render('admin/admineven',{
          even:even
      });
  });
});
router.get('/affichepress',(req,res)=>{
  Press.find(function(err,press){
    if(err) return console.log(err);
    res.render('admin/adminpress',{
      press:press
    });

});
});
router.get('/affichecertif',(req,res)=>{
  Certif.find(function(err,certif){
    if(err) return console.log(err);
    res.render('admin/admincertif',{
        certif:certif
    });
});
});

router.get('/affichechiffres',(req,res)=>{
  Chiffre.find(function(err,chiffre){
    if(err) return console.log(err);
    res.render('admin/adminchiffres',{
      chiffre:chiffre
    });
});
});

router.get('/affichedocument',(req,res)=>{
  Emploi.find(function(err,emp){
    if(err) return console.log(err);
    res.render('admin/admindocument',{
      emp:emp
    });
});
});
router.get('/enseignants',(req,res)=>{
  User.find({enseignant :1},function(err,users){
    if(err) return console.log(err);
    res.render('admin/enseignants',{
      users:users
    });
});
});
router.get('/administrateurs',(req,res)=>{
  User.find({admin :1},function(err,users){
    if(err) return console.log(err);
    res.render('admin/administrateurs',{
      users:users
    });
});
});
router.get('/etudiants',(req,res)=>{
  User.find({enseignant :null,admin : null},function(err,users){
    if(err) return console.log(err);
    res.render('admin/etudiants',{
      users:users
    });
});
});
/*==============================AjoutGelleryImage=================================================================*/

router.post('/eventgallery/:id',function(req,res){
  var evImagee=req.files.file;
  var nom= req.params.nom;
  var id=req.params.id;
 // var id=req.body.id;

  var path = 'public/upload/'+ id +'/gallery/' + req.files.file.name;
 // var thumbPath='public/upload/' + nom + '/gallery/thumbs/' + req.files.file.name;
  evImagee.mv(path,function(err){
    if(err){ console.log(err);}
    resizeImg(fs.readFileSync(path), {width: 100}).then(function(buf){
      fs.writeFileSync(thumbPath,path);
    })
  });
  res.sendStatus(200);
});

/*============================deleteImageGalleryEvent========================================================================*/

router.get('/delete-image/:image/:nom',function(req,res){
  var path = 'public/upload/'+ req.query.id +'/gallery/' + req.params.image;
  var nom = req.params.nom;
  fs.remove(path,function(err){
    if(err){console.log(err);}
    res.redirect('/admin/evenedit/'+ nom);

  });
});

/*=============================EventEdit==================================================================*/
router.get('/evenedit/:nom',function(req,res){
  Page.findOne({nom:req.params.nom},function(err,page){
    if(err){
        return console.log(err);}
      else{
        var gallerydir ='public/upload/'+ page._id +'/gallery';
        var galleryimage=null;
        fs.readdir(gallerydir, function(err,files){
          if(err){console.log(err);}
          else{
            galleryimage=files;

            res.render('admin/adminevenedit',{
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
/*=========================EventEdit===========================================================================*/

router.post('/evenedit/:nom',function(req,res){
  var imageFile ;
  if(req.files){
    imageFile= req.files.image!== "undefined" ? req.files.image.name : "";
   }
   else{
      imageFile =""; }  
  req.checkBody('nom',"must have a value .").notEmpty();
    req.checkBody('description'," desmust have a value .").notEmpty();
    //req.checkBody('image','you must up image').isImage(imageFile);

    var nom=req.body.nom;
    var description=req.body.description;
    var id=req.body.id;
    var pimage=req.body.pimage;


    var errors=req.validationErrors();
  if(errors){
      console.log('erreurs');
      res.render('admin/adminevenedit',{
        errors:errors,
        nom:nom,
        description:description,
        id:id
    });

  }else{
      Page.findOne({nom: nom,_id:{'$ne':id}}, function(err,page){
        if(err){
          console.log('err');}
        if(page){
          req.flash('danger','nom exixste');
          res.render('admin/adminevenedit',{
            nom:nom,
            description:description,
            id:id
        });
        }else{
          Page.findById(id,function(err,page){
            if (err) return console.log(err);
            page.nom=nom;
            page.description=description;
            if(imageFile != ""){
              page.image=imageFile;

            }

            page.save(function(err){
              if(err){
                 return console.log(err);}
              if(imageFile != ""){
                if(pimage != ""){
                fs.remove('public/upload/'+ id +'/'+pimage,function(err){
                  if(err){return console.log(err);}
                
                });
              }
              var evimage= req.files.image;
              var path = 'public/upload/'+ id +'/' +imageFile;
              evimage.mv(path,function(err){
                return console.log(err);

              });
            
            }
              req.flash('success','event edited');
              console.log('success');

              res.redirect('/admin/events');
          });
        });
        }
      });
  }
    });
/*=============================Event=======================================================================*/

router.get('/addevent',(req,res)=>{
      var nom="";
      var description="";

     res.render('admin/add',{
      nom:nom,
      description:description,
     });
  });

router.post('/addevent',function(req,res){
  var imageFile ;
  if(req.files){
    imageFile= req.files.image!== "undefined" ? req.files.image.name : "";
   }
   else{
      imageFile =""; }

  req.checkBody('nom',"must have a value .").notEmpty();
  req.checkBody('description'," desmust have a value .").notEmpty();
  //req.checkBody('image','you must up image').isImage(imageFile);
  var nom=req.body.nom;
  var description=req.body.description;
  //let imageFile=req.files.image
  var errors=req.validationErrors();
if(errors){
    console.log('erreurs');
    res.render('admin/add',{
      errors:errors,
      nom:nom,
      description:description,
  });

}else{
   
    Page.findOne({nom: nom}, function(err,page){
      if(page){
        req.flash('danger','nom exixste');
        res.render('admin/add',{
          nom:nom,
          description:description,
      });
      }else{
        var page=new Page({
          nom:nom,
          description:description,
          image : imageFile
        });
        page.save(function(err){
           if(err){
              return console.log(err);}

            mkdirp('public/upload/'+ page._id, function(err){
              return console.log(err);
            });

            mkdirp('public/upload/'+ page._id+ '/gallery' ,function(err){
              return console.log(err);
            });

            /*mkdirp('public/upload/'+ nom+ '/gallery/thumbs' ,function(err){
              return console.log(err);
            });*/
           

            if(imageFile != ""){
              var evimage= req.files.image;
              var path = 'public/upload/'+ page._id +'/' +imageFile;
              evimage.mv(path,function(err){
                return console.log(err);

              });
            }
            
            req.flash('success','event added');
            //res.render('pages/add');
            console.log('success');

            res.redirect('/admin/events');
        });
      }
    });

}
});
/*=============================EventEdit==================================================================*/
/*router.get('/evenedit/:nom',function(req,res){
  Page.findOne({nom:req.params.nom},function(err,page){
    if(err){
        return console.log(err);}
      else{
        var gallerydir ='public/upload/'+ page._id +'/gallery';
        var galleryimage=null;
        fs.readdir(gallerydir, function(err,files){
          if(err){console.log(err);}
          else{
            galleryimage=files;

            res.render('admin/adminevenedit',{
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
});*/
/*=========================EventEdit===========================================================================*/

/*router.post('/evenedit/:nom',function(req,res){
  var imageFile ;
  if(req.files){
    imageFile= req.files.image!== "undefined" ? req.files.image.name : "";
   }
   else{
      imageFile =""; }  
  req.checkBody('nom',"must have a value .").notEmpty();
    req.checkBody('description'," desmust have a value .").notEmpty();
    //req.checkBody('image','you must up image').isImage(imageFile);

    var nom=req.body.nom;
    var description=req.body.description;
    var id=req.body.id;
    var pimage=req.body.pimage;


    var errors=req.validationErrors();
  if(errors){
      console.log('erreurs');
      res.render('admin/adminevenedit',{
        errors:errors,
        nom:nom,
        description:description,
        id:id
    });

  }else{
      Page.findOne({nom: nom,_id:{'$ne':id}}, function(err,page){
        if(err){
          console.log('err');}
        if(page){
          req.flash('danger','nom exixste');
          res.render('admin/adminevenedit',{
            nom:nom,
            description:description,
            id:id
        });
        }else{
          Page.findById(id,function(err,page){
            if (err) return console.log(err);
            page.nom=nom;
            page.description=description;
            if(imageFile != ""){
              page.image=imageFile;

            }

            page.save(function(err){
              if(err){
                 return console.log(err);}
              if(imageFile != ""){
                if(pimage != ""){
                fs.remove('public/upload/'+ id +'/'+pimage,function(err){
                  if(err){return console.log(err);}
                
                });
              }
              var evimage= req.files.image;
              var path = 'public/upload/'+ id +'/' +imageFile;
              evimage.mv(path,function(err){
                return console.log(err);

              });
            
            }
              req.flash('success','event edited');
              console.log('success');

              res.redirect('/admin/events');
          });
        });
        }
      });
  }
    });*/
/*================================DeleteEvent==============================================================*/
router.get('/evendelete/:id',function(req,res){
  var id = req.params.id;
  var path = 'public/upload/' + id;
  fs.remove(path, function (err) {
    if (err) {
        console.log(err);
    } else {
  Page.findByIdAndRemove(req.params.id,function(err){
    if(err){
      return console.log(err);}});
      req.flash('success','event deleted');
      console.log('success');

      res.redirect('/admin/events');
    }
  });
});
/*==============================Presse======================================================================*/
router.get('/presse',(req,res)=>{
  var titre="";
  var description="";
  var date="";


 res.render('admin/addpress',{
  titre:titre,
  description:description,
  date:date,

 });
});
router.post('/presse',function(req,res){
  var titre=req.body.titre;
  var description=req.body.description;
  var date=req.body.date;
Press.findOne({titre: titre}, function(err,press){
  if(press){
    req.flash('danger','nom exixste');
    res.render('admin/addpress',{
      titre:titre,
      description:description,
      date:date
  });
  }else{
    var press=new Press({
      titre:titre,
      description:description,
      date:date
    });
    press.save(function(err){
       if(err){
          return console.log(err);}
          console.log('success');

          res.redirect('/admin/affichepress');
      });
    }
       });
      });
/*=============================EventEdit==================================================================*/
router.get('/pressedit/:titre',function(req,res){
  Press.findOne({titre:req.params.titre},function(err,page){
          if(err){
              return console.log(err);}
            else{
                  res.render('admin/adminpressedit',{
                    titre:page.titre,
                    date:page.date,
                    description:page.description,
                    id:page._id,


                  });
                }
              });
            }); 
/*=============================PresseEdit==================================================================*/
 router.post('/pressedit/:titre',function(req,res){
req.checkBody('titre',"must have a value .").notEmpty();
req.checkBody('date'," desmust have a value .").notEmpty();  
req.checkBody('description'," desmust have a value .").notEmpty();        

var titre=req.body.titre;
 var description=req.body.description;
 var date=req.body.date;
 var id=req.body.id;

 var errors=req.validationErrors();
 if(errors){
     console.log('erreurs');
     res.render('admin/adminpressedit',{
       errors:errors,
       titre:page.titre,
       date:page.date,
       description:page.description,
       id:id
   });

 }else{
     Press.findOne({titre: titre,_id:{'$ne':id}}, function(err,page){
       if(err){
         console.log('err');}
       if(page){
         req.flash('danger','nom exixste');
         res.render('admin/adminpressedit',{
          titre:page.titre,
          date:page.date,
          description:page.description,
           id:id
       });
       }else{
         Press.findById(id,function(err,page){
           if (err) return console.log(err);
           page.titre=titre;
           page.description=description;

           page.date=date;
           
           page.save(function(err){
            if(err){
               return console.log(err);}
               req.flash('success','press edited');
               console.log('success');
 
               res.redirect('/admin/affichepress');
            });
          });
        }
      });
    }
    });
/*================================DeletePress==============================================================*/
router.get('/pressedelete/:id',function(req,res){
  Press.findByIdAndRemove(req.params.id,function(err){
    if(err){
      return console.log(err);}
      req.flash('success','event deleted');
      console.log('success');

      res.redirect('/admin/affichepress');

  })
});
/*=================================Certif===================================================================*/
router.get('/certif',(req,res)=>{
  var titre="";
  var description="";
 res.render('admin/addcertif',{
  titre:titre,
  description:description,

 });
});
router.post('/certif',function(req,res){
  var titre=req.body.titre;
  var description=req.body.description;
Press.findOne({titre: titre}, function(err,press){
  if(press){
    req.flash('danger','nom exixste');
    res.render('admin/addcertif',{
      titre:titre,
      description:description,
  });
  }else{
    var certif=new Certif({
      titre:titre,
      description:description,
       });
    certif.save(function(err){
       if(err){
          return console.log(err);}
          console.log('success');
          res.redirect('/admin/affichecertif');
      }); } }); });
/*=============================CertifEdit==================================================================*/
router.get('/certifedit/:titre',function(req,res){
  Certif.findOne({titre:req.params.titre},function(err,page){
          if(err){
              return console.log(err);}
            else{
                  res.render('admin/admincertifedit',{
                    titre:page.titre,
                    description:page.description,
                    id:page._id,
                  });
                }
              });  }); 
/*=============================CertifEdit==================================================================*/
 router.post('/certifedit/:titre',function(req,res){
req.checkBody('titre',"must have a value .").notEmpty();
req.checkBody('description'," desmust have a value .").notEmpty();        

var titre=req.body.titre;
 var description=req.body.description;
 var id=req.body.id;
 var errors=req.validationErrors();
 if(errors){
     console.log('erreurs');
     res.render('admin/admincertifedit',{
       errors:errors,
       titre:page.titre,
       description:page.description,
       id:id
   });

 }else{
     Certif.findOne({titre: titre,_id:{'$ne':id}}, function(err,page){
       if(err){
         console.log('err');}
       if(page){
         req.flash('danger','nom exixste');
         res.render('admin/admincertifedit',{
          titre:page.titre,
          description:page.description,
           id:id
       });
       }else{
         Certif.findById(id,function(err,page){
           if (err) return console.log(err);
           page.titre=titre;
           page.description=description;
           page.save(function(err){
            if(err){
               return console.log(err);}
               req.flash('success','press edited');
               console.log('success');
 
               res.redirect('/admin/affichecertif');
            });
          });
        }
      });
    }
    });
/*================================DeleteCertif==============================================================*/
router.get('/certifdelete/:id',function(req,res){
  Certif.findByIdAndRemove(req.params.id,function(err){
    if(err){
      return console.log(err);}
      req.flash('success','certif deleted');
      console.log('success');

      res.redirect('/admin/affichecertif');

  })
});
/*=================================Chiffres===================================================================*/
router.get('/chiffre',(req,res)=>{
  var titre="";
  var nombre="";
 res.render('admin/addchiffres',{
  titre:titre,
  nombre:nombre,

 });
});
router.post('/chiffre',function(req,res){
  var titre=req.body.titre;
  var nombre=req.body.nombre;
Chiffre.findOne({titre: titre}, function(err,chiffre){
  if(chiffre){
    req.flash('danger','nom exixste');
    res.render('admin/addchiffres',{
      titre:titre,
      nombre:nombre,
  });
  }else{
    var chiffre=new Chiffre({
      titre:titre,
      nombre:nombre,
       });
    chiffre.save(function(err){
       if(err){
          return console.log(err);}
          console.log('success');
          res.redirect('/admin/affichechiffres');
      }); } }); });
/*=============================CertifEdit==================================================================*/
router.get('/chiffresedit/:titre',function(req,res){
  Chiffre.findOne({titre:req.params.titre},function(err,page){
          if(err){
              return console.log(err);}
            else{
                  res.render('admin/adminchiffresedit',{
                    titre:page.titre,
                    nombre:page.nombre,
                    id:page._id,
                  });
                }
              });  }); 
/*=============================CertifEdit==================================================================*/
router.post('/chiffresedit/:titre',function(req,res){
req.checkBody('titre',"must have a value .").notEmpty();
req.checkBody('nombre'," desmust have a value .").notEmpty();        

var titre=req.body.titre;
 var nombre=req.body.nombre;
 var id=req.body.id;
 var errors=req.validationErrors();
 if(errors){
     console.log('erreurs');
     res.render('admin/adminchiffresedit',{
       errors:errors,
       titre:page.titre,
       nombre:page.nombre,
       id:id
   });

 }else{
     Chiffre.findOne({titre: titre,_id:{'$ne':id}}, function(err,page){
       if(err){
         console.log('err');}
       if(page){
         req.flash('danger','nom exixste');
         res.render('admin/admincertifedit',{
          titre:page.titre,
          nombre:page.nombre,
           id:id
       });
       }else{
         Chiffre.findById(id,function(err,page){
           if (err) return console.log(err);
           page.titre=titre;
           page.nombre=nombre;
           page.save(function(err){
            if(err){
               return console.log(err);}
               req.flash('success','chiffres edited');
               console.log('success');
 
               res.redirect('/admin/affichechiffres');
            });
          });
        }
      });
    }
    });
/*================================DeleteCertif==============================================================*/
router.get('/chiffresdelete/:id',function(req,res){
  Chiffre.findByIdAndRemove(req.params.id,function(err){
    if(err){
      return console.log(err);}
      req.flash('success','chiffres deleted');
      console.log('success');

      res.redirect('/admin/affichechiffres');

  })
});
/*================================Emplois==============================================================*/

  router.get('/document',(req,res)=>{
    var nom="";
  res.render('admin/addDocument',{
    nom:nom,
  });
});

  router.post("/document", (req,res)=>{
      var Filee ;
      var nom=req.body.nom;

      if(req.files){
        Filee= req.files.image!== "undefined" ? req.files.image.name : "";
       }
       else{
          Filee =""; }
          var emploi=new Emploi({
            image : Filee,
            nom:nom
          });
          emploi.save(function(err){
             if(err){ return console.log(err);}
                mkdirp('public/emploi/', function(err){
                return console.log(err);
              });              
              if(Filee != ""){
                var evimage= req.files.image;
                var path = 'public/emploi/' +Filee;
                evimage.mv(path,function(err){
                  return console.log(err);
                });}
              console.log('success');
                res.redirect('/admin/affichedocument');
          });
 });

 /*router.get("/files", controller.getListFiles);
 router.get("/files/:name", controller.download);*/
   /*================================DeleteEmploi==============================================================*/
router.get('/emploisdelete/:id',function(req,res){
  Emploi.findByIdAndRemove(req.params.id,function(err){
    if(err){
      return console.log(err);}
      req.flash('success','event deleted');
      console.log('success');

      res.redirect('/admin/affichedocument');

  })
});   

/*===================================*/
router.get('/register', (req, res) => res.render('register'));

// Register
router.post('/register', (req, res) => {
  const { name, email, password, password2, admin , enseignant } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2,
      admin,
      enseignant
    });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2,
          admin,
          enseignant
        });
      } else {
        const newUser = new User({
          name,
          email,
          password,
          admin,
          enseignant
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'Succefully registered '
                );
                if(newUser.admin==1){
                res.redirect('/admin/administrateurs');}
               if(newUser.enseignant==1){
                  res.redirect('/admin/enseignants');}
                if(newUser.admin==null && newUser.enseignant==null ){
                    res.redirect('/admin/etudiants');}
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

router.get('/useredit/:email',function(req,res){
  User.findOne({email:req.params.email},function(err,page){
          if(err){
              return console.log(err);}
            else{
                  res.render('admin/useredit',{
                    name:page.name,
                    email:page.email,
                    admin:page.admin,
                    enseignant:page.enseignant,
                    id:page._id,
                  });
                }
              });  }); 
router.post('/useredit/:email',function(req,res){
  req.checkBody('name',"must have a value .").notEmpty();
  req.checkBody('email'," desmust have a value .").notEmpty();        
  const { name, email, admin , enseignant } = req.body;

  /*var name=req.body.name;
   var email=req.body.email;*/
   var id=req.body.id;
   var errors=req.validationErrors();
   if(errors){
       console.log('erreurs');
       res.render('admin/useredit',{
         errors:errors,
         name:page.name,
         email:page.email,
         admin:page.admin,
        enseignant:page.enseignant,
         id:id
     });
  
   }else{
       User.findOne({email: email,_id:{'$ne':id}}, function(err,page){
         if(err){
           console.log('err');}
         if(page){
           req.flash('danger','email exixste');
           res.render('admin/useredit',{
            name:page.name,
            email:page.email,
            admin:page.admin,
            enseignant:page.enseignant,
             id:id
         });
         }else{
           User.findById(id,function(err,page){
             if (err) return console.log(err);
             page.name=name;
             page.email=email;
             page.admin=admin;
             page.enseignant;
             page.save(function(err){
              if(err){
                 return console.log(err);}
                 req.flash('success','users edited');
                 console.log('success');
               if(page.admin == 1){
                  res.redirect('/admin/administrateurs');}
                  if(page.enseignant == 1){
                    res.redirect('/admin/enseignants');}
                    if(page.admin == null && page.enseignant == null ){
                      res.redirect('/admin/etudiants');}
                // res.redirect('/admin/users');
              });
            });
          }
        });
      }
      }); 
      
router.get('/userdelete/:id',function(req,res){
        User.findByIdAndRemove(req.params.id,function(err){
          if(err){
            return console.log(err);}
            req.flash('success','User deleted');
            console.log('success');
      
            res.redirect('/admin/users');
      
        })
      });
module.exports=router