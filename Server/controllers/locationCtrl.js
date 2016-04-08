/**
 * Created by Michael on 4/2/2016.
 */
var kmeans = require('node-kmeans');
var d3 = require('d3-voronoi');

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