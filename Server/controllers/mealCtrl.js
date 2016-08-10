/**
 * Created by Dudu on 25/03/2016.
 */
var geolib = require('geolib');
var uploader = require('./uploadCtrl');

var Meal = require('../models/meal');
var Chef = require('../models/chef');

exports.getAllMeals = function (req, res) {
    var search = JSON.parse(req.query.search);
    if (!search) {
        Meal.find({isActive: true})
            .populate('chef')
            .exec(function (error, meals) {
                res.json(meals);
            });
    }
    else {
        //var pointA = { type: 'Point', coordinates: [search.latlng.lng, search.latlng.lat] };
        var pointA = search.latlng ? { latitude: search.latlng.lat, longitude: search.latlng.lng} : undefined;
        var query = { isActive: true };
        if (search.query != '*') query = { tags: search.query, isActive: true };

        Meal.find(query)
            .populate('chef')
            .sort('-averageRating')
            .lean()
            .exec(function (error, meals) {
                if (pointA === undefined) {
                    res.json(meals);
                }
                else {
                    meals.forEach(function (element, index, array) {
                        var pointB = {latitude: element.chef.location.coordinates[1], longitude: element.chef.location.coordinates[0]};
                        var dis = geolib.getDistance(pointA, pointB);
                        element.distance = dis / 1000;
                    });
                    res.json(meals);
                }
            });
        //Meal.geoNear(point, { queey: query }, function(err,docs) {
        //    console.log(docs);
        //});
    }
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
    Meal.findById(req.params.meal_id).populate('chef').exec(function (err, meal) {
        if (!err) {
            res.json(meal);
        }
        else {
            //Utils.generateResponse(req, res, 0, err);
        }
    });
};

exports.getMealsOfChef = function (req, res) {
    Meal.find({ chefFBId: req.params.chef_id, isActive: true}).populate('chef').exec(function (err, meal) {
        if (!err) {
            res.json(meal);
        }
        else {
        }
    });
};

exports.updateMeal = function (req, res) {
    Meal.findById(req.body._id, function (err, meal) {
        if (!err) {

            meal.name = req.body.name;
            meal.description = req.body.description;
            meal.kosher = req.body.kosher || false;
            meal.glutenfree = req.body.glutenfree || false;
            meal.price = req.body.price;
            meal.type = req.body.type;
            meal.isActive = true;
            //meal.chefFBId = req.body.chefFBId;

            //handle tags
            for (var i in req.body.tags) {
                meal.tags.push(req.body.tags[i].text.toLowerCase());
            }

            var lower_name = req.body.name.toLowerCase();
            var name_tags = lower_name.split(" ");
            meal.tags = meal.tags.concat(name_tags);

            meal.tags = fixTags(meal.tags);
            meal.tags = filterTags(meal.tags);

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
    Meal.findById(req.params.meal_id, function (err, meal) {
        if (!err) {
            meal.isActive = false;
            meal.save(function (err) {
                if (!err) {
                    res.json('meal deleted');
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

exports.createMeal = function (req, res) {
    var meal = new Meal();
    //set meal id for the uploader controller
    uploader.setMealId(meal.id);

    //set meal props
    meal.name = req.body.name;
    meal.description = req.body.description;
    meal.kosher = req.body.kosher || false;
    meal.glutenfree = req.body.glutenfree || false;
    meal.price = req.body.price;
    meal.type = req.body.type;
    meal.chefFBId = req.body.chefFBId;
    meal.isActive = true;

    //handle tags
    for (var i in req.body.tags) {
        meal.tags.push(req.body.tags[i].text.toLowerCase());
    }

    var lower_name = req.body.name.toLowerCase();
    var name_tags = lower_name.split(" ");
    meal.tags = meal.tags.concat(name_tags);

    meal.tags = fixTags(meal.tags);
    meal.tags = filterTags(meal.tags);

    Chef.find({fbId: req.body.chefFBId}, function (err, chef) {
        if (!err) {
            meal.chef = chef[0];
            meal.save(function (error, savedMeal) {
                if (!error) {
                    res.json(savedMeal.id);
                }
                else {
                    //Utils.generateResponse(req, res, 0, err);
                }
            });
        }
        else {

        }
    });
};

exports.getAllTags = function (req, res) {
    Meal.find({isActive: true},'tags',function (err, meals) {
        if (!err) {
            //tags = fixTags(tags);
            var finalTags = [];
            var i;
            for (i in meals) {
                finalTags = finalTags.concat(meals[i].tags);
            }
            finalTags = fixTags(finalTags);

            var sendingTags = [];
            sendingTags.push({val: '*'});

            for (var i = 0; i < finalTags.length; i++){
                sendingTags.push({val: finalTags[i]});
            }

            res.json(sendingTags);
        }
        else {
            //Utils.generateResponse(req, res, 0, err);
        }
    });
};

function fixTags(tags) {
    var seen = {};
    return tags.filter(function(item) {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
}
function filterTags(tags) {
    var badWords = ['the','for','in','a','on','at','with','like','good','nice','best'];
    return tags.filter(function(item) {
        return (badWords.indexOf(item) < 0);
    });
}

function lowercaseTags(tags) {
    var i;
    for (i in tags) {
        tags[i] = tags[i].toLowerCase();
    }
}


