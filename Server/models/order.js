/**
 * Created by Dudu on 25/03/2016.
 */

// grab the mongoose module
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var orderSchema = new Schema({



});

// define our meal model
// module.exports allows us to pass this to other files when it is called
module.exports = mongoose.model('Order', orderSchema );