app.service('movieSearchService', function () {

  var lastSearchFilter = null;
  var searchResults = [];

  var isSearchPanelVisible = true;

  return {
    storeLastSearchFilter: function (filter) {
      lastSearchFilter = filter;
    },
    getLastSearchFilter: function() {
      return lastSearchFilter;
    },
    storeResults: function (results) {
      searchResults = results;
    },
    getStoredResults: function () {
      return searchResults;
    },
    hasStoredResults: function () {
      return searchResults.length > 0;
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