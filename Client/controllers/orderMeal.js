/**
 * Created by Michael on 4/13/2016.
 */
homadeApp.controller('orderMealCtrl', ['$scope', 'ordersFactory', 'userFactory', function ($scope, ordersFactory, userFactory) {
    $scope.name = "Hello";
    $scope.type = "Vegan";
    $scope.price = 25;
    $scope.description = 'See more sni\nppet';
    $scope.showReviews = false;
    $scope.quantity = 1;
    $scope.averageRating = 4.8;
    $scope.flooredRating = Math.floor($scope.averageRating);
    $scope.isKosher = false;
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