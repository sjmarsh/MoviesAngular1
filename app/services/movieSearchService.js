app.service('movieSearchService', function () {

  var PAGE_SIZE = 10;
  var currentPage = 1;

  var lastSearchFilter = null;
  var lastSelectedCategories = [];
  var searchResults = null;

  var isSearchPanelVisible = true;

  return {
    storeLastSearchFilter: function (filter) {
      lastSearchFilter = filter;
    },
    getLastSearchFilter: function() {
      return lastSearchFilter;
    },
    
    storeLastSelectedCategories: function(selectedCategories) {
      lastSelectedCategories = selectedCategories;
    },
    getLastSelectedCategories: function() {
      return lastSelectedCategories;
    },

    storeResults: function (results) {
      searchResults = results;
    },
    getStoredResults: function() {
      return searchResults;
    },
    hasStoredResults: function() {
      return searchResults !== null && searchResults.count > 0;
    },

    resetCurrentPage: function () {
      currentPage = 1;
    },
    incrementPage: function() {
      currentPage = currentPage +=1;
    },
    currentPage: function() {
      return currentPage;
    },
    hasMorePages: function() {
      var totalPages = Math.ceil(searchResults.count / PAGE_SIZE);
      return currentPage < totalPages;
    },
    nextPageSkip: function() {
      return currentPage * PAGE_SIZE;
    },
    nextPageTakeSize: function() {
      return currentPage * PAGE_SIZE + PAGE_SIZE;
    },

    hideSearchPanel: function() {
      isSearchPanelVisible = false;
    },
    showSearchPanel: function() {
      isSearchPanelVisible = true;
    },
    isSearchPanelVisible: function() {
      return isSearchPanelVisible;
    }
  };
});