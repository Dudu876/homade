/**
 * Created by Dudu on 25/03/2016.
 */

// grab the mongoose module
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var orderSchema = new Schema({
    clientFBId: Number,
    chefFBId: Number,
    meal: { type: Schema.Types.ObjectId, ref: 'Meal' },
    chef: { type: Schema.Types.ObjectId, ref: 'Chef' },
    rating: { service: Number, taste: Number, valueForPrice: Number },
    comment: String,
    quantity: Number,
    totalPrice: Number,
    date: Date
});

// define our order model
// module.exports allows us to pass this to other files when it is called
module.exports = mongoose.model('Order', orderSchema );

