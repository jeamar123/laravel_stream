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
        scope.user_data = {};
        scope.isSessionActive = false;
        scope.searchMovie = "";

        var isLoading = false;

        scope.goToMovie = ( list ) =>{
          if( scope.isSessionActive ){
            $state.go("movie",{ movie_id: list.id });
          }else{
            $state.go("auth");
          }
        }

        scope.getAllMovies = ( ) =>{
          scope.toggleLoading();
          appModule.fetchMovies()
            .then(function(response){
              // console.log(response);
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

        scope.getSession = ( ) =>{
          appModule.checkSession()
            .then(function(response) {
              // console.log(response);
              if( response.data.isActive){
                scope.isSessionActive = true;
                scope.getSessionData();
              }else{
                scope.isSessionActive = false;
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
          scope.getAllMovies();
        }

        scope.onLoad();

      }
    }


  }
])