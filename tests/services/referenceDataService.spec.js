window.assert = chai.assert;
window.expect = chai.expect;

describe('referenceDataService', function(){
    var referenceDataService,
      $httpBackend,
      apiUrl = 'http://localhost:8080/';
  
    var EnvironmentConfig = {"api" : apiUrl };

    beforeEach(function(){
      module('MoviesApp');

      //mock out the environment config so we can fake values for testing
      angular.module("MoviesApp.config", [])
        .constant("EnvironmentConfig", {"api":apiUrl});

      inject(function(_referenceDataService_, _$httpBackend_, _EnvironmentConfig_){
        referenceDataService = _referenceDataService_;
        $httpBackend = _$httpBackend_; 
        EnvironmentConfig = _EnvironmentConfig_;
      });
    });

    describe('#getCategories', function(){
      it('shouldGetCategoriesFromConfiguredUrl', function(){

        var expectedCall = EnvironmentConfig.api + '/api/referenceData/categories';
        $httpBackend.expectGET(expectedCall).respond(200, {message: 'Ook.', data:['action', 'comedy']});

        referenceDataService.getCategories();

        $httpBackend.flush();
      });
    });
});