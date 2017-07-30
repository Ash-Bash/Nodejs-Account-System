// Dependences
var express = require('express');
var path = require('path');
var Promise = global.Promise || require('promise');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var hbs = require('handlebars');
var expressVaildator = require('express-validator');
var device = require('express-device');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');

// Config Javascript File
var config = require('./config/config');

// Connect & Intializing mongoDB Database
mongoose.connect(config.database_url);
var db = mongoose.connection;

// MongoDB DB models
var User = require('./models/users');
var UserRole = require('./models/userroles');

// Express Routes
var routes_route = require('./routes/index');
var users_route = require('./routes/users');
var admin_route = require('./routes/admin');

// Init App
var app = express();

// View Engine
app.set('views', path.join(__dirname, 'views'));
hbs.registerHelper('equal', require('handlebars-helper-equal'));
exphbs.create({
    helpers: {
        equal: function(lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if( lvalue!=rvalue ) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        },
        copyrightYear: function() {
            return new Date().getFullYear();
        }
    }
});
app.engine('handlebars', exphbs({defaultLayout: 'layout', partialsPath: 'partials'}));
app.set('view engine', 'handlebars');

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(device.capture());

// Set Static Folder aka Public Dir
app.use(express.static(path.join(__dirname, 'public')));

// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
})); 

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Vaildator
app.use(expressVaildator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
        , root = namespace.shift()
        , formParam = root;

        while(namespace.length) {
            formParam == '[' + namespace.shift() + ']';
        }

        return {
            param : formParam,
            msg: msg,
            value: value
        };
    }
}));

// Connect Flash
app.use(flash());

// Global Vars
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    res.locals.userrole = req.userrole || null;
});

// Allocating Routes
app.use('/', routes_route);
app.use('/users', users_route);
app.use('/admin', admin_route);

// Set Port
app.set('port', (process.env.PORT || 3001));
app.listen(app.get('port'), function() {
    console.log('Account System Site Server has started on port: ' + app.get('port'));
});


