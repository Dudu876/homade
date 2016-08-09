/**
 * Created by Michael on 4/2/2016.
 */
var kmeans = require('node-kmeans');
var d3 = require('d3-voronoi');
var Order = require('../models/order');
var City = require('../models/city');
var CityArea = require('../models/cityarea');
var cityHashtable = {};

exports.getLocationTips = function (req, res) {
    var cityName = exports.findCityByCoordinates(req.body);
    CityArea.findOne({cityname: cityName.name, "area":{"$geoIntersects":{"$geometry":{"type":"Point", "coordinates":req.body}}}}, function (error, area) {
        if (!error)
        {
            if (area)
            {
                CityArea.find({cityname: cityName.name}, function (errorsec, result){
                    if (!errorsec)
                    {
                        res.json({ showTips:true, selected: area._id, areas: result });
                    }
                    else {
                        res.json({ showTips:false });
                    }
                });
            }
            else {
                res.json({ showTips:false });
            }
        }
    });
};

exports.createCity = function (city) {
    City.find({name: city.name}, function (err, res) {
        if (res.length == 0) {
            var cityToInsert = new City();
            cityToInsert.name = city.name;
            cityToInsert.northeast = city.northeast;
            cityToInsert.southwest = city.southwest;

            cityToInsert.save(function (err) {
                if (!err) {
                }
                else {
                    console.log(err);
                }
            });

        }
    });
};

getAreaByPoint = function (point) {
    var area;


    while(area === undefined) {
        require('deasync').runLoopOnce();
    }

    return area;
};

getCityAreas = function(cityName) {
    var areas;
    CityArea.find({cityname: cityName}, function (error, result){
        if (!error)
        {
            areas = result;
        }
    });

    while(areas === undefined) {
        require('deasync').runLoopOnce();
    }

    return areas;
};

exports.findCityByCoordinates = function(location) {
    var request = require("request");
    var city;
    request("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + location[1] + "," + location[0] +"&sensor=false&key=AIzaSyDpkTgTR--qces2l4LuT35p1todOQcimJg",
        function(error, response, body){
            var parsedJson = JSON.parse(body);

            if (parsedJson.results.length != 0) {
                var cityNameSaver = '';
                var cityLocation = [];

                for (i = 0; i < parsedJson.results.length && cityNameSaver == ''; i++) {
                    if (parsedJson.results[i].types.length == 2 &&
                        parsedJson.results[i].types[0] == 'locality' &&
                        parsedJson.results[i].types[1] == 'political') {
                        cityNameSaver = parsedJson.results[i].address_components[0].long_name;

                        // Push extent
                        var cityNorthEast = [];
                        cityNorthEast.push(parsedJson.results[i].geometry.bounds.northeast.lat);
                        cityNorthEast.push(parsedJson.results[i].geometry.bounds.northeast.lng);

                        var citySouthWest = [];
                        citySouthWest.push(parsedJson.results[i].geometry.bounds.southwest.lat);
                        citySouthWest.push(parsedJson.results[i].geometry.bounds.southwest.lng);

                        city = {name: cityNameSaver, southwest: citySouthWest, northeast: cityNorthEast};

                    }
                }
            }
        });
    while(city === undefined) {
        require('deasync').runLoopOnce();
    }

    return city;
};

exports.performCitySplitting = function (affectedCity)
{
    // Check if there were orders in the corresponding city
    if (cityHashtable[affectedCity] == null)
    {
        cityHashtable[affectedCity] = 1;
    }
    else {
        cityHashtable[affectedCity]++;
    }

    // Check to make sure there is a significant change in the number of orders
    if (cityHashtable[affectedCity] % 3 == 0)
    {
        // Select all the orders of the corresponding city
        Order.find({city: affectedCity}).populate('chef').populate('meal').exec(function(error, orders) {
            var cityLocations = [];
            var cityTags = [];

            // Push all the tags to an array
            for (i = 0; i < orders.length; i++) {
                cityLocations.push(orders[i].location.coordinates);

                if (orders[i].meal != null && orders[i].meal.tags != null) {
                    cityTags.push(orders[i].meal.tags);
                }
                else {
                    cityTags.push([]);
                }
            }

            // Make sure there are enough locations in the orders array in order to perform the splitting
            if (cityLocations.length >= 3) {
                // Perform the k-means clustering
                kmeans.clusterize(cityLocations, {k: 4}, function (err, kmeansRes) {
                    if (err) {
                        console.error(err);
                    }
                    else {
                        var areaTags = [];
                        // Iterate over the areas and find the most popular tags in each one
                        for (j = 0; j < kmeansRes.length; j++) {
                            var currAreaTags = {};

                            for (k = 0; k < kmeansRes[j].clusterInd.length; k++) {
                                var currTagArr = cityTags[kmeansRes[j].clusterInd[k]];

                                for (l = 0; l < currTagArr.length; l++) {
                                    if (currAreaTags[currTagArr[l]] == null) {
                                        currAreaTags[currTagArr[l]] = 1;
                                    }
                                    else {
                                        currAreaTags[currTagArr[l]]++;
                                    }
                                }
                            }

                            // Sort popular tags
                            var tuples = [];

                            for (var key in currAreaTags) tuples.push([key, currAreaTags[key]]);

                            tuples.sort(function (a, b) {
                                a = a[1];
                                b = b[1];

                                return a < b ? -1 : (a > b ? 1 : 0);
                            });

                            var topTags = [];

                            // Take 5 most popular
                            for (var i = 0; i < 5 && i < tuples.length; i++) {
                                var key = tuples[i][0];
                                var val = tuples[i][1];
                                topTags.push({tag: key, count: val});
                            }

                            areaTags.push(topTags);
                        }

                        City.findOne({name: affectedCity}, function (error, cityRes) {
                            if (error) {
                                console.error(error);
                            }
                            else {
                                // Perform the voronoi section
                                var voronoitemp = d3.voronoi();
                                var voronoi = d3.voronoi().extent([[[cityRes.southwest[1]], cityRes.southwest[0]], [cityRes.northeast[1], cityRes.northeast[0]]]);
                                var vertices = [];

                                for (i = 0; i < kmeansRes.length; i++) {
                                    if (kmeansRes[i].centroid.length == 2) {
                                        vertices.push([kmeansRes[i].centroid[0], kmeansRes[i].centroid[1]]);
                                    }
                                }

                                var temp = voronoi(vertices);
                                var areas = temp.polygons();

                                if (areas.length != 0) {
                                    var removingDone;
                                    CityArea.remove({cityname: affectedCity}, function (err) {
                                        if (!err) {
                                            removingDone = true;
                                        }
                                        else {
                                            //Utils.generateResponse(req, res, 0, err);
                                        }
                                    });
                                    while (removingDone === undefined) {
                                        require('deasync').runLoopOnce();
                                    }
                                }

                                // Save the complete areas polygon in the db.
                                for (x = 0; x < areas.length; x++) {
                                    if (areas[x] != null) {
                                        var cityArea = new CityArea();
                                        cityArea.popularTags = areaTags[x];

                                        // make complete polygon
                                        var poly = [];

                                        for (p = 0; p < areas[x].length; p++) {
                                            poly.push(areas[x][p]);
                                        }

                                        poly.push(areas[x][0]);

                                        cityArea.area = {type: 'Polygon', coordinates: [poly]};
                                        cityArea.cityname = cityRes.name;


                                        cityArea.save(function (error) {
                                            if (!error) {
                                            }
                                            else {
                                            }
                                        });
                                    }
                                }
                            }
                        });
                    }
                });
            }
        });
    }
};