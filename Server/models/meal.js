/**
 * Created by Dudu on 25/03/2016.
 */

// grab the mongoose module
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var mealSchema = new Schema({
    name: String,
    description: String,
    type: String,
    price: Number,
    tags: [ String ],
    kosher: Boolean,
    glutenfree: Boolean,
    chefFBId: Number,
    chef: { type: Schema.Types.ObjectId, ref: 'Chef' },
    averageRating: Number
});

// define our meal model
// module.exports allows us to pass this to other files when it is called
module.exports = mongoose.model('Meal', mealSchema );

