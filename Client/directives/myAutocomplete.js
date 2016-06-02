/**
 * Created by Dudu on 28/05/2016.
 */
homadeApp.directive('autoComplete', function($timeout) {
    return {
        restrict: "A",
        scope: {
            uiItems: "="
        },
        link: function(scope, iElement, iAttrs) {
            scope.$watchCollection('uiItems', function(val) {
                console.log(val);
                iElement.autocomplete({
                    source: scope.uiItems,
                    messages: {
                        noResults: '',
                        results: function() {}
                    },
                    select: function() {
                        $timeout(function() {
                            iElement.trigger('input');
                        }, 0);
                    }
                });
            });
        }
    }
});
