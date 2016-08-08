/**
 * Created by Dudu on 01/04/2016.
 */

/**
 * Created by Dudu on 25/03/2016.
 */

var Order = require('../models/order');
var Meal = require('../models/meal');
var cityController = require('./cityCtrl');

exports.createOrder = function(req, res) {

    // Check if meal is active
    if (!req.body.meal.isActive){
        var result = { created: false, active: false};
        res.json(result);
    }
    else
    {
        var date = new Date();
        var day = date.getDay();

        if (req.body.chef.workDays[day].isWorking)
        {
            var startDate = new Date(req.body.chef.workDays[day].startingTime);
            var finishDate = new Date(req.body.chef.workDays[day].finishTime);
            var startHour = startDate.getHours();
            var finishHour = finishDate.getHours();

            var startMin = startDate.getMinutes();
            var finishMin = finishDate.getMinutes();

            var currHour = date.getHours();
            var currMin = date.getMinutes();

            if (!((currHour > startHour || currHour == startHour && currMin >= startMin) && (currHour < finishHour || currHour == finishHour && currMin <= finishMin)))
            {
                var result = { created: false, active: true};
                res.json(result);
            }

            var order = new Order();
            order.clientFBId = req.body.clientFBId;
            order.chefFBId = req.body.chefFBId;
            order.chef = req.body.chef;


            order.meal = req.body.meal;
            order.mealID = req.body.meal._id;
            order.quantity = req.body.quantity;
            order.totalPrice = req.body.quantity * req.body.meal.price;
            order.city = req.body.chef.city;
            order.startDate = new Date();
            order.status = 0;
            order.location = req.body.chef.location;

            order.save(function (err) {
                if (!err) {
                    res.json({created: true});
                    cityController.performCitySplitting(order.city);
                }
                else {
                }
            });
        }
        else {
            var result = { created: false, active: true};
            res.json(result);
        }

    }
};

exports.getOrdersByMeal = function(req, res) {
    Order.find({mealID: req.params.meal_id, status: 3, comment: { $ne: null }}).sort('endDate').limit(req.params.count).populate('meal').exec(function (err, orders) {
        if (!err) {
            res.json(orders);
        }
    });
};

exports.updateOrder = function (req, res) {
    Order.findByIdAndUpdate(req.body._id, req.body, {upsert:true}, function(err, doc){
        if (err) return res.send(500, { error: err });
        res.json("succesfully saved");

        if (req.body.rating != null && req.body.rating > 0 && req.body.rating <= 5)
        {
            Order.find({mealID: req.body.mealID, rating: { $ne: null }}).exec(function (err, ordersOfMeal) {
                var ratingsSum = 0;
                var ratingsCount = 0;
                ordersOfMeal.forEach(function(element) {
                    ratingsSum += element.rating;
                    ratingsCount++;
                }, this);

                var mealAverage = ratingsSum / ratingsCount;
                Meal.findByIdAndUpdate(req.body.mealID, { $set: {'averageRating': mealAverage}}, function (err)
                {
                    if (err){
                        console.log(err);
                    }
                });
            });
        }
    });
};

exports.getChefOrderNumbers = function (req, res) {
    Order.count({chefFBId: req.params.chef_id}, function(err, totalCount) {
        var results = {};
        results.total = totalCount;

        var lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);

        Order.count({chefFBId: req.params.chef_id, endDate: {$gte: lastMonth}}, function (error, lastMonthCount){
            results.lastMonth = lastMonthCount;

            res.json(results);
        });
    });
};

exports.getActiveOrdersByChef = function (req, res) {
    Order.find({chefFBId: req.params.chef_id, status: {$lt: 3}}).populate('meal').exec(function (err, orders) {
        if (!err) {
            res.json(orders);
        }
    });
};

exports.getOrdersByClient = function (req, res) {
    Order.find({clientFBId: req.params.client_id}).populate('meal').exec(function (err, orders) {
        if (!err) {
            res.json(orders);
        }
    });
};

exports.getCompletedOrdersByChef = function (req, res) {
    Order.find({chefFBId: req.params.chef_id, status: 3}).populate('meal').exec(function (err, orders) {
        if (!err) {
            res.json(orders);
        }
    });
};

exports.getConnections = function (req, res) {
    Order.find({ $or: [ {'chefFBId': req.params.fbId}, {'clientFBId': req.params.fbId}]}, 'chefFBId clientFBId', function (err, connections) {
        if (!err) {
            res.json(connections);
        }

    })
};

exports.getAllOrders = function (req, res) {
    Order.find({})
        .populate('chef')
        .populate
        .exec(function(error,orders){
            res.json(orders);
        });
};