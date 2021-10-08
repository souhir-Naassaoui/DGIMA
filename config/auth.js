module.exports = {
  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('error_msg', 'Please log in to view that resource');
    res.redirect('/users/login');
  },
  forwardAuthenticated: function(req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect('/dashboard');      
  },
  isAdmin: function(req, res, next) {
    if (req.isAuthenticated() && res.locals.user.admin==1 || req.isAuthenticated() && res.locals.user.enseignant ==1 ) {
      return next();
      //res.redirect('/admin');
    }
    req.flash('error_msg', 'Please log into admin ');
    res.redirect('/users/login');
  },
};
