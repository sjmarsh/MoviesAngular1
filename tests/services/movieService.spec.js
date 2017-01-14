window.assert = chai.assert;
window.expect = chai.expect;

describe('movieService', function(){

  // TODO: more testing around response data

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
    });
  });
  
  describe('#getMovies', function(){
    
    it('should get movies from configured api url with paging', function(){
      var skip = 1;
      var take = 2;

      var expectedCall = EnvironmentConfig.api + '/api/movies' + '?skip=' + skip + '&take=' + take;
      $httpBackend.expectGET(expectedCall).respond(200, {message: 'Ook.', data:['movie1', 'movie2']});
       
      movieService.getMovies(skip, take);

      $httpBackend.flush();
    });

    it('should get movies from configured api url without paging', function(){
      var expectedCall = EnvironmentConfig.api + '/api/movies';
      $httpBackend.expectGET(expectedCall).respond(200, {message: 'Ook.', data:['movie1', 'movie2']});
       
      movieService.getMovies();

      $httpBackend.flush();
    });
  });

  describe('#getMoviesByQuery', function(){
    it('get movies with title', function(){
      var title = 'super';
            
      var expectedCall = EnvironmentConfig.api + `/api/movies?searchFilter=${title}`;
      $httpBackend.expectGET(expectedCall).respond(200, {message: 'Ook.', data:['movie1', 'movie2']});
       
      movieService.getMoviesByQuery(title);

      $httpBackend.flush();
    });

    it('get movies with categories', function(){
      var title = 'super';
      var categories = ['comedy', 'action'];
      
      var expectedCall = EnvironmentConfig.api + `/api/movies?searchFilter=${title}&categories=${categories[0]}&categories=${categories[1]}`;
      $httpBackend.expectGET(expectedCall).respond(200, {message: 'Ook.', data:['movie1', 'movie2']});
       
      movieService.getMoviesByQuery(title, categories);

      $httpBackend.flush();
    });

    it('get movies with title categories and paging', function(){
      var title = 'super';
      var categories = ['comedy', 'action'];
      var skip = 1;
      var take = 10;

      var expectedCall = EnvironmentConfig.api + `/api/movies?searchFilter=${title}&categories=${categories[0]}&categories=${categories[1]}&skip=${skip}&take=${take}`;
      $httpBackend.expectGET(expectedCall).respond(200, {message: 'Ook.', data:['movie1', 'movie2']});
       
      movieService.getMoviesByQuery(title, categories, skip, take);

      $httpBackend.flush();
    });

  });

  describe('#getMovie', function(){
    it('get movie with movie id', function(){
      var movieId = 100;

      var expectedCall = EnvironmentConfig.api + `/api/movies/${movieId}`;
      $httpBackend.expectGET(expectedCall).respond(200, {message: 'Ook.', data:'movie'});

      movieService.getMovie(movieId);

      $httpBackend.flush();
    });

    it('should return movie when getting movie with id', function(){
      var movieId = 100;
      var movie = {title: 'super', category:'action'};
      var movieResponse = null;

      var expectedCall = EnvironmentConfig.api + `/api/movies/${movieId}`;
      $httpBackend.expectGET(expectedCall).respond(200, {message: 'Ook.', data:movie});

      movieService.getMovie(movieId)
        .success(function(response){
          movieResponse = response;
        });

      $httpBackend.flush();

      expect(movieResponse.data).to.deep.equal(movie);
    });


  });  

  afterEach(function() {
     $httpBackend.verifyNoOutstandingExpectation();
     $httpBackend.verifyNoOutstandingRequest();
   });
})