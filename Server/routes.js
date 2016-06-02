/**
 * Created by Dudu on 08/03/2016.
 */
var path = require('path');
// Requires multiparty
var multiparty = require('connect-multiparty');
var multipartyMiddleware = multiparty();

// Example
var mealController    = require('./controllers/mealCtrl');
var cityController    = require('./controllers/cityCtrl');
var chefController    = require('./controllers/chefCtrl');
var orderController   = require('./controllers/orderCtrl');
var uploadController  = require('./controllers/uploadCtrl');
var messageController = require('./controllers/messageCtrl');

module.exports = function (app) {

    app.route('/api/meals')
        .get(mealController.getAllMeals)
        .post(mealController.createMeal)
        .put(mealController.updateMeal);

    app.route('/api/meals/tags')
        .get(mealController.getAllTags);

    app.route('/api/meals/:meal_id')
        .get(mealController.getMealById)
        .delete(mealController.deleteMeal);

    app.route('/api/meals/bychef/:chef_id')
        .get(mealController.getMealsOfChef);

    app.route('/api/locationTips')
        .post(cityController.getLocationTips);

    app.route('/api/chefs/:chef_id')
        .get(chefController.isChef);

    app.route('/api/chefs')
        .post(chefController.createChef);

    app.route('/api/orders')
        .post(orderController.createOrder)
        .put(orderController.updateOrder);

    app.route('/api/orders/active/:chef_id')
        .get(orderController.getActiveOrdersByChef);

    app.route('/api/orders/activeclient/:client_id')
        .get(orderController.getOrdersByClient);

    app.route('/api/orders/complete/:chef_id')
        .get(orderController.getCompletedOrdersByChef);

    app.route('/api/orders/meal/:meal_id/:count')
        .get(orderController.getOrdersByMeal);

    app.route('/api/orders/connections/:fbId')
        .get(orderController.getConnections);

    app.route('/api/messages')
        .post(messageController.postMessage);

    app.route('/api/messages/:fbId1,:fbId2')
        .get(messageController.getMessages);

    //app.route('/upload')
    //    .post(uploadController.uploadFile);
    app.post('/upload', multipartyMiddleware, uploadController.uploadFile);

    // route to handle all angular requests
    app.get('*', function (req, res) {
        res.sendFile('index.html', {root: path.join(__dirname, '../Client')}); // load our public/index.html file
    });
};
