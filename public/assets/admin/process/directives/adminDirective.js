app.directive('adminDirective', [
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
        console.log( "adminDirective Runinng !" );
        scope.serverUrl = serverUrl.url;

        scope.initializeVariables = ( ) => {
          scope.movie_list = [];
          scope.category_list = [];
          scope.movieCheckbox = [];
          scope.checkedMovieArr = [];
          scope.selectedCategoryArr = [];
          scope.selectedCategoryToAddArr = [];

          scope.admin_view_opt = 0;
          scope.movie_view_opt = 0;
          scope.add_opt = 0;

          scope.showListIsTrue = true;
          scope.showMovieIsTrue = false;
          scope.isAnyBoxChecked = false;
          scope.isAllMoviesBtnChecked = false;

          scope.add_movie_data = {
            categories : [false,false,false,false],
          };
          scope.selected_movie_data = {

          };
          scope.selected_excel_upload = null;
          scope.temp_movie_img = {};
          scope.movieFileUpload = {};
          scope.movie_search = "";
        }

        scope.errorMessage = ( res ) =>{
          swal({
            title: "Oops...",
            text: "Something went wrong! " + res.data.message,
            type: "error",
            showCancelButton: false,
            closeOnConfirm: true,
            animation: "slide-from-top"
          });
        }

        scope.movieViewOpt = ( opt ) =>{
          scope.movie_view_opt = opt;
          if( opt == 0 ){ 
            scope.getMovies();
          }
        }

        scope.movieAddOpt = ( opt ) =>{
          scope.add_opt = opt;
        }

        scope.changeAdminMenuOpt = ( opt ) =>{
          scope.admin_view_opt = opt;
        }

        scope.excelMovie = ( data ) =>{
          scope.selected_excel_upload = data;          
        }

        scope.showMovie = ( data ) =>{
          scope.selected_movie_data = data;
          scope.showListIsTrue = false;
          scope.showMovieIsTrue = true;
        }

        scope.showList = ( ) =>{
          scope.showListIsTrue = true;
          scope.showMovieIsTrue = false;
          scope.getMovies();
        }

        scope.movieChecked = ( index, movieOpt ) =>{
          scope.movieCheckbox[index] = movieOpt;
          if( movieOpt == true){
            scope.checkedMovieArr.push( scope.movie_list[index].id );
          }else{
            scope.checkedMovieArr.splice( index, 1 );
          }
          var checkedIndex = $.inArray( true, scope.movieCheckbox);
          if( checkedIndex < 0 ){
            scope.isAnyBoxChecked = false;
          }else{
            scope.isAnyBoxChecked = true;
          }
        }

        scope.selectAllMovies = ( ) =>{
          scope.checkedMovieArr = [];
          if( scope.isAllMoviesBtnChecked == false ){
            scope.isAllMoviesBtnChecked = true;
            scope.isAnyBoxChecked = true;
            angular.forEach( scope.movie_list, function(value,key){
              scope.checkedMovieArr.push( value.id );
              scope.movieCheckbox[key] = true;
            });
          }else{
            scope.isAllMoviesBtnChecked = false;
            scope.isAnyBoxChecked = false;
            angular.forEach( scope.movie_list, function(value,key){
              scope.checkedMovieArr = [];
              scope.movieCheckbox[key] = false;
            });
          }
        }

        scope.selectCategory = ( index, opt ) =>{
          scope.selected_movie_data.categories[index] = opt;
          console.log(scope.selected_movie_data);
        }

        scope.selectCategoryforAdding = ( index, opt ) =>{
          scope.add_movie_data.categories[index] = opt;
        }

        scope.checkCategoryHasTrue = ( movie ) => {
          if( $.inArray( true , movie.categories ) > -1 ){
            return true;
          }else{
            return false;
          }
        }

        scope.showMovieVideo = ( data ) =>{
          window.open( scope.serverUrl + '#/movie/' + data.id , '_blank');
        }


// ------------------- HTTP REQUESTS ------------------- //

        scope.downloadTemplate = ( ) =>{
          window.location.href = window.location.origin + '/excel/Movie upload.xlsx';
        }

        scope.replaceMovieImage = ( img ) =>{
          swal({
            title: "Warning!",
            text: "Are you sure that you want to change this image?",
            type: "warning",
            showCancelButton: true,
            closeOnConfirm: true,
            confirmButtonText: "Yes",
            animation: "slide-from-top"
          }, function(isTrue){
            if(isTrue){
              var data = {
                file : img,
                movie_id : scope.selected_movie_data.id,
                current_img : scope.selected_movie_data.image,
              }
              appModule.uploadMovieImage( data )
                .then(function(response){
                  // console.log(response);
                  scope.temp_movie_img = {};
                  if( response.data.status == true ){
                    swal({
                      title: "Success!",
                      text: "Image updated.",
                      type: "success",
                      showCancelButton: false,
                      closeOnConfirm: true,
                      animation: "slide-from-top"
                    });
                    scope.selected_movie_data.image = response.data.img;
                  }else{
                    scope.errorMessage( response );
                  }
                });
            }
          });
        }

        scope.saveMovieDetails = ( data ) =>{
          swal({
            title: "Warning!",
            text: "Are you sure that you want to Update this movie?",
            type: "warning",
            showCancelButton: true,
            closeOnConfirm: true,
            confirmButtonText: "Yes",
            animation: "slide-from-top"
          }, function(isTrue){
            if( isTrue ){
              data.categories = angular.toJson(data.categories);
              appModule.updateMovie( data )
                .then(function(response){
                  // console.log(response);
                  if( response.data.status == true ){
                    swal({
                      title: "Success!",
                      text: "Movie updated.",
                      type: "success",
                      showCancelButton: false,
                      closeOnConfirm: true,
                      animation: "slide-from-top"
                    });
                    response.data.movie.categories = eval(response.data.movie.categories);
                    scope.selected_movie_data = response.data.movie;
                  }else{
                    scope.errorMessage( response );
                  }
                });
            }
          });
        }

        scope.deleteMovies = ( ) =>{
          var countChecked = scope.checkedMovieArr.length;
          swal({
            title: "Warning!",
            text: "Are you sure that you want to delete " + countChecked + " item(s)?",
            type: "warning",
            showCancelButton: true,
            closeOnConfirm: true,
            confirmButtonText: "Yes",
            animation: "slide-from-top"
          }, function(isTrue){
            if(isTrue){
              angular.forEach( scope.checkedMovieArr, function(value,key){
                appModule.removeMovie( value )
                  .then(function(response){
                    // console.log(response);
                    if( response.data.status == false ){
                      scope.errorMessage( response );
                      return false;
                    }
                  });

                if( key == (scope.checkedMovieArr.length-1) ){
                  scope.onLoad();
                  setTimeout(function() {
                    swal({
                      title: "Success!",
                      text: countChecked +" item(s) deleted.",
                      type: "success",
                      showCancelButton: false,
                      closeOnConfirm: true,
                      animation: "slide-from-top"
                    });
                  }, 500);
                }
              });
            }
          });
        }

        scope.sendExcelMovie = ( ) =>{
          var data = {
            file : scope.selected_excel_upload
          }
          appModule.uploadMovie( data )
            .then(function(response){
              console.log(response);
              if( response.data.status == true ){
                swal({
                  title: "Success!",
                  text: "Movies uploaded.",
                  type: "success",
                  showCancelButton: false,
                  closeOnConfirm: true,
                  animation: "slide-from-top"
                });

                scope.movieFileUpload = null;
              }else{
                scope.errorMessage( response );
              }
            });
        }

        scope.submitMovie = ( data ) =>{
          data.categories = angular.toJson(data.categories);
          appModule.addMovie( data )
            .then(function(response){
              console.log(response);

              scope.add_movie_data = {
                categories : [false,false,false,false],
              };
              scope.getMovies();
            });
        }

        scope.getCategories = ( ) =>{
          appModule.fetchCategories()
            .then(function(response){
              // console.log(response);
              scope.category_list = response.data;
            });
        }

        scope.getMovies = ( ) =>{
          appModule.fetchMovies( )
            .then(function(response){
              // console.log(response);
              angular.forEach( response.data, function(value,key){
                value.categories = eval(value.categories);
                if( key == (response.data.length-1) ){
                  scope.movie_list = response.data;
                }
              });
            });
        } 
// -------------------------------------- //

        scope.onLoad = ( ) =>{
          scope.initializeVariables();
          scope.getCategories();
          scope.getMovies();
        }

        scope.onLoad();

      }
    }


  }
])