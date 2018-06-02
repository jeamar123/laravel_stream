app.directive('movieDirective', [
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
        console.log( "movieDirective Runinng !" );

        // console.log($stateParams);
        scope.category_list = [];
        scope.movie_data = {};
        scope.showMovie = false;
        scope.isMovieSet = false;

        scope.toggleVideo = ( ) =>{

          if( scope.showMovie == true ){
            scope.showMovie = false;
          }else{
            scope.showMovie = true;
            scope.toggleLoading();
            setTimeout(function() {
              $(".movie-video").attr('src',scope.movie_data.movie_link);
              scope.toggleLoading();
            }, 500);
          }
        }

        scope.downloadVideo = ( ) =>{
          scope.toggleLoading();
          window.location = scope.movie_data.torrent_link;

          setTimeout(function() {
            scope.toggleLoading();
          }, 1000);
        }

        scope.getMoveDetails = ( id ) =>{
          scope.toggleLoading();
          appModule.fetchMovieByID( id )
            .then(function(response){
              console.log(response);
              scope.movie_data = response.data;
              scope.movie_data.categories = eval(scope.movie_data.categories);
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
          scope.getMoveDetails($stateParams.movie_id);
        }

        scope.onLoad();

      }
    }


  }
])