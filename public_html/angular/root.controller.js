(function(app) {
  app.controller('rootController', function($scope, usersService) {
      usersService.getLogged(function(user){
        $scope.authorized = user;
      });

      $scope.logout = function() {
        $scope.authorized = null;
        usersService.logout();
      }

      $scope.login = function(login, password, callback) {
        usersService.login(login, password, function(user) {
          $scope.authorized = user;
          callback(user);
        });
      }
    }
  );
})(window.app);
