/**
 * Created by Dudu on 08/03/2016.
 */
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var path = require('path');
var routes = require('./routes');

var app = express();
var port = process.env.PORT || 5000;
var dbpath = process.env.DB || 'mongodb://localhost:27017/homade';
var server = app.listen(port);
console.log('Listening to port ' + port);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/',express.static(path.join(__dirname, '../Client')));
routes(app);
