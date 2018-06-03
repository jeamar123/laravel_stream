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

  appFactory.loginUser = function( data ) {
    return $http.post(serverUrl.url + 'login', data);
  };

  appFactory.signupUser = function( data ) {
    return $http.post(serverUrl.url + 'signup', data);
  };

  appFactory.logoutUser = function( ) {
    return $http.get(serverUrl.url + 'logout');
  };

  appFactory.checkSession = function( data ) {
    return $http.get(serverUrl.url + 'check_session');
  };

  appFactory.fetchSession = function( data ) {
    return $http.get(serverUrl.url + 'get_session');
  };

  


  return appFactory;
});