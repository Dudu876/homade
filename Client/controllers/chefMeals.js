/**
 * Created by Michael on 4/23/2016.
 */
homadeApp.controller('chefMealsCtrl', ['$scope', 'mealFactory', 'userFactory', 'chefsFactory', '$uibModal', function ($scope, mealFactory, userFactory, chefsFactory, $uibModal) {
    $scope.mealsLoaded = false;
    $scope.$on('isChefUpdate', function(event, args){
        mealFactory.getMealsOfChef(userFactory.fbId).success(function(data) {
            $scope.meals = data;
            $scope.mealsLoaded = true;
        });
    });

    chefsFactory.isChef(userFactory.fbId).success(function (isChef) {
        if (isChef) {
            mealFactory.getMealsOfChef(userFactory.fbId).success(function (data) {
                $scope.mealsLoaded = true;
                $scope.meals = data;
            });
        }
    });

    $scope.deleteMeal = function(mealId) {
        mealFactory.delete(mealId).success(function(resultId) {
            if (resultId != null)
            {
                var removeSaver = 0;
                for (i = 0; i < $scope.meals.length; i++) {
                    if ($scope.meals._id == resultId)
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

        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/mealModal.html',
            controller: 'addMealCtrl',
            resolve: {
                meal: function () {
                    return meal;
                }
            }
        });

        modalInstance.result.then(function (result) {

        });
    }
}]);