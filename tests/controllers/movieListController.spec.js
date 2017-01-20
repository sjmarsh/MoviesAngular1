var expect = chai.expect;

describe('movieListController', function(){
    
    var scope, location, routeParams, toastr, fakeMovieService, fakeMovieSearchService, fakeReferenceDataService, q, deferredMovies, deferredCategories, deferredMoviesByQuery;
    var getCategoriesSpy, getMoviesSpy, getMoviesByQuerySpy;

    var lastSearchFilter = 'super';
    var lastSelectedCategories = ['drama', 'music'];
    var hasMorePages = false;
    var nextSkipPage = 11;
    var nextPageTakeSize = 10;

    beforeEach(function(){
      
      module('MoviesApp');
      
      fakeMovieService = {
          getMovies: function(skip, take){
            deferredMovies = q.defer();
            return deferredMovies.promise;
          },
          getMoviesByQuery: function(searchFilter, categories, skip, take){
            deferredMoviesByQuery = q.defer();
            return deferredMoviesByQuery.promise;
          }
      };

      getMoviesSpy = sinon.spy(fakeMovieService,'getMovies');
      getMoviesByQuerySpy = sinon.spy(fakeMovieService, 'getMoviesByQuery');

      fakeReferenceDataService = {
        getCategories: function(){
          deferredCategories = q.defer();
          return deferredCategories.promise;
        }
      };

      getCategoriesSpy = sinon.spy(fakeReferenceDataService, 'getCategories');

      fakeMovieSearchService = {
        storeLastSearchFilter: sinon.spy(),
        getLastSearchFilter : sinon.stub(),
        storeLastSelectedCategories : sinon.stub(),
        getLastSelectedCategories : sinon.stub(),
        storeResults : sinon.spy(),
        getStoredResults : sinon.stub(),
        hasStoredResults : sinon.stub(),       
        currentPage : sinon.stub(),
        incrementPage : sinon.spy(),
        resetCurrentPage : sinon.spy(),
        fakeHasMorePages: function(_hasMorePages) { hasMorePages = _hasMorePages; },
        hasMorePages : function() { return hasMorePages; },
        nextPageSkip : function() { return nextSkipPage },
        nextPageTakeSize :  function() { return nextPageTakeSize },
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

  describe('#initialize', function(){
    
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

  describe('#getMoreMovies', function(){
    
    it('shouldGetMoreMoviesIfHasMorePages', function() {
      fakeMovieSearchService.fakeHasMorePages(true);
      scope.searchFilter = 'super';
      scope.selectedCategories = ['drama', 'horror'];

      scope.getMoreMovies();

      expect(getMoviesByQuerySpy.calledOnce).to.be.true;
      expect(getMoviesByQuerySpy.calledWithExactly(scope.searchFilter, scope.selectedCategories, nextSkipPage, nextPageTakeSize)).to.be.true;
    });

    it('shouldNotGetMoreMoviesIfHasNoMorePages', function(){
      fakeMovieSearchService.fakeHasMorePages(false);

      scope.getMoreMovies();

      expect(getMoviesByQuerySpy.called).to.be.false;
    });

    it('shouldPopulateMovieListWithResult', function(){
      fakeMovieSearchService.fakeHasMorePages(true);
      var moviesResponse = { data: { movies: [{ title:'super', category:'action'}, { title:'garfield', category:'animation'} ]}};
      
      scope.getMoreMovies();
      deferredMoviesByQuery.resolve(moviesResponse);
      scope.$apply();

      expect(scope.movieList).to.deep.equal(moviesResponse.data.movies);
    });

    it('shouldIncrementPage', function(){
      fakeMovieSearchService.fakeHasMorePages(true);
      var moviesResponse = { data: { movies: [{ title:'super', category:'action'}, { title:'garfield', category:'animation'} ]}};
      
      scope.getMoreMovies();
      deferredMoviesByQuery.resolve(moviesResponse);
      scope.$apply();

      expect(fakeMovieSearchService.incrementPage.calledOnce).to.be.true;
    });
  });

  describe('#search', function(){

    it('shouldStoreLastSearchFilter', function(){
      var searchFilter = 'random';
      scope.searchFilter = searchFilter;

      scope.search();

      expect(fakeMovieSearchService.storeLastSearchFilter.calledWithExactly(searchFilter)).to.be.true;
    });

    it('shouldResetCurrentPage', function(){
      scope.search();
      expect(fakeMovieSearchService.resetCurrentPage.calledOnce).to.be.true;
    });

    it('shouldGetMoviesByQuery', function(){
      var searchFilter = 'random';
      scope.searchFilter = searchFilter;
      var selectedCategories = ['comedy'];
      scope.selectedCategories = selectedCategories;

      scope.search();
      expect(fakeMovieService.getMoviesByQuery.calledWithExactly(searchFilter, selectedCategories)).to.be.true;
    });

    it('shouldStoreQueryResults', function(){
      var moviesResponse = { data: { movies: [{ title:'super', category:'action'}, { title:'garfield', category:'animation'} ]}};

      scope.search();

      deferredMoviesByQuery.resolve(moviesResponse);
      scope.$apply();

      expect(fakeMovieSearchService.storeResults.calledWithExactly(moviesResponse.data)).to.be.true;
    });
  });
});