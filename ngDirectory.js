(function(angular) {
    "use strict";

    angular
        .module('ngDirectory', [])
        .directive('ngDirectory', function() {
            var options = {
                keyProperty: 'id',
                displayProperty: 'title'
            };

            var multipleValue = function(keys, source) {
                return keys
                    .map(function(key) { return singleValue(key, source); });
            };

            var singleValue = function(key, source) {
                return source
                    .filter(function (kv) { return kv[options.keyProperty] === key; })
                    .map(function (kv) { return kv[options.displayProperty] });
            };

            var link = function($scope, elem) {
                if(typeof $scope.key == 'undefined' || typeof $scope.source == 'undefined') {
                    throw 'Key and source properties are required with directorySource directive';
                }

                options = angular.extend(options, $scope.options);

                var action = Array.isArray($scope.key) ? multipleValue : singleValue;
                var result = action($scope.key, $scope.source);

                elem.html(result.join(', ') || '&mdash;');
            }.bind(this);

            return {
                restrict: 'A',
                scope: {
                    key: '=',
                    source: '=',
                    options: '='
                },
                link: link
            }
        })
})(angular);