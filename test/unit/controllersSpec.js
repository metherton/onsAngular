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

    beforeEach(module('onsApp'));
    beforeEach(module('onsServices'));

    describe('PersonListCtrl', function(){
        var scope, ctrl, $httpBackend;
        beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
            $httpBackend = _$httpBackend_;
            $httpBackend.expectGET('http://localhost:8080/ons-command/rest/persons').
                respond({personDetails : [{person: {surname:'Etherton',firstName:'Mark', birthDate: 2}}, {person : {surname:'Etherton',firstName:'Samuel', birthDate: 1}}]});

            $httpBackend.expectGET('partials/personList.html').respond({});


            scope = $rootScope.$new();
            ctrl = $controller('PersonListCtrl', {$scope: scope});
        }));


        it('should create "persons" model with 2 persons fetched from xhr', function() {
            $httpBackend.flush();

            expect(scope.personsForm).toEqualData(
                {personDetails : [{person: {surname:'Etherton',firstName:'Mark', birthDate: 2}}, {person : {surname:'Etherton',firstName:'Samuel', birthDate: 1}}]});
        });

    });

});