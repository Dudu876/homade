/**
 * Created by Dudu on 19/03/2016.
 */

homadeApp.controller('addMealCtrl', ['$scope', function ($scope) {


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

    $scope.submit = function(){
        var meal = $scope.meal;

        //update meal
    }

}]);