/**
 * Created by Dudu on 01/04/2016.
 */

/**
 * Created by Dudu on 25/03/2016.
 */

var Order = require('../models/order');
var cityController = require('./cityCtrl');

exports.createOrder = function(req, res) {
    var order = new Order();
    order.clientFBId = req.body.clientFBId;
    order.chefFBId = req.body.chefFBId;
    order.chef = req.body.chef;
    order.meal = req.body.meal;
    order.quantity = req.body.quantity;
    order.totalPrice = req.body.quantity * req.body.meal.price;
    order.date = new Date();

    order.save(function (err) {
        if (!err) {
            res.json('Created order!');
            cityController.performCitiesSplitting();
        }
        else {
        }
    });
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