/**
 * Created by Dudu on 31/05/2016.
 */
var Message = require('../models/message');

exports.postMessage = function (req, res) {
    var message = new Message();

    message.author = {};
    message.author.fbId = req.body.author.fbId;
    message.author.name = req.body.author.name;
    message.target = {};
    message.target.fbId = req.body.target.fbId;
    message.time = req.body.time;
    message.content = req.body.content;

    message.save(function (err) {
        if (!err) {
            res.json('message created!');
        }
        else {
            res.json('error occured');
        }
    });
};

exports.getMessagesReceived = function(req, res) {
    Message.find({"target.fbId": req.params.fbId}).sort({time: 'desc'}).limit(3).exec(function (err, messages){
        if (!err) {
            res.json(messages);
        }
        else {
            res.json('error occured');
        }
    });
};

exports.getMessages = function (req, res) {
    Message.find({ $or: [ { $and: [{'author.fbId': req.params.fbId1}, {'target.fbId': req.params.fbId2 }] }, { $and: [{'author.fbId': req.params.fbId2}, {'target.fbId': req.params.fbId1}] } ] }, function (err, messages)
    {
        res.json(messages)
    });
};