var appService = angular.module('appService', [])

appService.factory('appModule', function( serverUrl, $http, Upload ){
  var appFactory = {};

  appFactory.loginUser = function( data ) {
  	
    return $http.post(serverUrl.url + 'login', data);
  };

  appFactory.signupUser = function( data ) {
    return $http.post(serverUrl.url + 'signup', data);
  };

  appFactory.addMovie = function( data ) {
    return $http.post(serverUrl.url + 'add_movie', data);
  };

  appFactory.updateMovie = function( data ) {
    return $http.post(serverUrl.url + 'update_movie', data);
  };

  appFactory.removeMovie = function( id ) {
    return $http.get(serverUrl.url + 'delete_movie/' + id);
  };

  appFactory.fetchMovies = function( ) {
    return $http.get(serverUrl.url + 'get_movies');
  };

  appFactory.uploadMovie = function( data ) {
    return Upload.upload({
        url: serverUrl.url + 'upload_movie',
        data: data
    });
  };

  appFactory.uploadMovieImage = function( data ) {
    return Upload.upload({
        url: serverUrl.url + 'replace_movie_image',
        data: data
    });
  };

  appFactory.fetchCategories = function( ) {
    return $http.get(serverUrl.url + 'get_categories');
  };
  
  return appFactory;
});