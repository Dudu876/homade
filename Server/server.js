/**
 * Created by Dudu on 08/03/2016.
 */
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var path = require('path');
var mongoose = require('mongoose');
var routes = require('./routes');
var uploader = require('./controllers/uploadCtrl');
var multer = require('multer');

var app = express();
var port = process.env.PORT || 5000;
//var dbpath = process.env.DB || 'mongodb://localhost:27017/homade';
var dbpath = process.env.DB || 'mongodb://homade:Aa123123@ds015929.mlab.com:15929/homade';
var server = app.listen(port);
console.log('Listening to port ' + port);

// connect to our mongoDB database
mongoose.connect(dbpath);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

var imageDir = '../Client/meal_uploads';

app.use('/',express.static(path.join(__dirname, '../Client')));

uploader.init(imageDir);
routes(app);