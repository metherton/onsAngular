'use strict';

var onsServices = angular.module('onsServices', ['ngResource']);

onsServices.factory('personService', ['$resource',
  function($resource){
    return $resource('http://localhost:8080/ons-command/rest/persons/:personId', {}, {
      query: {method:'GET', params:{personId:''}, isArray:false},
      addPerson: {method: 'POST'}
    });
  }]
);

onsServices.factory('surnameService', ['$resource',
  function($resource){
	return $resource('http://localhost:8080/ons-command/rest/surnames/:surnameId', {}, {
        query: {method: 'GET', params: {surnameId: ''}, isArray: false},
        addSurname: {method: 'POST'}
    });
  }]
);

onsServices.factory('censusService', ['$resource',
        function($resource){
            return $resource('http://localhost:8080/ons-command/rest/censuses/:censusHouseholdEntryId', {}, {
                query: {method: 'GET', params: {censusHouseholdEntryId: ''}, isArray: false},
                addCensusHouseholdEntry: {method: 'POST'}
            });
        }]
);

onsServices.factory('locationService', ['$resource',
    function($resource){
        return $resource('http://localhost:8080/ons-command/rest/locations/:locationId', {}, {
            query: {method: 'GET', params: {locationId: ''}, isArray: false},
            addLocation: {method: 'POST'}
        });
    }]
);