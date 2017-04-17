(function(app) {
  app.controller('settingsController', function($scope, settingsService) {

    settingsService.get($scope.authorized, function(lessonsTime) {
      $scope.lessonsTime = lessonsTime;
      $scope.lessonsCount = lessonsTime.length;
    })

    $scope.$watch('lessonsCount', function (val) {
      if (!val) return;
      var lessonsTime = $scope.lessonsTime || [];
      for (var i = 0; i < val; i++) {
        if (!lessonsTime[i]) {
          lessonsTime.push({
            start: 0,
            finish: 0
          });
        }
      }
      if (lessonsTime.length > val) lessonsTime = lessonsTime.slice(0, val);
      $scope.lessonsTime = lessonsTime;
    });

    $scope.save = function (lessonsTime) {
      settingsService.save($scope.authorized, lessonsTime);
    }

  });
})(window.app)
