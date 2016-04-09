/**
 * Created by Dudu on 08/03/2016.
 */
var path = require('path');

// Example
var mealController = require('./controllers/mealCtrl');
var locationController = require('./controllers/locationCtrl');
var chefController = require('./controllers/chefCtrl');

module.exports = function (app) {

    app.route('/api/meals')
        .get(mealController.getAllMeals)
        .post(mealController.createMeal)
        .put(mealController.updateMeal);

    app.route('/api/locationTips')
        .get(locationController.getLocationTips);

    app.route('/api/chefs')
        .post(chefController.createChef);

    // route to handle all angular requests
    app.get('*', function (req, res) {
        res.sendFile('index.html', {root: path.join(__dirname, '../Client')}); // load our public/index.html file
    });
};
