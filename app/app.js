'use strict';


var onsApp = angular.module('onsApp', ['ngRoute', 'onsControllers', 'onsServices']);

onsApp.directive('personList', function() {
        return {
            controller: function($scope) {

                $scope.delete = function(person) {
                    $scope.personsForm.persons.splice($scope.persons.indexOf(person), 1);
                }
            },
            restrict: 'E',
            replace: true,
            scope: {
                persons: '=',
                orderProp: '='
            },
            templateUrl: 'personList.html'
            //  template: "hello {{orderProp}}"
        };
    }
);

onsApp.directive('showPersonDetails', function($location) {
    return function link(scope, element, attrs) {
        element.on('click', function() {
            $location.url('/persons/' + attrs.showPersonDetails);
        });
    }
});


onsApp.directive('sortName', function() {
    return {
        link: function(scope, elm, attrs) {
            elm.on('click', function() {
                if (attrs.sortName != scope.orderProp) {
                    scope.orderProp = attrs.sortName
                }
                scope.$apply();
            });
        }
    }
});

function uppercase(str) {
    if(angular.isString(str)) {
        return str.toUpperCase();
    }
    else {
        return str;
    }
}

onsApp.filter('bla', function() {
    return function(arr) {
        var result = [];
        if (angular.isDefined(arr)) {
            for (var i = 0; i < arr.length; ++i) {
                var personDetails = arr[i];
                var newPersonFirstName =  uppercase(personDetails.person.firstName);
                personDetails.person.firstName = newPersonFirstName;
                result.push(personDetails);
            }
        }
        return result;
    };
});

onsApp.filter('males', function() {
    return function(arr, isMale) {
        var result = [];
        if (angular.isDefined(arr)) {
            for (var i = 0; i < arr.length; ++i) {
                var personDetails = arr[i];
                if (isMale) {
                    if (personDetails.person.gender == 1) {
                        result.push(personDetails);
                    }
                } else {
                    if (personDetails.person.gender == 0) {
                        result.push(personDetails);
                    }
                }
            }
        }
        return result;
    };
});


onsApp.directive('personForm', function() {
    return {
        controller: function($scope, $attrs) {
            $scope.person = {};
            $scope.clickStatus = false;
            if($attrs.controller) {
                $scope.$parent[$attrs.controller] = this;
            }

            $scope.submit = function() {
                if ($scope.addPersonForm.$valid) {
                    $scope.addPerson({person: $scope.person});
                } else {
                    alert("please fill in all details");
                }
            };

            this.clear = function() {
                $scope.person = {};
                $scope.addPersonForm.$setPristine();
            }
        },
        restrict: 'E',
        replace: true,
        scope: {
            addPerson: '&',
            fathers: '=',
            surnames: '=',
            mothers: '='

        },
        templateUrl: 'personForm.html'
    };
});


onsApp.config(function($routeProvider) {
    $routeProvider.when('/persons', {templateUrl: 'partials/personList.html', controller: 'PersonListCtrl'});
    $routeProvider.when('/persons/:personId', {templateUrl: 'partials/personDetails.html', controller: 'PersonDetailsCtrl'});
    $routeProvider.when('/surnames', {templateUrl: 'partials/surnameList.html', controller: 'SurnameListCtrl'});
    $routeProvider.when('/surnames/:surnameId', {templateUrl: 'partials/surnameDetails.html', controller: 'SurnameDetailsCtrl'});
    $routeProvider.otherwise({redirectTo: '/persons'});
});


onsApp.filter('personUrl', function() {
    return function(person) {
        return '#/persons/' + person.id;
    }
});


onsApp.filter('capitalize', function() {
    return function(surname) {
        var surnameMap = [];
        surnameMap['etherton'] = 'ETHERTON';
        surnameMap['wilkinson'] = 'WILKINSON';
        return surnameMap[surname];
    }
});

