/**
 * Created by Dudu on 08/03/2016.
 */
var path = require('path');

// Example
//var carController = require('./controllers/Cars');

module.exports = function (app) {

    // -- Example --
    //app.route('/api/cars')
    //    .get(carController.getAllCars)
    //    .post(carController.createCar)
    //    .put(carController.updateCar);

    // route to handle all angular requests
    app.get('*', function (req, res) {
        res.sendFile('index.html', {root: path.join(__dirname, '../Client')}); // load our public/index.html file
    });
};
