app.service('movieSearchService', function () {

  var lastSearchFilter = null;
  var searchResults = [];

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
    }
  };
});