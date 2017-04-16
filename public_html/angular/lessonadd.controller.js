(function(app) {
  app.controller(
    'lessonAddController',
    function($scope, settingsService, lessonsService, subjectsService,
        $location, $routeParams) {

      $scope.day = parseInt($routeParams.day);
      $scope.timeIdx = $routeParams.timeIdx;

      subjectsService.get(function (subjects) {
        $scope.subjects = subjects || [];
        if (subjects.length) $scope.subject = subjects[0].ID;
      });

      lessonsService.getLessonsType(function (types) {
        $scope.lessonTypes = types;
        $scope.lessonType = types[0].ID;
      });

      lessonsService.getLessonsRepeat(function (repeat) {
        $scope.lessonRepeats = repeat;
        $scope.lessonRepeat = repeat[0].ID;
      });

      settingsService.get($scope.authorized, function(lessonTimes) {
        $scope.lessonTime = lessonTimes[$scope.timeIdx];
        $scope.start = $scope.lessonTime.start;
        $scope.finish = $scope.lessonTime.finish;
      });

      $scope.addSubject = function() {
        subjectsService.add($scope.newSubject, function(newSubj) {
          $scope.subjects.push(newSubj);
          $scope.subject = newSubj.ID;
        });
      }

      $scope.save = function() {
        lessonsService.add(
          $scope.subject, $scope.room, $scope.lessonRepeat, $scope.lessonType,
          $scope.start + $scope.day, $scope.finish + $scope.day,
          $scope.authorized.HierarchyId,
          function(id) {
            $location.url("/");
          }
        );
      }

    }
  );
})(window.app);
