/**
 * Created by Michael on 5/2/2016.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var cityAreaSchema = new Schema({
    city: { type: Schema.Types.ObjectId, ref: 'Chef' },
    polygon: { type: { type: String }, coordinates: [] },
    popularTags: [String]
});

module.exports = mongoose.model('CityArea', cityAreaSchema );