(function(angular) {
    "use strict";

    angular
        .module('ngDirectory', [])
        .constant('ngDirectoryConfig', {
            keyProperty: 'id',
            displayProperty: 'title',
            emptyValue: '&mdash;',
            formatResult: function(arr) {
                return [].join.call(arr, ', ');
            }
        })
        .directive('ngDirectory', ['ngDirectoryConfig', function(directoryConfig) {
            var options = {};

            var multipleValue = function (keys, source) {
                return [].concat.apply([], keys.map(function (key) { return singleValue(key, source); }));
            };

            var singleValue = function (key, source) {
                return source
                    .filter(function (kv) { return kv[options.keyProperty] === key; })
                    .map(function (kv) { return kv[options.displayProperty] });
            };

            var link = function ($scope, elem) {
                if (typeof $scope.key == 'undefined' || typeof $scope.source == 'undefined') {
                    throw 'Key and source properties are required with ngDirectory directive';
                }

                options = angular.extend({}, directoryConfig, $scope.options);

                var action = Array.isArray($scope.key) ? multipleValue : singleValue;
                var result = action($scope.key, $scope.source);

                if(typeof options.format == 'function') {
                    result = result.map(options.format);
                }

                elem.html(options.formatResult(result) || options.emptyValue);
            }.bind(this);

            return {
                restrict: 'A',
                scope: {
                    key: '=',
                    source: '=',
                    options: '='
                },
                link: link
            };
        }]);
})(angular);