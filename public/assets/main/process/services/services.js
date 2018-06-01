var appService = angular.module('appService', [])

appService.factory('appModule', function( serverUrl, $http, Upload ){
  var appFactory = {};

  appFactory.fetchCategories = function( ) {
    return $http.get(serverUrl.url + 'get_categories');
  };

  appFactory.fetchMovies = function( ) {
    return $http.get(serverUrl.url + 'get_movies');
  };

  appFactory.fetchMovieByID = function( id ) {
    return $http.get(serverUrl.url + 'get_movies/' + id);
  };


  return appFactory;
});