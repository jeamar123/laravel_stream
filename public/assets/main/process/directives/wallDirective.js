app.directive('wallDirective', [
  '$http',
  '$state',
  '$stateParams',
  '$rootScope',
  'appModule',
  'serverUrl',
  function directive($http,$state,$stateParams,$rootScope,appModule,serverUrl) {
    return {
      restrict: "A",
      scope: true,
      link: function link( scope, element, attributeSet )
      {
        console.log( "wallDirective Runinng !" );

        scope.movie_list = [];

        scope.searchMovie = "";

        // scope.dowloadTorrent = ( data ) =>{
        //   console.log(data);
        //   window.location = data;
        // }

        scope.getAllMovies = ( ) =>{
          appModule.fetchMovies()
            .then(function(response){
              console.log(response);
              scope.movie_list = response.data;
            });
        }

        scope.getCategories = ( ) =>{
          appModule.fetchCategories()
            .then(function(response){
              console.log(response);
              scope.category_list = response.data;
            });
        }

        scope.onLoad = ( ) =>{
          scope.getCategories();
          scope.getAllMovies();
        }

        scope.onLoad();

      }
    }


  }
])