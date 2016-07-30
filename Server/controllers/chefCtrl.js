/**
 * Created by Michael on 4/5/2016.
 */

var Chef = require('../models/chef');
var cityController = require('./cityCtrl');

exports.createChef = function (req, res) {
    var chef = new Chef();
    chef.location = { type: 'Point', coordinates: req.body.location } ;
    chef.locationName = req.body.locationName;
    chef.workDays = req.body.workDays;
    chef.fbId = req.body.fbId;
    chef.name = req.body.name;

    var city = cityController.findCityByCoordinates(req.body.location);

    cityController.createCity(city);

    chef.city = city.name;

    chef.save(function (err) {
        if (!err) {
            res.json('Chef created!');
        }
        else {
            res.json('error occured');
        }
    });
};

exports.updateChef = function (req, res) {
    Chef.findById(req.body._id, function (err, chef) {
        if (!err) {
            chef.location = { type: 'Point', coordinates: req.body.location } ;
            chef.locationName = req.body.locationName;
            chef.workDays = req.body.workDays;
            chef.fbId = req.body.fbId;
            chef.name = req.body.name;
            var city = cityController.findCityByCoordinates(req.body.location);

            cityController.createCity(city);

            chef.city = city.name;

            chef.save(function (err) {
                if (!err) {
                    res.json('Chef updated!');
                }
                else {
                    res.json('error occured');
                }
            });
        }
        else {
            //Utils.generateResponse(req, res, 0, err);
        }
    });
};

exports.getDetails = function (req, res) {
    Chef.findOne( { 'fbId': req.params.chef_id } , function (err, chef)
    {
        if (err)
        {
            res.json(false);
        }
        else
        {
            if (chef == null)
            {
                res.json(false);
            }
            else {
                res.json(chef);
            }
        }
    });
};

exports.isChef = function (req, res) {
    Chef.findOne( { 'fbId': req.params.chef_id } , function (err, chef)
    {
        if (err)
        {
            res.json(false);
        }
        else
        {
            if (chef == null)
            {
                res.json(false);
            }
            else {
                res.json(true);
            }
        }
    });
};

