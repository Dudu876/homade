/**
 * Created by Michael on 4/23/2016.
 */
homadeApp.controller('chefMealsCtrl', ['$scope', 'mealFactory', 'userFactory', 'chefsFactory', function ($scope, mealFactory, userFactory, chefsFactory) {
    $scope.$on('isChefUpdate', function(event, args){
        mealFactory.getMealsOfChef(userFactory.fbId).success(function(data) {
            $scope.meals = data;
        });
    });

    chefsFactory.isChef(userFactory.fbId).success(function (isChef) {
        if (isChef) {
            mealFactory.getMealsOfChef(userFactory.fbId).success(function (data) {
                $scope.meals = data;
            });
        }
    });

}]);