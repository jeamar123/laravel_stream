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
            setTimeout(function() {
              $(".movie-video").attr('src',scope.movie_data.link_1);
              // console.log($('#movie-video-id'));
            }, 500);
          }
        }

        scope.pausePlay = ( ) =>{
          // var myVideo = $('#movie-video-id')[0];
          // if (myVideo.paused){
          //   myVideo.play(); 
          //   scope.isMovieSet = true;
          // }else{
          //   myVideo.pause(); 
          //   scope.isMovieSet = false;
          // }
        }

        scope.getMoveDetails = ( id ) =>{
          appModule.fetchMovieByID( id )
            .then(function(response){
              console.log(response);
              scope.movie_data = response.data;
              scope.movie_data.categories = eval(scope.movie_data.categories);
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
          scope.getMoveDetails($stateParams.movie_id);
        }

        scope.onLoad();

      }
    }


  }
])