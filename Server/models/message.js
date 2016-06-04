/**
 * Created by Dudu on 31/05/2016.
 */
// grab the mongoose module
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var messageSchema = new Schema({
    author: {
        fbId: Number,
        name: String
    },
    target: {
        fbId: Number
    },
    time: Date,
    content: String
});

// define our meal model
// module.exports allows us to pass this to other files when it is called
module.exports = mongoose.model('Message', messageSchema );

