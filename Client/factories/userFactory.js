/**
 * Created by Michael on 4/8/2016.
 */
homadeApp.factory('userFactory', function($rootScope){
    return {
        fbId: '',
        isChefUpdate: function(data) {
            $rootScope.$broadcast('isChefUpdate', data);
        }
    }
});