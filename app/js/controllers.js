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


// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.

onsControllers.controller('ModalInstanceCtrl', function ($scope, $modalInstance) {

 //   $scope.items = items;
//    $scope.selected = {
//        item: $scope.items[0]
//    };

  //  $scope.surnameToAdd = addedSurname;

    $scope.ok = function () {
        $modalInstance.close($scope.surname);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});

//onsControllers.controller('LocationListCtrl', ['$scope', 'locationService', '$routeParams', '$location', '$route',
//    function($scope, locationService, $routeParams, $location, $route) {
//        $scope.locations = locationService.query();
//    }
//]);

onsControllers.controller('LocationListCtrl', ['$scope', 'locationService', '$routeParams', '$location', '$route',
    function($scope, locationService, $routeParams, $location, $route) {

        $scope.locationsForm = locationService.query();

        $scope.addLocation = function(location) {
            locationService.addLocation(location).$promise.then($route.reload);
            $scope.location = {};
        };

    }
]);

onsControllers.controller('SurnameListCtrl', ['$scope', 'surnameService', '$routeParams', '$location', '$route', '$modal',
    function($scope, surnameService, $routeParams, $location, $route, $modal) {
     //   $scope.surnames = surnameService.query();

        $scope.surnamesForm = surnameService.query();

        $scope.addSurname = function(surname) {
            surnameService.addSurname(surname).$promise.then($route.reload);
            $scope.surname = {};
        };

  //      $scope.items = ['item1', 'item2', 'item3'];

        $scope.open = function (size) {

            var modalInstance = $modal.open({
                templateUrl: 'myModalContent.html',
                controller: 'ModalInstanceCtrl',
                size: size,
                resolve: {
//                    items: function () {
//                        return $scope.items;
//                    },
                    surname: function() {
                        return $scope.surnamesForm.addedSurname;
                    }
                }
            });

            modalInstance.result.then(function (surname) {
       //         var surname = {surname: 'bla'};
                surnameService.addSurname(surname).$promise.then($route.reload);
                $scope.surname = {};
           //     $scope.selected = selectedItem;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };


    }
]);
