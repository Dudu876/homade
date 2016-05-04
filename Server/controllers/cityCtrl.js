/**
 * Created by Michael on 4/2/2016.
 */
var kmeans = require('node-kmeans');
var d3 = require('d3-voronoi');
var Order = require('../models/order');
var City = require('../models/city');
var CityAreas = require('../models/cityarea');

exports.getLocationTips = function (req, res) {
    var data = [
        {'company': 'Microsoft' , 'size': 91259, 'revenue': 60420},
        {'company': 'IBM' , 'size': 400000, 'revenue': 98787},
        {'company': 'Skype' , 'size': 700, 'revenue': 716},
        {'company': 'SAP' , 'size': 48000, 'revenue': 11567},
        {'company': 'Yahoo!' , 'size': 14000 , 'revenue': 6426 },
        {'company': 'eBay' , 'size': 15000, 'revenue': 8700},
    ];

    var vertices = [
        [1, 0],
        [0, 1],
        [0, 0],
    ];
    var width = 960,
        height = 500;

    var temp = d3.voronoi();
    var voronoi = d3.voronoi().extent([[0, 0], [1, 1]]);

    var res = voronoi(vertices).polygons();

// Create the data 2D-array (vectors) describing the data
    var vectors = [];
    for (var i = 0 ; i < data.length ; i++)
        vectors[i] = [ data[i]['size'] , data[i]['revenue']];

    kmeans.clusterize(vectors, {k: 4}, function(err,res) {
        if (err) console.error(err);
        else
        {
            //console.log('%o',res);
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

exports.performCitiesSplitting = function (){
    Order.find("").populate('chef meal').exec(function(error, orders){
        var cityLocations = {};

        for (i = 0; i < orders.length; i++)
        {
            if (cityLocations[orders[i].chef.city] == null)
            {
                cityLocations[orders[i].chef.city] = {};
            }

            if (cityLocations[orders[i].chef.city].locations == null)
            {
                cityLocations[orders[i].chef.city].locations = [];
            }

            cityLocations[orders[i].chef.city].locations.push(orders[i].chef.location.coordinates);
        }

        for (var city in cityLocations)
        {
            kmeans.clusterize(cityLocations[city].locations, {k: 4}, function(err, res) {
                if (err) {
                    console.error(err);
                }
                else
                {
                    City.findOne({name: city}, function (error, cityRes)
                    {
                        if (error){
                            console.error(error);
                        }
                        else {
                            cityLocations[city].kmeansResults = res;
                            var voronoitemp = d3.voronoi();
                            var voronoi = d3.voronoi().extent([cityRes.southwest, cityRes.northeast]);
                            var vertices = [];

                            for (i = 0; i < res.length; i++)
                            {
                                if (res[i].centroid.length == 2 ) {
                                    vertices.push(res[i].centroid);
                                }
                            }

                            var areas = voronoi(vertices).polygons();
                        }
                    });
                }
            });
        }
    });

};