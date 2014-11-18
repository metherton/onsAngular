	'use strict';

/* Controllers */

var onsControllers = angular.module('onsControllers', []);

onsControllers.controller('PersonListCtrl', ['$scope', 'personService', '$routeParams', '$location', '$route',
    function($scope, personService, $routeParams, $location, $route) {

        $scope.personsForm = personService.query();

        $scope.orderProp = 'person.birthDate';

        $scope.addPerson = function(person) {
            personService.addPerson(person).$promise.then($route.reload);
            $scope.personDetails = {};
        };

    }
]);

onsControllers.controller('PersonDetailsCtrl', function($scope, personService, $routeParams, $window) {
    $scope.personDetails = personService.get({personId: $routeParams.personId});
});

onsControllers.controller('SurnameListCtrl', ['$scope', 'surnameService', '$routeParams', '$location', '$route',
    function($scope, surnameService, $routeParams, $location, $route) {
        $scope.surnames = surnameService.query();
    }
]);
