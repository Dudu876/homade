/**
 * Created by Dudu on 25/03/2016.
 */

// grab the mongoose module
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var orderSchema = new Schema({
    clientFBId: Number,
    chefFBId: Number,
    mealID: String,
    meal: { type: Schema.Types.ObjectId, ref: 'Meal' },
    chef: { type: Schema.Types.ObjectId, ref: 'Chef' },
    rating: Number,
    comment: String,
    quantity: Number,
    totalPrice: Number,
    startDate: Date,
    endDate: Date,
    city: String,
    status: Number,
    location: { type: { type: String }, coordinates: [] }
});

// define our order model
// module.exports allows us to pass this to other files when it is called
module.exports = mongoose.model('Order', orderSchema );

