/**
 * Created by Michael on 4/5/2016.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var chefSchema = new Schema({
    workDays: [ { day: Number, isWorking: Boolean, startingTime: Date, finishTime: Date } ],
    fbId: Number,
    name: String,
    location: { type: { type: String }, coordinates: [] },
    locationName: String
});

module.exports = mongoose.model('Chef', chefSchema );