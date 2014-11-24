'use strict';

describe('Ons App', function() {

    it('should redirect index.html to index.html#/ons-command/rest/persons', function() {
        browser.get('index.html');
        browser.getLocationAbsUrl().then(function(url) {
            expect(url.split('#')[1]).toBe('/persons');
        });
    });

    describe('Etherton Person list view', function() {
        beforeEach(function() {
            browser.get('http://localhost:8000/app/index.html#/persons');
        });

        it('should display persons page', function() {
            var personList = element.all(by.repeater('personDetails in persons | bla | males: true | orderBy:orderProp'));
            expect(personList.count()).toBeGreaterThan(0);
            expect(personList.get(0).getText()).toContain('SAMUEL');
        });

        it('should add new person to list', function() {



        })

    });

    describe('Surname list view', function() {


        beforeEach(function() {
            browser.get('http://localhost:8000/app/index.html#/surnames');
        });
        it('should display surnames page', function() {
            var history = element.all(by.repeater('surname in surnames'));
            expect(history.count()).toBeGreaterThan(0);
        });

    });

    describe('Location list view', function() {


        beforeEach(function() {
            browser.get('http://localhost:8000/app/index.html#/locations');
        });
        it('should display locations page', function() {
            var history = element.all(by.repeater('location in locations'));
            expect(history.count()).toBeGreaterThan(0);
        });

    });



});
