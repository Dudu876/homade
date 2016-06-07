/**
 * Created by Dudu on 30/05/2016.
 */
homadeApp.controller('messagesCtrl', [ '$scope', 'userFactory', 'ordersFactory', 'messageFactory', '$rootScope', 'ezfb', function ($scope, userFactory, ordersFactory, messageFactory, $rootScope, ezfb) {

    //$scope.selectedUser = $scope.connections[0].fbId;

    $scope.userSelect = function (con) {
        $scope.selectedUser = con;
        messageFactory.get(userFactory.fbId, con.fbId).success(function(data) {
            $scope.messages = data;
            $scope.messages.forEach(function(element, index, array) {
                updateMessage(element);
            });
        });
    };

    $scope.$on('isChefUpdate', updateConnections);
    if (userFactory.fbId != '') updateConnections();

    function updateConnections() {
        ordersFactory.getConnections(userFactory.fbId).success(function (connections) {
            $scope.connections = connections;
            var i = 0;

            //$scope.connections.forEach(function(element, index, array) {
            //for (i in connections) {
            //    var connection = {};
            //    if (connections[i].chefFBId == userFactory.fbId) {
            //        connection.fbId = connections[i].clientFBId;
            //        connection.type = "Client";
            //    }
            //    else {
            //        connection.fbId = connections[i].chefFBId;
            //        connection.type = "Chef";
            //    }
            //    if (i == 0) $scope.userSelect(connection);
            //    if (containsConnection(connection, $scope.connections, i)){
            //        console.log('found');
            //    }
            //    else {
            //        console.log('not found');
            //    }
            //    $scope.connections.push(connection);
            //    console.log('i before ezfb ' + i);
            //    ezfb.api('/' + connection.fbId, {fields: ['name','picture']}, function (res) {
            //        console.log('i inside ezfb ' + i);
            //        if (res.name === undefined) {
            //            $scope.connections[i].name = "No Name";
            //        }
            //        else {
            //            $scope.connections[i].name = res.name;
            //        }
            //        if (res.picture === undefined) {
            //            $scope.connections[i].pic = "../public/images/BlankPicture.png";
            //        }
            //        else {
            //            $scope.connections[i].pic = res.picture.data.url;
            //        }
            //        //$scope.connections.push(connection);
            //    });
            //}
            $scope.connections.forEach(function(element, index, array) {
                var connection = {};
                if (element.chefFBId == userFactory.fbId) {
                    element.fbId = element.clientFBId;
                    element.type = "Client";
                }
                else {
                    element.fbId = element.chefFBId;
                    element.type = "Chef";
                }
                if (index == 0) $scope.userSelect(element);
                if (containsConnection(element, $scope.connections, index)){
                    console.log('found');
                }
                else {
                    console.log('not found');
                }
                console.log('outside ' + index);
                ezfb.api('/' + element.fbId, {fields: ['name','picture']}, function (res) {
                    console.log('inside ' + index);
                    if (res.name === undefined) {
                        element.name = "No Name";
                    }
                    else {
                        element.name = res.name;
                    }
                    if (res.picture === undefined) {
                        element.pic = "../public/images/BlankPicture.png";
                    }
                    else {
                        element.pic = res.picture.data.url;
                    }
                    //$scope.connections.push(connection);
                    if (index == array.length - 1) $scope.connections = deleteDup($scope.connections);
                });
            });
            console.log('all done');
        });
    }

    $scope.isMe = function(message) {
        return message.author.fbId == userFactory.fbId;
    };

    $scope.send = function() {
        if ($scope.text == "" || $scope.text === undefined) return;
        var now = new Date();
        var newMessage = {
            author: {
                fbId: userFactory.fbId,
                name: userFactory.fullname
            },
            target: {
                fbId: $scope.selectedUser.fbId
            },
            time: now,
            content: $scope.text
        };
        messageFactory.post(newMessage);
        updateMessage(newMessage);
        $scope.messages.push(newMessage);
        $scope.text = "";
    };

    function dateToString(d) {
        return d.getDate() + '/' + d.getMonth() + '/' + d.getFullYear() + ' ' + d.getHours() + ':' + d.getMinutes();
    }

    function updateMessage(message) {
        message.time = dateToString(new Date(message.time));
        if ($scope.isMe(message)) {
            message.pic = userFactory.picture;
        }
        else {
            message.pic = $scope.selectedUser.pic;
        }
    }

    function containsConnection(connection, connections, index) {
        var i = 0;
        for (i in connections) {
            if (i != index) {
                if (connections[i].fbId == connection.fbId) {
                    return true;
                }
            }
        }
        return false;
    }

    function deleteDup(array){
        var newArray = [];
        for (i in array) {
            if (!containsConnection(array[i],newArray,i)) {
                newArray.push(array[i]);
            }
        }
        return newArray;
    }
}]);