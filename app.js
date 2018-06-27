const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');
const config = require('./config/database');
const fileUpload = require('express-fileupload');

//get route paths
const pageRouter = require('./routes/page');
const adminPage = require('./routes/admin_page');
const adminCategory = require('./routes/admin_category');
const adminProduct = require('./routes/admin_product');;

// database connection
mongoose.connect(config.database);

// test connection
mongoose.connection.on('connected', () => {
	console.log("Connected to shop database");
});
mongoose.connection.on('err', (err) => {
	console.log("Failed to connect to database");
});

// app init
const app = express();
const port = process.env.PORT || 4000;

// fileUpload mw
app.use(fileUpload());

// bodyparser mw
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// session mw
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// passport mw
app.use(passport.initialize());
app.use(passport.session());

// express validator mw
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
            , root    = namespace.shift()
            , formParam = root;

        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param : formParam,
            msg   : msg,
            value : value
        };
    },
    customValidators:{
        isImage: function(value, filename){
            var extension = (path.extname(filename)).toLowerCase();
            switch(extension){
                case '.jpg':
                    return '.jpg';
                case '.png':
                    return '.png';
                case '.jpeg':
                    return '.jpeg';
                case '':
                    return '.jpg';
                default:
                    return false;
            }
        }
    }
}));

// connect-flash
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//express-messages middleware
app.use(function(req, res, next){
    res.locals.messages = require('express-messages')(req, res);
    next();
});

// set view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// static folder
app.use(express.static(path.join(__dirname, 'public')));

// set routes
app.use('/', pageRouter);
app.use('/admin', adminPage);
app.use('/admin/category', adminCategory);
app.use('/admin/product', adminProduct);

// set errors variable
 app.locals.errors = null;
 
app.use(function(err, req, res, next){
    res.locals.message = err.message;
});

app.listen(port, () => {
	console.log("Server started at port 4000");
});