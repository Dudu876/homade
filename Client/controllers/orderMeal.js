/**
 * Created by Michael on 4/13/2016.
 */
homadeApp.controller('orderMealCtrl', ['$scope', 'ordersFactory', 'userFactory', 'mealFactory', 'ezfb', function ($scope, ordersFactory, userFactory, mealFactory, ezfb) {
    var mealId = location.pathname.split("/").pop();
    mealFactory.getMeal(mealId).success(function(data) {
        $scope.meal = data;
        $scope.chefName = data.chef.name.split(' ')[0];

        ezfb.api('/v2.6/' + data.chefFBId + '/picture?height=100&width=100', function (res) {
            $scope.chefPic = res.data.url;
        });
    });

    $scope.quantity = 1;
    $scope.averageRating = 4.8;
    $scope.flooredRating = Math.floor($scope.averageRating);
    $scope.comments = [ { } ];
    $scope.quantity = 1;


    $scope.fullStars = function() {
        return new Array($scope.flooredRating);
    };

    $scope.halfStar = function() {
        if ($scope.averageRating - $scope.flooredRating > 0.25)
        {
            return true;
        }
        else {
            return false;
        }
    };

    $scope.emptyStars = function(n) {
        if ($scope.halfStar()){
            return new Array(5 - $scope.flooredRating - 1);
        }
        else {
            return new Array(5 - $scope.flooredRating);
        }
    };

    $scope.performOrder = function () {
        order = {clientFBId: userFactory.fbId};
        ordersFactory.create(order);
    };

    $scope.toggleReviews = function() {
        $scope.showReviews = !$scope.showReviews;
    }
}]);