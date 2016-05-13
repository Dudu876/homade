/**
 * Created by Michael on 5/2/2016.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var cityAreaSchema = new Schema({
    cityname: String,
    area: { type: {type: String}, coordinates: []},
    popularTags: [{tag: String, count: Number}]
});

// define the index
cityAreaSchema.index({area: '2dsphere'});

module.exports = mongoose.model('CityArea', cityAreaSchema );