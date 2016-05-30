/**
 * Created by Dudu on 28/05/2016.
 */
homadeApp.directive('myAutocomplete', function () {
    return function(scope, element, attrs) {
        element.autocomplete({
            source: scope[attrs.uiItems],
            select: function() {
                $timeout(function() {
                    element.trigger('input');
                }, 0);
            }
        });
    };
});
