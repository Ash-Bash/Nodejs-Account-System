// Dependences
var express = require('express');
var router = express.Router();
var fs = require("fs");
var path = require('path');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var exphbs = require('express-handlebars');
var hbs = require('hbs');

// MongoDB Models
var User = require('../models/users');
var UserRole = require('../models/userroles');

//Get Functions
// Register
router.get('/register', function(req, res) {
    res.render('register');
});

// Login
router.get('/login', function(req, res) {
    res.render('login');
});

// Logout
router.get('/logout', function(req, res) {
    req.logOut();

    req.flash('success_msg', 'You are now logged out');

    res.redirect('/');
});

// Account Settings
router.get('/accountsettings', ensureAuthenticated, function(req, res) {
    res.render('accountsettings');
});

// Dashboard
router.get('/dashboard/:view', ensureAuthenticated, function(req, res) {
    
    res.locals.dashboardview = req.params.view;

});

//Post Functions
// Register User
router.post('/register', function(req, res) {
    var firstname = req.body.first_name;
    var surname = req.body.surname;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;

    //Validation
    req.checkBody('first_name', 'First Name is required').notEmpty();
    req.checkBody('surname', 'Surname is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('username', 'Username is required').notEmpty();
    //req.checkBody('username', 'Username already exists').equals();
    req.checkBody('password', 'Passwords is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

    // Vaildation Errors
    var errors = req.validationErrors();

    if(errors) {
        res.render('register', {
            errors: errors
        });
    } else {
        var newUser = new User({
            firstname: firstname,
            surname: surname,
            email: email,
            username: username,
            password: password
        });
        User.createUser(newUser, function(err, user){
            //if(error) throw err;
            //console.log(user);
            User.getUserByUsername(username, function(err, userObj) {
                if(err) throw err;
                if (err) { return done(err); }

                var newUserRole = new UserRole({
                    userid: userObj._id,
                    role: 'User'
                });

                UserRole.createUserRole(newUserRole, function(err, role) {
    
                });
            });
        });

        req.flash('success_msg', 'You are registered and can now login');

        res.redirect('/users/login');
    }

});

// Login Post's Local Strategy
passport.use(new LocalStrategy(
    function(username, password, done) {

        User.getUserByUsername(username, function(err, user) {
            if(err) throw err;
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'Unknown Username' });
            }
            
            User.comparePassword(password, user.password, function(err, isMatch){
                if (err) { return done(err); }
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Incorrect Password' });
                }
            });
        });
    }
));

// Login Post's Passport Serializer & Deserializer
// Serialize
passport.serializeUser(function(user, done){
    done(null, user.id);
});

// Deserialize
passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user){
        UserRole.getUserRoleByUserId(id, function(err, role){
            user.role = role.role;
            done(err, user);
        });
    });
});

// Login
router.post('/login', passport.authenticate('local', {successRedirect: '/users/dashboard/overview', failureRedirect:'/users/login', failureFlash: true}), function(req, res) {
    res.redirect('/users/dashboard/overview');
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