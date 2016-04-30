/**
 * Created by Michael on 3/16/2016.
 */
homadeApp.controller('mainPageCtrl', ['$scope', '$location', function ($scope, $location) {

    $scope.search = {};

    $scope.search = function() {
        $location.url('/Result?q=' + $scope.search.text);
    };
}]);