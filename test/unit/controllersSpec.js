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

        beforeEach(inject(function($rootScope, $controller,  _$routeParams_, _$location_, _$route_) {

            var personServiceMock = {
                query: function() {
                    return {personDetails : [{person: {surname:'Etherton',firstName:'Mark', birthDate: 2}}, {person : {surname:'Etherton',firstName:'Samuel', birthDate: 1}}]};
                }
            };

//            spyOn(personServiceMock, 'query').andReturn({personDetails : [{person: {surname:'Etherton',firstName:'Mark', birthDate: 2}}, {person : {surname:'Etherton',firstName:'Samuel', birthDate: 1}}]});


//            $httpBackend = _$httpBackend_;
//            $httpBackend.expectGET('http://localhost:8080/ons-command/rest/persons').
//                respond({personDetails : [{person: {surname:'Etherton',firstName:'Mark', birthDate: 2}}, {person : {surname:'Etherton',firstName:'Samuel', birthDate: 1}}]});
//
//            $httpBackend.expectGET('partials/personList.html').respond({});

           // personService = _personService_;
            $routeParams = _$routeParams_;
            $location = _$location_;
            $route = _$route_;

            scope = $rootScope.$new();
            ctrl = $controller('PersonListCtrl', {$scope: scope, personService: personServiceMock});
        }));


        it('should create "persons" model with 2 persons fetched from xhr', function() {

            expect(scope.personsForm).toEqualData(
                {personDetails : [{person: {surname:'Etherton',firstName:'Mark', birthDate: 2}}, {person : {surname:'Etherton',firstName:'Samuel', birthDate: 1}}]});
        });

    });

    describe('SurnameListCtrl', function(){

        var scope, ctrl, surnameService, $routeParams, $location, $route;


        beforeEach(module('onsApp'));

        beforeEach(inject(function($rootScope, $controller, _$routeParams_, _$location_, _$route_) {

            var surnameServiceMock = {
                query: function() {
                    return [{entityId:1,surname:'etherton'},{entityId:2, surname:'wilkinson'}];
                }
            };

            $routeParams = _$routeParams_;
            $location = _$location_;
            $route = _$route_;

            scope = $rootScope.$new();
            ctrl = $controller('SurnameListCtrl', {$scope: scope, surnameService: surnameServiceMock});
        }));


        it('should create "surnames" model with 2 surnames fetched from xhr', function() {

            expect(scope.surnames).toEqualData(
                [{entityId:1,surname:'etherton'},{entityId:2, surname:'wilkinson'}]);
        });

    });



});