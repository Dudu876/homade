/**
 * Created by Michael on 5/24/2016.
 */
homadeApp.controller('commentOnOrderCtrl', function ($scope, $uibModalInstance, comment, title) {
    $scope.comment = comment;
    $scope.title = title;
    $scope.ok = function () {
        $uibModalInstance.close($scope.comment);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});