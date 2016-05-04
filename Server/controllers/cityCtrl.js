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

getExtentOfCity = function(cityName) {
    City.findOne({name: city.name}, function (err, res) {
        if (res.length == 0) {
            var cityExtent = [];
            cityExtent.push(res.southwest);
            cityExtent.push(res.northeast);

            return city;
        }
    });
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

            kmeans.clusterize(cityLocations, {k: 4}, function (err, kmeansRes) {
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
                            var voronoi = d3.voronoi().extent([cityRes.southwest, cityRes.northeast]);
                            var vertices = [];

                            for (i = 0; i < kmeansRes.length; i++) {
                                if (kmeansRes[i].centroid.length == 2) {
                                    vertices.push(kmeansRes[i].centroid);
                                }
                            }

                            var areas = voronoi(vertices).polygons();

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