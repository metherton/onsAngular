	'use strict';

/* Controllers */

var onsControllers = angular.module('onsControllers', ['ui.grid', 'ui.grid.pagination']);

onsControllers.controller('PersonListCtrl', ['$scope', 'personService', '$routeParams', '$location', '$route', '$modal', '$log', '_',
    function($scope, personService, $routeParams, $location, $route, $modal, $log, _) {

        $scope.gridOptions = {};
        $scope.gridOptions.onRegisterApi = function (gridApi) {
            $scope.gridApi = gridApi;
        };

        personService.query().$promise.then(function(data) {
                $scope.surnames = data.surnames;
                $scope.fathers = data.fatherDetails;
                $scope.mothers = data.motherDetails;

                _(data.employees).forEach(function(employeeType) {
                    _(employeeType).forEach(function(employee) {
                        if (employee.startDate < Date.now()) {
                            employee.isActive = true;
                        } else if (employee.startDate < (Date.now() + 200000)) {
                            employee.isActiveSoon = true;
                        }
                    });
                });

            //    var mappedValues = _.map([1, 2, 3], function(n) { return n * 3; });

                $scope.gridOptions.data = data.personDetails;
            }
        );

        $scope.gridOptions.columnDefs = [
            { field: 'person.firstName', displayName: 'First Name'},
            { field: 'person.surname.surname', displayName: 'Surname'},
            { field: 'birthDate', displayName: 'Date Of Birth'},
            { field: 'fatherDetails', displayName: 'Father'},
            { field: 'motherDetails', displayName: 'Mother'}
        ];


        $scope.addPerson = function(person) {
            personService.addPerson(person).$promise.then($route.reload);
            $scope.personDetails = {};
        };

        $scope.open = function (size) {

            var modalInstance = $modal.open({
                resolve: {
                    surnames: function() {
                        return $scope.surnames;
                    },
                    fathers: function() {
                        return $scope.fathers;
                    },
                    mothers: function() {
                        return $scope.mothers;
                    }
                },
                templateUrl: 'addPersonForm.html',
                controller: 'AddPersonCtrl',
                size: size
            });

            modalInstance.result.then(function (person) {
                personService.addPerson(person).$promise.then($route.reload);
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

    }
]);

onsControllers.controller('PersonDetailsCtrl', function($scope, personService, $routeParams, $window) {
    $scope.personDetails = personService.get({personId: $routeParams.personId});
});

onsControllers.controller('AddSurnameCtrl', function ($scope, $modalInstance) {

    $scope.change = function() {
        console.log('changed');
    }

    $scope.isEmpty = function(value) {
        return value === undefined;
    }

    $scope.ok = function () {
        $modalInstance.close($scope.surname);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});

onsControllers.controller('AddLocationCtrl', function ($scope, $modalInstance, countries) {

    $scope.countries = countries;

    $scope.change = function() {
        console.log('changed');
    }

    $scope.isEmpty = function(value) {
        return value === undefined;
    }

    $scope.ok = function () {
        $modalInstance.close($scope.location);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});

onsControllers.controller('AddPersonCtrl', function ($scope, $modalInstance, surnames, fathers, mothers) {

    $scope.surnames = surnames;
    $scope.fathers = fathers;
    $scope.mothers = mothers;

    $scope.person = {};

    $scope.change = function() {
        console.log('changed');
    }

    $scope.isEmpty = function(value) {
        return value === undefined;
    }

    $scope.ok = function () {
        $modalInstance.close($scope.person);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.today = function() {
        $scope.person.birthDate = new Date();
    };
    $scope.today();

    $scope.clear = function () {
        $scope.person.birthDate = null;
    };

    // Disable weekend selection
    $scope.disabled = function(date, mode) {
        return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
    };

    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];






});



onsControllers.controller('LocationListCtrl', ['$scope', 'locationService', '$routeParams', '$location', '$route', '$modal', '$log',
    function($scope, locationService, $routeParams, $location, $route, $modal, $log) {

        $scope.gridOptions = {};
        $scope.gridOptions.onRegisterApi = function (gridApi) {
            $scope.gridApi = gridApi;
        };

        locationService.query().$promise.then(function(data) {
                $scope.countries = data.countries;
                $scope.gridOptions.data = data.locations;
            }
        );

        $scope.gridOptions.columnDefs = [
            { field: 'addressLine1', displayName: 'Address Line 1'},
            { field: 'addressLine2', displayName: 'Address Line 2'},
            { field: 'city', displayName: 'City'},
            { field: 'postCode', displayName: 'Post Code'},
            { field: 'country.name', displayName: 'Country'}
        ];


    //    $scope.locationsForm = locationService.query();

        $scope.addLocation = function(location) {
            locationService.addLocation(location).$promise.then($route.reload);
            $scope.location = {};
        };

        $scope.open = function (size) {

            var modalInstance = $modal.open({
                resolve: {
                    countries: function() {
                        return $scope.countries;
                    }
                },
                templateUrl: 'addLocationForm.html',
                controller: 'AddLocationCtrl',
                size: size
            });

            modalInstance.result.then(function (location) {
                locationService.addLocation(location).$promise.then($route.reload);
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
    }
]);

onsControllers.controller('SurnameListCtrl', ['$scope', 'surnameService', '$routeParams', '$location', '$route', '$modal', '$log',
    function($scope, surnameService, $routeParams, $location, $route, $modal, $log) {

        $scope.gridOptions = {};
        $scope.gridOptions.onRegisterApi = function (gridApi) {
            $scope.gridApi = gridApi;
        };

        surnameService.query().$promise.then(function(data) {
                $scope.gridOptions.data = data.surnames;
            }
        );

        $scope.gridOptions.columnDefs = [
            { field: 'surname', displayName: 'Surname'}
        ];

        $scope.addSurname = function(surname) {
            surnameService.addSurname(surname).$promise.then($route.reload);
            $scope.surname = {};
        };

//        $scope.surnamesForm.surnames = [
//            {
//                "firstName": "Cox",
//                "lastName": "Carney",
//                "company": "Enormo",
//                "employed": true
//            },
//            {
//                "firstName": "Lorraine",
//                "lastName": "Wise",
//                "company": "Comveyer",
//                "employed": false
//            },
//            {
//                "firstName": "Nancy",
//                "lastName": "Waters",
//                "company": "Fuelton",
//                "employed": false
//            }
//        ];


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
