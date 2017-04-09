(function(app){
  var loginController = app.controller('loginController',
    function($scope, usersService, $location) {
      $scope.userLogin = function() {
        $scope.login($scope.email, $scope.password, function(user) {
            $location.url('/');
        });
      }
    }
  );
})(window.app);
