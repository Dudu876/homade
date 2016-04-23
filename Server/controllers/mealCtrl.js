/**
 * Created by Dudu on 25/03/2016.
 */

var Meal = require('../models/meal');

exports.getAllMeals = function (req, res) {
    Meal.find({})
        .populate('chef')
        .exec(function(error,meals){
            res.json(meals);
        });
};

exports.searchMeal = function(req,res){
    var query = {};

    if (req.body.number != null && req.body.number != ''){
        var regexNumber = new RegExp(req.body.number, 'i');
        query.number = {$regex: regexNumber};
    }
    if (req.body.model != null && req.body.model != ''){
        var regexModel = new RegExp(req.body.model, 'i');

        query.$or = [];
        query.$or.push({"type.model":{$regex: regexModel}});
        query.$or.push({"type.manufacturer":{$regex: regexModel}});

    }
    if (req.body.category != null && req.body.category != ''){
        query.category = req.body.category;
    }

    var myAggregation = Meal.find(query).populate('branch').exec(function(error,meals){
        res.json(meals);
    });
};

exports.getMealById = function (req, res) {
    Meal.findById(req.params.meal_id, function (err, meal) {
        if (!err) {
            res.json(meal);
        }
        else {
            //Utils.generateResponse(req, res, 0, err);
        }
    });
};

exports.updateMeal = function (req, res) {
    Meal.findById(req.body._id, function (err, meal) {
        if (!err) {
            //meal.number = req.body.number;
            //meal.type.manufacturer = req.body.type.manufacturer;
            //meal.type.model = req.body.type.model;
            //meal.type.year = new Date(req.body.type.year).getFullYear();
            //meal.category = req.body.category;
            //meal.price = req.body.price;
            //meal.gearbox = req.body.gearbox;
            //meal.branch = req.body.branch._id;

            meal.save(function (err) {
                if (!err) {
                    res.json('meal updated');
                }
                else {
                    //Utils.generateResponse(req, res, 0, err);
                }
            });

        }
        else {
            //Utils.generateResponse(req, res, 0, err);
        }
    });
};

exports.deleteMeal = function (req, res) {
    Meal.remove({number: req.params.number}, function (err) {
        if (!err) {
            res.json(req.params.number);
        }
        else {
            //Utils.generateResponse(req, res, 0, err);
        }
    });
};

exports.createMeal = function (req, res) {
    var meal = new Meal();
    meal.name = req.body.name;
    meal.description = req.body.description;
    meal.kosher = req.body.kosher || false;
    meal.glutenfree = req.body.glutenfree || false;
    meal.price = req.body.price;
    meal.type = req.body.type;

    for (var i in req.body.tags) {
        meal.tags.push(req.body.tags[i].text);
    }

    meal.save(function (err) {
        if (!err) {

            res.json('meal created');
        }
        else {
            //Utils.generateResponse(req, res, 0, err);
        }
    });
};


