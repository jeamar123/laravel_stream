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

        var isLoading = false;

        scope.toggleVideo = ( ) =>{

          if( scope.showMovie == true ){
            scope.showMovie = false;
          }else{
            scope.showMovie = true;
            scope.toggleLoading();
            // var blob = new Blob([scope.movie_data.movie_link], {type : 'application/json'});
            // var movie_url = URL.createObjectURL(blob);
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

        scope.toggleLoading = ( ) =>{
          if( isLoading == true ){
            isLoading = false;
            setTimeout(function() {
              $(".body-loader").fadeOut("slow");
            }, 1000);
          }else{
            $(".body-loader").show();
            isLoading = true;
          }
        }

        scope.getSession = ( ) =>{
          appModule.checkSession()
            .then(function(response) {
              // console.log(response);
              if( response.data.isActive){
                scope.isSessionActive = true;
                scope.getSessionData();
              }else{
                scope.isSessionActive = false;
                $state.go('auth');
              }
            });
        }

        scope.getSessionData = ( ) =>{
          appModule.fetchSession()
            .then(function(response) {
              // console.log(response);
              if( response.data){
                scope.user_data = response.data.user;
              }
            });
        }

        scope.onLoad = ( ) =>{
          scope.getSession();
          scope.getCategories();
          scope.getMoveDetails($stateParams.movie_id);
        }

        scope.onLoad();

        

      }
    }


  }
])