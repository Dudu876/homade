/**
 * Created by Dudu on 08/03/2016.
 */
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var path = require('path');
var mongoose = require('mongoose');
var routes = require('./routes');
var multer = require('multer');

var app = express();
var port = process.env.PORT || 5000;
var dbpath = process.env.DB || 'mongodb://localhost:27017/homade';
//var dbpath = process.env.DB || 'mongodb://homade:Aa123123@ds015929.mlab.com:15929/homade';
var server = app.listen(port);
console.log('Listening to port ' + port);

// connect to our mongoDB database
mongoose.connect(dbpath);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/',express.static(path.join(__dirname, '../Client')));

var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
    }
});

var upload = multer({ //multer settings
    storage: storage
}).single('file');

/** API path that will upload the files */
app.post('/upload', function(req, res) {
    upload(req,res,function(err){
        if(err){
            res.json({error_code:1,err_desc:err});
            return;
        }
        res.json({error_code:0,err_desc:null});
    })

});

routes(app);

