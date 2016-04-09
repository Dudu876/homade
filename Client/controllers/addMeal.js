/**
 * Created by Dudu on 19/03/2016.
 */

homadeApp.controller('addMealCtrl', ['$scope', 'mealFactory', function ($scope, mealFactory) {


    $('.btn-main').click( function() {
        //$(this).addClass('active').siblings().removeClass('active');
        $(this).toggleClass('active');
    });

    $scope.meal = {};
    $scope.tags = [];
    $scope.currencies = ['₪','$','€'];
    $scope.currency = $scope.currencies[0];
    $scope.dropdown = false;

    $scope.init = function (){

    };
    $scope.chngCurr = function(curren) {
        $scope.currency = curren;
    };
    $scope.$flow = {};

    $scope.submit = function(){
        var meal = $scope.meal;

        mealFactory.create(meal).success(function(data) {
            alert ("meal saved!" + "  " + data);
        }).error(function(data) {
            alert(data);
        });
        //update meal
    }

}]);