/**
 * Created by Michael on 4/8/2016.
 */
homadeApp.factory('userFactory', function($rootScope){
    return {
        fbId: '',
        name: '',
        fullname: '',
        isChefUpdate: function(data) {
            $rootScope.$broadcast('isChefUpdate', data);
        }
    }
});