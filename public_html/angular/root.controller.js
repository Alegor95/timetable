(function(app) {
  app.controller('rootController', function($scope, usersService, $location) {
      usersService.getLogged(function(user){
        $scope.authorized = user;
      });

      $scope.logout = function() {
        $scope.authorized = null;
        usersService.logout();
      };

      $scope.login = function(login, password, callback) {
        usersService.login(login, password, function(user) {
          $scope.authorized = user;
          callback(user);
        });
      };

      $scope.$on("$locationChangeStart", function(event, next, current) {
        if (!$scope.authorized
            && next.indexOf('login') < 0
            && next.indexOf('register') < 0) {
          $location.url('login');
        }
      });
    }
  );
})(window.app);
