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
          for (var i in hierarchyOrder) {
            if (hierarchyOrder[i] == type) return true;
            if (!index && hierarchies[hierarchyOrder[i]] <= 0)  return false;
          }
          return true;
        }
      }
    };
  });
})(window.app)
