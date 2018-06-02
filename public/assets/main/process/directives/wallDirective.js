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

        scope.getAllMovies = ( ) =>{
          scope.toggleLoading();
          appModule.fetchMovies()
            .then(function(response){
              console.log(response);
              scope.movie_list = response.data;
              scope.toggleLoading();
            });
        }

        scope.getCategories = ( ) =>{
          appModule.fetchCategories()
            .then(function(response){
              // console.log(response);
              scope.category_list = response.data;
            });
        }

        var isLoading = false;

        scope.toggleLoading = ( ) =>{
          if( isLoading == true ){
            isLoading = false;
            setTimeout(function() {
              $(".body-loader").fadeOut("slow");
            }, 2000);
          }else{
            $(".body-loader").show();
            isLoading = true;
          }
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