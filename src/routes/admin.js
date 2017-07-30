// Dependences
var express = require('express');
var router = express.Router();

// Register
router.get('/users', function(req, res) {
    res.render('users');
});

// Misc Functions
// Ensure Authentication
function ensureAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    } else {
        req.flash('error_msg', 'You are not logged in');
        res.redirect('/users/login');
    }
}

// Ensure Admin Authentication
function ensureAdminAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    } else {
        req.flash('error_msg', 'You are not logged in');
        res.redirect('/users/login');
    }
}

module.exports = router;