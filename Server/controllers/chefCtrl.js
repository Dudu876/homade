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
    var request = require("request");
    request("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + req.body.location[0] + "," + req.body.location[1] +"&sensor=false&key=AIzaSyDpkTgTR--qces2l4LuT35p1todOQcimJg",
        function(error, response, body) {
            var parsedJson = JSON.parse(body);

            if (parsedJson.results.length != 0 )
            {
                var cityNameSaver = '';
                var cityLocation = [];

                for (i = 0; i < parsedJson.results.length && cityNameSaver == ''; i++)
                {
                    if (parsedJson.results[i].types.length == 2 &&
                        parsedJson.results[i].types[0] == 'locality' &&
                        parsedJson.results[i].types[1] == 'political')
                    {
                        cityNameSaver = parsedJson.results[i].address_components[0].long_name;

                        // Push extent
                        var cityNorthEast = [];
                        cityNorthEast.push(parsedJson.results[i].geometry.bounds.northeast.lat);
                        cityNorthEast.push(parsedJson.results[i].geometry.bounds.northeast.lng);

                        var citySouthWest = [];
                        citySouthWest.push(parsedJson.results[i].geometry.bounds.southwest.lat);
                        citySouthWest.push(parsedJson.results[i].geometry.bounds.southwest.lng);

                        var city = {name: cityNameSaver, southwest: citySouthWest, northeast: cityNorthEast};
                        cityController.createCity(city);
                    }
                }

                chef.city = cityNameSaver;

                chef.save(function (err) {
                    if (!err) {
                        res.json('Chef created!');
                    }
                    else {
                        res.json('error occured');
                    }
                });
            }
            else {
                res.json('error occured');
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

