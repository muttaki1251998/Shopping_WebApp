const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('./config/database');

//get route paths
const pageRouter = require('./routes/page');
const adminRouter = require('./routes/admin_page');

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

// bodyparser mw
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// set view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// set routes
app.use('/', pageRouter);
app.use('/admin', adminRouter);

// static folder
app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
	console.log("Server started at port 4000");
});