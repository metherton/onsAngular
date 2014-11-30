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

onsControllers.controller('AddSurnameCtrl', function ($scope, $modalInstance) {

    $scope.ok = function () {
        $modalInstance.close($scope.surname);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});

onsControllers.controller('LocationListCtrl', ['$scope', 'locationService', '$routeParams', '$location', '$route',
    function($scope, locationService, $routeParams, $location, $route) {

        $scope.locationsForm = locationService.query();

        $scope.addLocation = function(location) {
            locationService.addLocation(location).$promise.then($route.reload);
            $scope.location = {};
        };

    }
]);

onsControllers.controller('SurnameListCtrl', ['$scope', 'surnameService', '$routeParams', '$location', '$route', '$modal', '$log',
    function($scope, surnameService, $routeParams, $location, $route, $modal, $log) {
     //   $scope.surnames = surnameService.query();

        $scope.surnamesForm = surnameService.query();

        $scope.addSurname = function(surname) {
            surnameService.addSurname(surname).$promise.then($route.reload);
            $scope.surname = {};
        };

        $scope.open = function (size) {

            var modalInstance = $modal.open({
                templateUrl: 'addSurnameForm.html',
                controller: 'AddSurnameCtrl',
                size: size
            });

            modalInstance.result.then(function (surname) {
                surnameService.addSurname(surname).$promise.then($route.reload);
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };


    }
]);
