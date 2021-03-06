window.app = angular.module("app", ["ngRoute", "ngCookies"]);

window.app.factory('httpRequestInterceptor', function () {
  return {
    request: function (config) {

      config.headers = {
        'X-Requested-With':'XMLHttpRequest',
        'Content-Type':'application/x-www-form-urlencoded'
      };

      return config;
    }
  };
});

window.app.config(function($routeProvider, $httpProvider) {
  $routeProvider
    .when("/", {
      templateUrl: '../templates/main.html'
    })
    .when("/login", {
      templateUrl: '../templates/login.html'
    })
    .when("/register", {
      templateUrl: '../templates/register.html'
    })
    .when("/profile", {
      templateUrl: '../templates/user.html'
    })
    .when("/settings", {
      templateUrl: '../templates/settings.html'
    })
    .when("/lesson/:day/:timeIdx/add", {
      templateUrl: '../templates/lessonadd.html'
    });
  $httpProvider.interceptors.push('httpRequestInterceptor');
});
