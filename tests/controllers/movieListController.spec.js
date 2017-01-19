var expect = chai.expect;

describe.only('movieListController', function(){
    
    var scope, location, routeParams, toastr, fakeMovieService, fakeMovieSearchService, fakeReferenceDataService, q, deferredMovies, deferredCategories;
    var getCategoriesSpy, getMoviesSpy;

    var lastSearchFilter = 'super';
    var lastSelectedCategories = ['drama', 'music'];

    beforeEach(function(){
      
      module('MoviesApp');
      
      fakeMovieService = {
          getMovies: function(skip, take){
            deferredMovies = q.defer();
            return deferredMovies.promise;
          }
      };

      getMoviesSpy = sinon.spy(fakeMovieService,'getMovies');

      fakeReferenceDataService = {
        getCategories: function(){
          deferredCategories = q.defer();
          return deferredCategories.promise;
        }
      };

      getCategoriesSpy = sinon.spy(fakeReferenceDataService, 'getCategories');

      fakeMovieSearchService = {
        storeLastSearchFilter: sinon.stub(),
        getLastSearchFilter : sinon.stub(),
        storeLastSelectedCategories : sinon.stub(),
        getLastSelectedCategories : sinon.stub(),
        storeResults : sinon.spy(),
        getStoredResults : sinon.stub(),
        hasStoredResults : sinon.stub(),       
        currentPage : sinon.stub(),
        hasMorePages : sinon.stub(),
        nextPageSkip : sinon.stub(),
        nextPageTakeSize : sinon.stub(),
        isSearchPanelVisible : sinon.stub()
      };

      fakeMovieSearchService.getLastSearchFilter.returns(lastSearchFilter);
      fakeMovieSearchService.getLastSelectedCategories.returns(lastSelectedCategories);
      fakeMovieSearchService.isSearchPanelVisible.returns(true);
                 
      inject(function($controller, $rootScope, $location, $routeParams, _toastr_, $q){
        scope = $rootScope.$new();
        location = $location;
        toastr = _toastr_;
        routeParams = $routeParams;
        q = $q;

        toastrSpy = sinon.spy(toastr, 'error');

        $controller('movieListController', {'$scope' : scope, 
                                            movieService: fakeMovieService, 
                                            movieSearchService: fakeMovieSearchService,
                                            referenceDataService: fakeReferenceDataService
                                          });
     })
  });

  it('shouldHavePageClassDefined', function(){
    expect(scope.pageClass).to.be.equal('page-movie-list');
  });

  it('shouldGetCategories', function(){
    expect(getCategoriesSpy.calledOnce).to.be.true;
  });

  it('shouldPopulateCategoryList', function(){
    var categoryResponse = {data: ['action', 'comedy']};
    deferredCategories.resolve(categoryResponse);
    scope.$apply();
    expect(scope.categoryList).to.be.equal(categoryResponse.data);
  });

  it('shouldPopulateSearchFilterWithLastSearchFilterIfExists', function(){    
    expect(scope.searchFilter).to.be.equal(lastSearchFilter);
  });

  it('shouldPopulateLastSelectedCategoriesIfExists', function(){
    expect(scope.selectedCategories).to.be.equal(lastSelectedCategories);
  });

  it('shouldSetSearchPanelVisibility', function(){
    expect(scope.isSearchPanelVisible).to.be.true;
  });

  it('shouldGetMovies', function(){
    expect(getMoviesSpy.calledOnce).to.be.true;
  });

  it('shouldPopulateMovieListWithInitialResults', function(){
    var moviesResponse = { data: { movies: [{ title:'super', category:'action'}, { title:'garfield', category:'animation'} ]}};
    deferredMovies.resolve(moviesResponse);
    scope.$apply();
    expect(scope.movieList).to.be.equal(moviesResponse.data.movies);
  });

});