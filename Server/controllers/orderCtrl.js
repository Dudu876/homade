/**
 * Created by Dudu on 01/04/2016.
 */

/**
 * Created by Dudu on 25/03/2016.
 */

var Order = require('../models/order');

exports.getAllOrders = function (req, res) {
    Order.find({})
        .populate('chef')
        .exec(function(error,orders){
            res.json(orders);
        });
};