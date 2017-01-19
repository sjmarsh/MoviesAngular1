var expect = chai.expect;

describe('movieDetailController', function(){
  
  // useful ref for testing http promises: http://stackoverflow.com/questions/17825798/how-do-i-mock-the-result-in-a-http-get-promise-when-testing-my-angularjs-contro

  var scope, location, routeParams, toastr, fakeMovieService, q, deferred;
  var getMovieSpy, toastrSpy;

  beforeEach(function(){
      
      module('MoviesApp');
      
      fakeMovieService = {
          getMovie: function(){
            deferred = q.defer();          
            return deferred.promise;
          }
      };

      getMovieSpy = sinon.spy(fakeMovieService,'getMovie');
                 
      inject(function($controller, $rootScope, $location, $routeParams, _toastr_, $q){
        scope = $rootScope.$new();
        location = $location;
        toastr = _toastr_;
        routeParams = $routeParams;
        q = $q;

        toastrSpy = sinon.spy(toastr, 'error');

        $controller('movieDetailController', {'$scope' : scope, movieService: fakeMovieService});
     })
  });

  it('shouldHavePageClassDefined', function(){
    expect(scope.pageClass).to.be.equal('page-movie-detail');
  });

  it('shouldGoBackToList', function(){
    scope.backToList();
    expect(location.path()).to.be.equal('/');
  });

  it('shouldGetMovie', function(){
    expect(getMovieSpy.calledOnce).to.be.true;
  });

  it('shouldAppyMovieDetailToScope', function(){
    var movieResponse = {data: {title: 'super', category: 'action'}};
    deferred.resolve(movieResponse);
    scope.$apply();
    expect(scope.movieDetail).to.be.equal(movieResponse.data);
  });

  it('shouldToastErrorWhenGettingMovie', function(){
    var errorResponse = { data: 'an error occured!'};
    deferred.reject(errorResponse);
    scope.$apply();
    expect(toastrSpy.calledOnce).to.be.true;
    expect(toastrSpy.calledWith('Error retrieving movie details.' + errorResponse.data));
  });

});