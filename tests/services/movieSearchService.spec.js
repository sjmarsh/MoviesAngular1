var expect = chai.expect;

describe('movieSearchService', function(){
  
  var movieSearchService;

  beforeEach(function(){
    module('MoviesApp');

    inject(function(_movieSearchService_){
      movieSearchService = _movieSearchService_;
    })
  })

  it('shouldStoreLastSearchFilter', function(){
    var lastSearchFilter = 'super';

    movieSearchService.storeLastSearchFilter(lastSearchFilter);

    var storedValue = movieSearchService.getLastSearchFilter();
    expect(storedValue).to.be.equal(lastSearchFilter);
  });

  it('shouldStoreLastSelectedCategories', function(){
    var lastStoredCategories = ['action', 'music'];

    movieSearchService.storeLastSelectedCategories(lastStoredCategories);

    var storedValues = movieSearchService.getLastSelectedCategories();
    expect(storedValues).to.deep.equal(lastStoredCategories);
  });

  it('shouldStoreSearchResults', function(){
    var searchResults = {movies: ['super', 'avatar'], count: 2 };

    movieSearchService.storeResults(searchResults);

    var storedValues = movieSearchService.getStoredResults();
    expect(storedValues).to.deep.equal(searchResults);
  });

  it('shouldIndicateIfHasSearchResults', function(){
    var searchResults = {movies: ['super', 'avatar'], count: 2 };

    movieSearchService.storeResults(searchResults);

    var hasStoredValues = movieSearchService.hasStoredResults();

    expect(hasStoredValues).to.be.true;
  });

  it('shouldIndicateIfHasNoSearchResults', function(){
    var hasStoredValues = movieSearchService.hasStoredResults();

    expect(hasStoredValues).to.be.false;
  });

  it('shouldIncrementCurrentPage', function(){
    movieSearchService.incrementPage();
    movieSearchService.incrementPage();

    expect(movieSearchService.currentPage()).to.be.equal(3);
  });

  it('shouldIndicateHasMorePagesWhenMoreSearchResults', function(){
    var searchResults = {movies: ['super', 'avatar', 'police academy', 'police academy 2', 'police academy 3', 'police academy 4', 'police academy 5', 'police academy 6', 'police academy 7', 'die hard', 'die hard 2' ], count: 11 };

    movieSearchService.storeResults(searchResults);

    expect(movieSearchService.hasMorePages()).to.be.true;
  });

  it('shouldIndicateHasNoMorePagesWhenNoMoreSearchResults', function(){
    var searchResults = {movies: ['super', 'avatar', 'police academy', 'police academy 2', 'police academy 3', 'police academy 4', 'police academy 5', 'police academy 6', 'police academy 7' ], count: 9 };

    movieSearchService.storeResults(searchResults);

    expect(movieSearchService.hasMorePages()).to.be.false;
  });

  if('should return next page skip', function(){
    var nextPageSkip = movieSearchService.nextPageSkip();

    expect(nextPageSkip).to.be.equal(10);
  });

  it('should return next page take', function(){
    var nextPageTake = movieSearchService.nextPageTakeSize();

    expect(nextPageTake).to.be.equal(20);
  });

  it('shouldResetCurrentPage', function(){
    movieSearchService.incrementPage();
    movieSearchService.incrementPage();

    movieSearchService.resetCurrentPage();

    expect(movieSearchService.currentPage()).to.be.equal(1);
  });

  it('shouldHideSearchPanel', function(){
    movieSearchService.showSearchPanel();
    movieSearchService.hideSearchPanel();

    expect(movieSearchService.isSearchPanelVisible()).to.be.false;
  })

  it('shouldShowSearchPanel', function(){
    movieSearchService.hideSearchPanel();
    movieSearchService.showSearchPanel();

    expect(movieSearchService.isSearchPanelVisible()).to.be.true;
  });

});