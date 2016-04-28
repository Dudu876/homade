/**
 * Created by Michael on 4/5/2016.
 */

var Chef = require('../models/chef');

exports.createChef = function (req, res) {
    var chef = new Chef();
    chef.location = { type: 'Point', coordinates: req.body.location } ;
    chef.locationName = req.body.locationName;
    chef.workDays = req.body.workDays;
    chef.fbId = req.body.fbId;
    chef.name = req.body.name;

    chef.save(function (err) {
        if (!err) {
            res.json('Chef created!');
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

