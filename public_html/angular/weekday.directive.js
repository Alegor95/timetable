(function (app) {
  app.directive('weekday', function() {

    return {
      restrict: 'E',
      templateUrl: '../templates/weekday.html',
      scope: {
        day: '=day',
        time: '=time',
        lessons: '=lessons',
        repeat: '=repeat'
      }
    };

  })
})(window.app);
