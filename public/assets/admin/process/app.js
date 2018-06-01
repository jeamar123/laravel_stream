var app = angular.module('app', ['ui.router','appService','ngFileUpload']);

app.run([ '$rootScope', '$state', '$stateParams', '$templateCache', 
  function ($rootScope, $state, $stateParams, $templateCache) {
    
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
      // console.log(toState);
      // console.log(toState.name);
    });
  }]);

app.factory('serverUrl',[
    function factory(){
      var base_url = window.location.origin + '/';
      return {
        url: base_url,
      }
    }
]);

app.config(function($stateProvider, $urlRouterProvider){

  $stateProvider
    .state('admin', {
      url: '/',
      views: {
        'header': {
          templateUrl: '../assets/admin/templates/header.html'
        },
        'main': {
          templateUrl: '../assets/admin/templates/admin.html'
        },
        'leftMenu@admin': {
          templateUrl: '../assets/admin/templates/admin-left-menu.html'
        },
      },
    })
    .state('admin.movie', {
      url: '/movie',
      views: {
        'header': {
          templateUrl: '../assets/admin/templates/header.html'
        },
        'main': {
          templateUrl: '../assets/admin/templates/movie.html'
        }
      },
    });

    $urlRouterProvider.otherwise('/');
});


app.directive('validNumber', function() {
  return {
    require: '?ngModel',
    link: function(scope, element, attrs, ngModelCtrl) {
      if(!ngModelCtrl) {
        return; 
      }

      ngModelCtrl.$parsers.push(function(val) {
        if (angular.isUndefined(val)) {
            var val = '';
        }
        var clean = val.replace(/[^0-9\.]/g, '');
        var decimalCheck = clean.split('.');

        if(!angular.isUndefined(decimalCheck[1])) {
            decimalCheck[1] = decimalCheck[1].slice(0,2);
            clean =decimalCheck[0] + '.' + decimalCheck[1];
        }

        if (val !== clean) {
          ngModelCtrl.$setViewValue(clean);
          ngModelCtrl.$render();
        }
        return clean;
      });

      element.bind('keypress', function(event) {
        if(event.keyCode === 32) {
          event.preventDefault();
        }
      });
    }
  };
});

app.filter('cmdate', [
    '$filter', function($filter) {
        return function(input, format) {
            return $filter('date')(new Date(input), format);
        };
    }
]);

app.directive('numbersOnly', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                if (text) {
                    var transformedInput = text.replace(/[^0-9]/g, '');

                    if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    return transformedInput;
                }
                return undefined;
            }            
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
});

app.filter('toArray', function () {
  return function (obj, addKey) {
    if (!angular.isObject(obj)) return obj;
    if ( addKey === false ) {
      return Object.keys(obj).map(function(key) {
        return obj[key];
      });
    } else {
      return Object.keys(obj).map(function (key) {
        var value = obj[key];
        return angular.isObject(value) ?
          Object.defineProperty(value, '$key', { enumerable: false, value: key}) :
          { $key: key, $value: value };
      });
    }
  };
});
