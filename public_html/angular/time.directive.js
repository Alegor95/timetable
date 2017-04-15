(function (app) {
  /**
   * Return time in ms
   */
  app.directive('time', function() {

    var minuteMs = 60 * 1000;
    var hourMs = 60 * minuteMs;

    return {
      restrict: 'E',
      scope: {
        time: "=time"
      },
      templateUrl: "../templates/time.html",
      link: function($scope) {
        $scope.$watch('time', function (val) {
          $scope.hours = Math.floor((val||0) / hourMs);
          $scope.minutes = Math.floor(((val||0) - $scope.hours * hourMs) / minuteMs);
        });

        $scope.$watch('hours', function (val, oldVal) {
          $scope.time = ($scope.time || 0) + (val - oldVal) * hourMs;
        });

        $scope.$watch('minutes', function (val, oldVal) {
          $scope.time = ($scope.time || 0) + (val - oldVal) * minuteMs;
        });
      }
    }
  })
})(window.app);
