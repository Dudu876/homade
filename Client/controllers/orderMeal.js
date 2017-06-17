/**
 * Created by Michael on 4/13/2016.
 */
homadeApp.controller('orderMealCtrl', ['$scope', '$rootScope', 'ordersFactory', 'userFactory', 'mealFactory', 'ezfb', function($scope, $rootScope, ordersFactory, userFactory, mealFactory, ezfb) {
    var mealId = location.pathname.split("/").pop();
    $scope.order = {};
    $scope.flooredRating = 0;
    $scope.averageRating = 0;
    $scope.ratingText = "No Ratings Yet!";
    $scope.order.quantity = 1;
    $rootScope.loading = 0;
    $rootScope.loading++;

    mealFactory.getMeal(mealId).success(function(data) {
        // $rootScope.loading++;
        $scope.order.meal = data;
        $scope.order.chefFBId = data.chefFBId;
        $scope.order.chef = data.chef;
        $scope.chefName = data.chef.name.split(' ')[0];

        if ($scope.order.meal.averageRating != null) {
            $scope.averageRating = $scope.order.meal.averageRating;
            $scope.ratingText = $scope.averageRating;
            $scope.flooredRating = Math.floor($scope.averageRating);
        }

        ezfb.api('/v2.6/' + data.chefFBId + '/picture?height=100&width=100', function(res) {
            $scope.chefPic = res.data.url;
            $rootScope.loading--;
        });
    });

    var getOrders = function() {
        ordersFactory.getOrdersByMeal(mealId, 5).success(function(data) {
            $scope.ordersOfMeal = data;
            $rootScope.loading += $scope.ordersOfMeal.length - 1;
            $scope.ordersOfMeal.forEach(function(element, index, array) {
                ezfb.api(element.clientFBId + '?fields=first_name', function(res) {
                    if (!res.error) {
                        element.clientName = res.first_name;
                    } else {
                        element.clientName = "Anonymous";
                    }

                    $rootScope.loading--;
                });

                element.fullStars = new Array(element.rating);
                element.emptyStars = new Array(5 - element.rating);
                var now = new Date();
                var timeDiff = Math.abs(now - new Date(element.endDate));
                element.daysAgo = Math.ceil(timeDiff / (1000 * 3600 * 24));
            });
        });
    };

    if (userFactory.fbId != "") {
        getOrders();
    } else {
        $scope.$on('isChefUpdate', function(event, args) {
            getOrders();
        });
    }

    $scope.comments = [{}];

    $scope.fullStars = function() {
        return new Array($scope.flooredRating);
    };

    $scope.halfStar = function() {
        if ($scope.averageRating - $scope.flooredRating > 0.25) {
            return true;
        } else {
            return false;
        }
    };

    $scope.emptyStars = function(n) {
        if ($scope.halfStar()) {
            return new Array(5 - $scope.flooredRating - 1);
        } else {
            return new Array(5 - $scope.flooredRating);
        }
    };

    $scope.performOrder = function() {
        $scope.order.clientFBId = userFactory.fbId;
        ordersFactory.create($scope.order).success(function(data) {
            if (data.created != false) {
                alert('Order complete');
                location.href = "/";
            } else {
                if (!data.active) {
                    alert("This meal isn't available anymore");
                } else {
                    alert("Chef is unavailable in the current time");
                }
            }
        });
    };

    $scope.toggleReviews = function() {
        $scope.showReviews = !$scope.showReviews;
    }
}]);