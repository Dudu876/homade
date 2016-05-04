/**
 * Created by Michael on 5/2/2016.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var citySchema = new Schema({
    name: String,
    northeast: [Number],
    southwest: [Number]
});

module.exports = mongoose.model('City', citySchema );