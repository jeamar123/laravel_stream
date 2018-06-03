app.controller('mainController', function( $state, $scope , $rootScope, $stateParams, appModule){

	console.log( 'mainController running' );

	var vm = this;

	vm.isRightShown = false;

  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
    // console.log(fromState);
    // console.log(toState);
    vm.current = toState.name;
  });

	vm.onLoad = ( ) => {

	}

	vm.onLoad();

});
