(function(app) {
  app.directive('profile', function() {
    return {
      restrict: 'E',
      scope: {
        action: '=action',
        user: '=user'
      },
      templateUrl: '../templates/profile.html'
    };
  });
})(window.app)
