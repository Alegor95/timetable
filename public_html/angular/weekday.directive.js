(function (app) {
  app.directive('weekday', function(lessonsService) {

    var UNIVERSAL_REPEAT = lessonsService.getUniversalRepeat();

    return {
      restrict: 'E',
      templateUrl: '../templates/weekday.html',
      scope: {
        day: '=day',
        time: '=time',
        lessons: '=lessons',
        repeat: '=repeat'
      },
      link: function(scope) {
        scope.getLesson = function(lessonTime, lessons) {
          for (var i in lessons) {
            var lesson = lessons[i];
            if (((lesson.RepeatTime == scope.repeat) || (lesson.RepeatTime == UNIVERSAL_REPEAT))
                && (lesson.PeriodStart >= lessonTime.start + scope.day.start)
                && (lesson.PeriodEnd <= lessonTime.finish + scope.day.start)) {
              return lesson;
            }
          }
        };

      }
    };
  })
})(window.app);
