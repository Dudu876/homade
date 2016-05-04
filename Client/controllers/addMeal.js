/**
 * Created by Dudu on 19/03/2016.
 */

homadeApp.controller('addMealCtrl', ['$scope', 'mealFactory', 'userFactory', 'Upload', function ($scope, mealFactory, userFactory, Upload) {


    $('.btn-main').click( function() {
        $(this).addClass('active').siblings().removeClass('active');
        //$(this).toggleClass('active');
    });

    $scope.meal = {};
    $scope.tags = [];
    $scope.currencies = ['₪','$','€'];
    $scope.currency = $scope.currencies[0];
    $scope.dropdown = false;

    //$scope.meal.file = {};

    $scope.init = function (){

    };
    $scope.chngCurr = function(curren) {
        $scope.currency = curren;
    };
    $scope.$flow = {};

    $scope.setType = function(type) {
        $scope.meal.type = type;
    };

    $scope.submit = function(){
        if (!$scope.meal.type) {
            alert('No type selected. Select one.');
            //$('.btn-group').focus();
            //$('html, body').animate({ scrollTop: $('#type').offset().top }, 'slow');
            $("#type").attr("tabindex",-1).focus();
            return;
        }
        if (!$scope.form.$valid){
            alert('Form is invalid. Fix it');
            return;
        }
        if (!$scope.meal.file) {
            alert('Please add an image. No Image, No Meal!');
            return;
        }

        var meal = $scope.meal;
        meal.chefFBId = userFactory.fbId;

        mealFactory.create(meal).success(function(data) {
            alert ("meal saved!" + "  " + data);
        }).error(function(data) {
            alert(data);
        });

        upload($scope.meal.file); //call upload function
        //update meal
    };

    function upload(file) {
        Upload.upload({
            url: '/upload', //webAPI exposed to upload the file
            data:{file:file} //pass file as data, should be user ng-model
        }).then(function (resp) { //upload function returns a promise
            if(resp.data.error_code === 0){ //validate success
                alert('Success ' + resp.config.data.file.name + 'uploaded. Response: ');
            } else {
                alert('an error occured');
            }
        }, function (resp) { //catch error
            console.log('Error status: ' + resp.status);
            alert('Error status: ' + resp.status);
        }, function (evt) {
            console.log(evt);
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
            $scope.meal.file.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
        });
    }
}]);