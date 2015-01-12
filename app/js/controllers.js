	'use strict';

/* Controllers */

var onsControllers = angular.module('onsControllers', ['ui.grid', 'ui.grid.pagination']);

onsControllers.controller('PersonListCtrl', ['$scope', 'personService', '$routeParams', '$location', '$route', '$modal', '$log', '_', 'moment',
    function($scope, personService, $routeParams, $location, $route, $modal, $log, _, moment) {

        $scope.gridOptions = {};
        $scope.gridOptions.onRegisterApi = function (gridApi) {
            $scope.gridApi = gridApi;
        };

        $scope.gridOptions.filterOptions = $scope.filterOptions;


        personService.query().$promise.then(function(data) {
                $scope.surnames = data.surnames;
                $scope.fathers = data.fatherDetails;
                $scope.mothers = data.motherDetails;

                var deathMoment = moment(data.deathDate);

                _(data.employees).forEach(function(employeeType) {
                    _.map(employeeType, function(employee) {
                        employee.isActive = employee.isActiveSoon = employee.isInactive = false;
                        if (employee.startDate < Date.now()) {
                            employee.isActive = true;
                        } else if (employee.startDate < (Date.now() + 200000)) {
                            employee.isActiveSoon = true;
                        } else {
                            employee.isInactive = true;
                        }
                    });
                });

                $scope.gridOptions.data = data.personDetails;
            }
        );

        $scope.filterOptions = {
            filterText: 'Surname:capitalize'
        };

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

    $scope.myMarkers = [];

    $scope.addMarker = function($event, $params) {
        $scope.myMarkers.push(new google.maps.Marker({
            map: $scope.myMap,
            position: $params[0].latLng
        }));
    };

    $scope.openMarkerInfo = function(marker) {
        $scope.currentMarker = marker;
        $scope.currentMarkerLat = marker.getPosition().lat();
        $scope.currentMarkerLng = marker.getPosition().lng();
        $scope.myInfoWindow.open($scope.myMap, marker);
    };

    $scope.setMarkerPosition = function(marker, lat, lng) {
        marker.setPosition(new google.maps.LatLng(lat, lng));
    };

    $scope.mapOptions = {
        center: new google.maps.LatLng(35.784, -78.670),
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

});

onsControllers.controller('AddCensusHouseholdEntryCtrl', function ($scope, $modalInstance, censuses, locations, persons) {

    $scope.censuses = censuses;
    $scope.persons = persons;
    $scope.personOptions = persons;
    $scope.locations = locations;
    $scope.locationOptions = locations;

    $scope.change = function() {
        console.log($scope.censusHouseholdEntry.censusHousehold.census.entityId);

        $scope.selectedCountryId = _($scope.censuses).filter(function(census) {
            return $scope.censusHouseholdEntry.censusHousehold.census.entityId == census.entityId;
        }).first().country.entityId;

        $scope.selectedYearId = _($scope.censuses).filter(function(census) {
            return $scope.censusHouseholdEntry.censusHousehold.census.entityId == census.entityId;
        }).first().year;

//        var flattenedCensusData = _(data.censusHouseholdEntries).values().flatten(true).map(function (h) { var birthYear = new Date(h.person.birthDate); h.person.age = h.censusHousehold.census.year - birthYear.getFullYear();return h;}).value();
//        $scope.gridOptions.data = flattenedCensusData;
//        $scope.censuses = data.censuses;
//        $scope.locations = data.locations;
//        $scope.persons = data.persons;

        $scope.locationOptions = _($scope.locations).filter(function(location) {
            return location.country.entityId==$scope.selectedCountryId;
        }).value();

        $scope.personOptions = _($scope.persons).filter(function(person) {
            return (new Date(person.birthDate)).getFullYear() <= $scope.selectedYearId;
        }).value();

    }

    $scope.isEmpty = function(value) {
        return value === undefined;
    }

    $scope.ok = function () {
        $modalInstance.close($scope.censusHouseholdEntry);
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
                $scope.locations = data.locations;
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

onsControllers.controller('CensusListCtrl', ['$scope', 'censusService', '$routeParams', '$location', '$route', '$modal', '$log', 'moment',
    function($scope, censusService, $routeParams, $location, $route, $modal, $log, moment) {

        $scope.gridOptions = {};
        $scope.gridOptions.onRegisterApi = function (gridApi) {
            $scope.gridApi = gridApi;
        };

        censusService.query().$promise.then(function(data) {
            var flattenedCensusData = _(data.censusHouseholdEntries).values().flatten(true).map(function (h) { var birthYear = new Date(h.person.birthDate); h.person.age = h.censusHousehold.census.year - birthYear.getFullYear();return h;}).value();
            $scope.gridOptions.data = flattenedCensusData;
            $scope.censuses = data.censuses;
            $scope.locations = data.locations;
            $scope.persons = data.persons;
        });

        $scope.gridOptions.columnDefs = [
            { field: 'censusHousehold.census.year', displayName: 'Year'},
            { field: 'censusHousehold.census.country.name', displayName: 'Country'},
            { field: 'person.firstName', displayName: 'First Name'},
            { field: 'person.surname.surname', displayName: 'Surname'},
            { field: 'person.age', displayName: 'Age'},
            { field: 'censusHousehold.location.addressLine1', displayName: 'Address Line 1'},
            { field: 'censusHousehold.location.city', displayName: 'City'},
            { field: 'censusHousehold.location.country.name', displayName: 'Country'}
            ];

        $scope.addCensusHouseholdEntry = function(censusHouseholdEntry) {
            censusService.addCensusHouseholdEntry(censusHouseholdEntry).$promise.then($route.reload);
            $scope.censusHouseholdEntry = {};
        };


        $scope.open = function (size) {

            var modalInstance = $modal.open({
                resolve: {
                    censuses: function() {
                        return $scope.censuses;
                    },
                    locations: function() {
                        return $scope.locations;
                    },
                    persons: function() {
                        return $scope.persons;
                    }
                },
                templateUrl: 'addCensusHouseholdEntryForm.html',
                controller: 'AddCensusHouseholdEntryCtrl',
                size: size
            });

            modalInstance.result.then(function (censusHouseholdEntry) {
                censusService.addCensusHouseholdEntry(censusHouseholdEntry).$promise.then($route.reload);
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };




    }
]);

onsControllers.controller('HomeCtrl', ['$scope', 'baseUrl', function ($scope, baseUrl) {

    $scope.myInterval = 5000;
    var slides = $scope.slides = [];

    $scope.addSlide = function() {
        var newWidth = 600 + slides.length + 1;
        slides.push({
            image: baseUrl + 'images/' + newWidth + '/300.jpg',
            text: ['Sidney Etherton','Sidney Etherton','Sydney Etherton','Sydney Etherton', 'Martin Etherton', 'Herbert Wilkinson'][slides.length % 6] + ' ' +
                ['1917', '1919', '1931', '1935', '1967', '1927'][slides.length % 6]
        });
    };
    for (var i=0; i<6; i++) {
        $scope.addSlide();
    }

}]);

//function isEmpty(value) {
//    return angular.isUndefined(value) || value === '' || value === null || value !== value;
//}

//onsControllers.directive('minValue', function(_) {
//
//    return {
//        restrict: 'A',
//        require: 'ngModel',
//        link: function(scope, elem, attr, ctrl) {
//            scope.$watch(attr.minValue, function () {
//                ctrl.$setViewValue(ctrl.$viewValue);
//            });
//            var minValidator = function (value) {
//                var min = scope.$eval(attr.minValue) || 0;
//                if (!_.isEmpty(value) && value < min) {
//                    ctrl.$setValidity('minValue', false);
//                    return undefined;
//                } else {
//                    ctrl.$setValidity('minValue', true);
//                    return value;
//                }
//            };
//            ctrl.$parsers.push(minValidator);
//            ctrl.$formatters.push(minValidator);
//        }
//
//
//    };
//
//});

onsControllers.directive('minValue', function(_) {

    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            console.log(ctrl.$validators);
            console.log(attrs.minValue);
            ctrl.$validators.minValue = function(modelValue, viewValue) {
                if (ctrl.$isEmpty(modelValue)) {
                    // consider empty models to be valid
                    return true;
                }
                var min = scope.$eval(attrs.minValue) || 0;
                if (!_.isEmpty(value) && value < min) {
                    return false;
                }
                return true;
            };
        }
    };
});