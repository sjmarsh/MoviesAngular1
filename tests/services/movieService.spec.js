window.assert = chai.assert;

describe('movieService', function(){

  var movieService,
      $httpBackend,
      apiUrl = 'http://localhost:8080/movies';
  
  var EnvironmentConfig = {"api" : apiUrl };

  beforeEach(function(){
    module('MoviesApp');

    //mock out the environment config so we can fake values for testing
    angular.module("MoviesApp.config", [])
      .constant("EnvironmentConfig", {"api":apiUrl});

    inject(function(_movieService_, _$httpBackend_, _EnvironmentConfig_){
      movieService = _movieService_;
      $httpBackend = _$httpBackend_; 
      EnvironmentConfig = _EnvironmentConfig_;
    })
  })
  
  describe('#getMovies', function(){
    
    it('should get movies from configured api url with paging', function(){
      var skip = 1;
      var take = 2;

      var expectedCall = EnvironmentConfig.api + '/api/movies' + '?skip=' + skip + '&take=' + take;
      $httpBackend.expectGET(expectedCall).respond(200, {message: 'Ook.', data:['movie1', 'movie2']});
       
      movieService.getMovies(skip, take);

      $httpBackend.flush();
    })

    it('should get movies from configured api url without paging', function(){
      var expectedCall = EnvironmentConfig.api + '/api/movies';
      $httpBackend.expectGET(expectedCall).respond(200, {message: 'Ook.', data:['movie1', 'movie2']});
       
      movieService.getMovies();

      $httpBackend.flush();
    })

 

    afterEach(function() {
     $httpBackend.verifyNoOutstandingExpectation();
     $httpBackend.verifyNoOutstandingRequest();
   });
  });

})