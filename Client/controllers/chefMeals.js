/**
 * Created by Michael on 4/23/2016.
 */
homadeApp.controller('chefMealsCtrl', ['$scope', '$rootScope', 'mealFactory', 'userFactory', 'chefsFactory', '$uibModal', function ($scope, $rootScope, mealFactory, userFactory, chefsFactory, $uibModal) {
    $scope.mealsLoaded = false;

    $rootScope.loading = 0;
    $rootScope.loading++;

    $scope.$on('isChefUpdate', function(event, args){
        mealFactory.getMealsOfChef(userFactory.fbId).success(function(data) {
            $scope.meals = data;
            $scope.mealsLoaded = true;
            $rootScope.loading--;
        });
    });

    chefsFactory.isChef(userFactory.fbId).success(function (isChef) {
        if (isChef) {
            mealFactory.getMealsOfChef(userFactory.fbId).success(function (data) {
                $scope.mealsLoaded = true;
                $scope.meals = data;
                $rootScope.loading--;
            });
        }
    });

    $scope.deleteMeal = function(mealId) {
        mealFactory.delete(mealId).success(function(resultId) {
            if (resultId != null)
            {
                var removeSaver = 0;
                for (i = 0; i < $scope.meals.length; i++) {
                    if ($scope.meals[i]._id == resultId)
                    {
                        removeSaver = i;
                        break;
                    }
                }

                $scope.meals.splice(removeSaver, 1);
            }
        });
    };

    $scope.mealModal = function(meal) {

        var meal_copy = angular.copy(meal);

        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/mealModal.html',
            controller: 'addMealCtrl',
            resolve: {
                meal: function () {
                    return meal_copy;
                }
            }
        });

        modalInstance.result.then(function (result) {
            $rootScope.loading--;
            if (result.isUpdate) {

            }
            else {
                $scope.meals.push(result.meal);
            }
        });
    }
}]);