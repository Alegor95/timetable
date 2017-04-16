(function (app) {
  app.directive('weekday', function() {
    return {
      restrict: 'E',
      templateUrl: '../templates/weekday.html',
      scope: {
        day: '=day',
        time: '=time',
        lessons: '=lessons'
      },
      link: function(scope) {
        scope.getLesson = function(lessonTime, lessons) {
          for (var i in lessons) {
            var lesson = lessons[i];
            if ((lesson.PeriodStart >= lessonTime.start + scope.day.start)
                && (lesson.PeriodEnd <= lessonTime.finish + scope.day.start)) {
              return lesson;
            }
          }
        };

      }
    };
  })
})(window.app);
