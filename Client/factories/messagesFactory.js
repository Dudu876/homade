/**
 * Created by Dudu on 31/05/2016.
 */
var messagesURL = '/api/messages/';
var messagesRecievedURL = '/api/messages/received/';

homadeApp.factory('messageFactory', ['$http', function($http) {

    return {
        get: function(fbId1,fbId2) {
            return $http.get(messagesURL + fbId1 + ',' + fbId2);
        },
        post: function(message) {
            return $http.post(messagesURL, message);
        },
        getOnlyReceived: function(fbId){
            return $http.get(messagesRecievedURL +fbId);
        }
    }
}]);