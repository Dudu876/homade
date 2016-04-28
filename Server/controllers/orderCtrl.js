/**
 * Created by Dudu on 01/04/2016.
 */

/**
 * Created by Dudu on 25/03/2016.
 */

var Order = require('../models/order');

exports.createOrder = function(req, res) {
    var order = new Order();

};

exports.getOrdersByChef = function (req, res) {
    Order.find(req.params.chef_id).populate('meal').exec(function (err, orders) {
        res.json(orders);
    });
};

exports.getAllOrders = function (req, res) {
    Order.find({})
        .populate('chef')
        .populate
        .exec(function(error,orders){
            res.json(orders);
        });
};