/**
 * Created by Michael on 4/28/2016.
 */
homadeApp.controller('clientOrdersCtrl', ['$scope','$rootScope', 'ordersFactory', 'chefsFactory', 'userFactory', 'messageFactory', 'ezfb', '$uibModal', function ($scope, $rootScope, ordersFactory, chefsFactory, userFactory, messageFactory, ezfb, $uibModal) {
    var statusesArr = ['Order Received', 'Cooking', 'Ready', 'Taken'];

    $rootScope.loading = 0;
    $rootScope.loading++;

    $scope.$on('isChefUpdate', function (event, args) {
        ordersFactory.getActiveOrdersByClient(userFactory.fbId).success(function (data) {
            updateChefNamesAndFillOrders(data);
        });
    });

    $scope.saveOrder = function(data) {
        ordersFactory.update(data).success(function(res){
            if (!(res == "succesfully saved")) {
                alert('error occured');
            }
        });
    };

    $scope.open = function (order, isComment) {
        var comment = order.comment;
        var title = 'Comment';
        if (!isComment){
            title = 'Message';
            comment = '';
        }
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/commentOnOrder.html',
            controller: 'commentOnOrderCtrl',
            resolve: {
                comment: function () {
                    return comment;
                },
                title: function () {
                    return title;
                }
            }
        });

        modalInstance.result.then(function (result) {
            if (isComment) {
                order.comment = result;
                ordersFactory.update(order).success(function (res) {
                    if (!(res == "succesfully saved")) {
                        alert('error occured');
                    }
                    else {
                    }
                });
            }
            else {
                if (result == "" || result === undefined) return;
                var now = new Date();
                var newMessage = {
                    author: {
                        fbId: userFactory.fbId,
                        name: userFactory.fullname
                    },
                    target: {
                        fbId: order.chefFBId
                    },
                    time: now,
                    content: result
                };
                messageFactory.post(newMessage);
            }
        });
    };


    var updateChefNamesAndFillOrders = function(data){
        $scope.orders = data;
        $rootScope.loading += $scope.orders.length - 1;
        $scope.orders.forEach(function(element, index, array) {
            ezfb.api(element.chefFBId + '/picture?height=100&width=100', function (res) {
                if (!res.error)
                {
                    element.chefPic = res.data.url;
                }
                else
                {
                    element.chefPic = "../public/images/BlankPicture.png";
                }

                $rootScope.loading--;
            });
        });
    };

    if (userFactory.fbId != "")
    {
        chefsFactory.isChef(userFactory.fbId).success(function (isChef) {
            if (isChef) {
                ordersFactory.getActiveOrdersByClient(userFactory.fbId).success(function(data) {
                    updateChefNamesAndFillOrders(data);
                });
            }
        });
    }

    $scope.formatDate = function(date){
        var dateOut = new Date(date);
        return dateOut;
    };

    $scope.getStatusName = function(num, includePrefix) {
        var status = "Status: ";

        if (includePrefix)
        {
            return status + statusesArr[num];
        }
        else
        {
            return statusesArr[num];
        }
    };
}]);