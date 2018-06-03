app.controller('checkController', function( $state, $scope , $rootScope, $stateParams, appModule){

	console.log( 'checkController running' );

	var vm = this;

	vm.isRightShown = false;
	vm.isSessionActive = false;
  vm.user_data = {};
  vm.current = $state.current.name;
	
  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
    // console.log(fromState);
    vm.current = toState.name;
  });

  vm.getSession = ( ) =>{
  	appModule.checkSession()
  		.then(function(response) {
  			// console.log(response);
  			if( response.data.isActive ){
          vm.isSessionActive = true;
          vm.user_data = response.data.user;
        }
  		});
  }

  vm.logout = ( ) =>{
    appModule.logoutUser()
      .then(function(response){
        console.log(response);

        window.location.reload();
      });
  }

	vm.onLoad = ( ) => {
		vm.getSession();
	}

	vm.onLoad();

});
