(function(app) {
  app.directive('profile', function(hierarchyService) {

    var hierarchyOrder = [
      "UNIVERSITY",
      "FACULTY",
      "COURSE",
      "GROUP"
    ];

    return {
      restrict: 'E',
      requires: '^^hierarchy',
      scope: {
        action: '=action',
        user: '=user'
      },
      templateUrl: '../templates/profile.html',
      link: function(scope) {
        scope.hierarchyOrder = hierarchyOrder;
        scope.$watch('user', function(u) {
          if (u.HierarchyId) {
            hierarchyService.parents(u.HierarchyId, function(hierarchies) {
              scope.hierarchies = hierarchies;
            });
          } else {
            scope.hierarchies = hierarchyOrder.reduce(function(red, curr){
              if (curr) red[curr] = null;
              return red;
            }, {});
          }
        });

        scope.isVisible = function(type, hierarchies) {
          var index;
          if (!type || !hierarchies) return false;
          for (var i in hierarchyOrder) {
            if (hierarchyOrder[i] == type) return true;
            if (!index && hierarchies[hierarchyOrder[i]] <= 0)  return false;
          }
          return true;
        }

        scope.validate = function(user, hierarchies) {
          var errors = [];
          var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          if (!user.Name) {
            errors.push("Введите ваше имя");
          }
          if (!user.Surname) {
            errors.push("Введите вашу фамилию");
          }
          if (!user.Email) {
            errors.push("Введите email");
          } else if (!re.test(user.Email)) {
            errors.push("Введите корректный email");
          }
          if (!user.Password) {
            errors.push("Введите пароль");
          } else if (user.Password != user.repeatPassword) {
            errors.push("Введенные пароли должны совпадать");
          }
          if (!hierarchies
              || hierarchies[hierarchyOrder[hierarchyOrder.length - 1]] <= 0) {
            errors.push("Введите вашу группу");
          }
          if (errors.length) {
            throw new Error("Ошибки валидации:\n" + errors.join('\n'));
          }
        }

        scope.save = function() {
          scope.validate(scope.user, scope.hierarchies);
          scope.user.HierarchyId = scope.hierarchies[hierarchyOrder[hierarchyOrder.length - 1]];
          scope.action(scope.user);
        }
      }
    };
  });
})(window.app)
