'use strict';

/* jasmine specs for controllers go here */
describe('Ons controllers', function() {


    beforeEach(function(){
        this.addMatchers({
            toEqualData: function(expected) {
                return angular.equals(this.actual, expected);
            }
        });
    });

//    beforeEach(module('onsApp'));
//    beforeEach(module('onsServices'));

    describe('PersonListCtrl', function(){

        var scope, ctrl, personService, $routeParams, $location, $route;

        beforeEach(module('onsApp'));

        beforeEach(inject(function($rootScope, $controller,  _$routeParams_, _$location_, _$route_, _personService_) {

            personService = _personService_;

            spyOn(personService, 'query').andReturn({personDetails : [{person: {surname:'Etherton',firstName:'Mark', birthDate: 2}}, {person : {surname:'Etherton',firstName:'Samuel', birthDate: 1}}]});

            $routeParams = _$routeParams_;
            $location = _$location_;
            $route = _$route_;

            scope = $rootScope.$new();
            ctrl = $controller('PersonListCtrl', {$scope: scope, personService: personService});
        }));


        it('should create "persons" model with 2 persons fetched from xhr', function() {
            expect(scope.personsForm).toEqualData(
                {personDetails : [{person: {surname:'Etherton',firstName:'Mark', birthDate: 2}}, {person : {surname:'Etherton',firstName:'Samuel', birthDate: 1}}]});
        });

    });

    describe('SurnameListCtrl', function(){

        var scope, ctrl, surnameService, $routeParams, $location, $route;


        beforeEach(module('onsApp'));

        beforeEach(inject(function($rootScope, $controller, _$routeParams_, _$location_, _$route_, _surnameService_) {
            surnameService = _surnameService_;
            spyOn(surnameService, 'query').andReturn([{entityId:1,surname:'etherton'},{entityId:2, surname:'wilkinson'}]);

            $routeParams = _$routeParams_;
            $location = _$location_;
            $route = _$route_;

            scope = $rootScope.$new();
            ctrl = $controller('SurnameListCtrl', {$scope: scope, surnameService: surnameService});
        }));


        it('should create "surnames" model with 2 surnames fetched from xhr', function() {

            expect(scope.surnames).toEqualData(
                [{entityId:1,surname:'etherton'},{entityId:2, surname:'wilkinson'}]);
        });

    });

    describe('LocationListCtrl', function(){

        var scope, ctrl, locationService, $routeParams, $location, $route;


        beforeEach(module('onsApp'));

        beforeEach(inject(function($rootScope, $controller, _$routeParams_, _$location_, _$route_, _locationService_) {
            locationService = _locationService_;
            spyOn(locationService, 'query').andReturn([{entityId:1,name:'united kingdom', code: 'uk'},{entityId:2, name:'netherlands', code:'nl'}]);

            $routeParams = _$routeParams_;
            $location = _$location_;
            $route = _$route_;

            scope = $rootScope.$new();
            ctrl = $controller('LocationListCtrl', {$scope: scope, locationService: locationService});
        }));


        it('should create "locations" model with 2 locations fetched from xhr', function() {

            expect(scope.locations).toEqualData(
                [{entityId:1,name:'united kingdom', code:'uk'},{entityId:2, name:'netherlands', code:'nl'}]);
        });

    });




});