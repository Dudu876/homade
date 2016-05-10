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
    //var area = getAreaByPoint(req.body);
    //if (area == null)
    //{
    //    res.json({ showTips:false });
    //}
    //else {
    var cityName = exports.findCityByCoordinates(req.body);
    CityArea.find({cityname: cityName.name}, function (error, result){
        if (!error)
        {
            //areas = result;
            res.json({ showTips:true, selected: 1, areas: result });
        }
        else {

            res.json({ showTips:false });
        }
    });
    //ar cityAreas = getCityAreas(cityName.name);

    //res.json({ showTips:true, selected: 1, areas: cityAreas });
    //}
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

    CityArea.findOne({"area":{"$geoIntersects":{"$geometry":{"type":"Point", "coordinates":point}}}}, function (error, result) {
       if (!error)
       {
           area = result;
       }
    });

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
    if (cityHashtable[affectedCity] == null)
    {
        cityHashtable[affectedCity] = 1;
    }
    else {
        cityHashtable[affectedCity]++;
    }

    if (cityHashtable[affectedCity] % 1 == 0)
    {
        Order.find({city: affectedCity}).populate('chef meal').exec(function(error, orders) {
            var cityLocations = [];
            var cityTags = [];

            for (i = 0; i < orders.length; i++) {
                cityLocations.push(orders[i].chef.location.coordinates);
                cityTags.push(orders[i].meal.tags);
            }

            kmeans.clusterize(cityLocations, {k: 3}, function (err, kmeansRes) {
                if (err) {
                    console.error(err);
                }
                else {
                    var areaTags = [];
                    // Iterate over the areas and find the most popular tags in each one
                    for (j = 0; j < kmeansRes.length; j++)
                    {
                        var currAreaTags = {};

                        for (k = 0; k < kmeansRes[j].clusterInd.length; k++)
                        {
                            var currTagArr = cityTags[kmeansRes[j].clusterInd[k]];

                            for (l = 0; l < currTagArr.length; l++)
                            {
                                if (currAreaTags[currTagArr[l]] == null)
                                {
                                    currAreaTags[currTagArr[l]] = 1;
                                }
                                else
                                {
                                    currAreaTags[currTagArr[l]]++;
                                }
                            }
                        }

                        // Sort popular tags
                        var tuples = [];

                        for (var key in currAreaTags) tuples.push([key, currAreaTags[key]]);

                        tuples.sort(function(a, b) {
                            a = a[1];
                            b = b[1];

                            return a < b ? -1 : (a > b ? 1 : 0);
                        });

                        var topTags = [];

                        // Take 5 most popular
                        for (var i = 0; i < 5 && i < tuples.length; i++) {
                            var key = tuples[i][0];
                            topTags.push(key);
                        }

                        areaTags.push(topTags);
                    }

                    City.findOne({name: affectedCity}, function (error, cityRes) {
                        if (error) {
                            console.error(error);
                        }
                        else {
                            var voronoitemp = d3.voronoi();
                            var voronoi = d3.voronoi().extent([[[cityRes.southwest[1]], cityRes.southwest[0]] , [cityRes.northeast[1], cityRes.northeast[0]]]);
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
                                while(removingDone === undefined) {
                                    require('deasync').runLoopOnce();
                                }
                            }

                            for (x = 0; x < areas.length; x++)
                            {
                                if (areas[x] != null)
                                {
                                    var cityArea = new CityArea();
                                    cityArea.popularTags = areaTags[x];

                                    // make complete polygon
                                    var poly = [];

                                    for (p = 0; p < areas[x].length; p++)
                                    {
                                        poly.push(areas[x][p]);
                                    }

                                    poly.push(areas[x][0]);

                                    cityArea.area = { type: 'Polygon', coordinates: [poly] };
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
        });
    }
};