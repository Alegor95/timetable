(function(app) {
  app.directive('hierarchy', function(hierarchyService) {

    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      scope: {
        'hierarchyId': '=hierarchyId',
        'parentId': '=parentId',
        'hierarchyTypeId': '=hierarchyTypeId'
      },
      templateUrl: '../templates/hierarchy.html',
      controller: function($scope) {
        hierarchyService.types(function(types) {
          $scope.types = types.reduce(function(acc, cur) {
            acc[cur.ID] = cur.Name;
            return acc;
          }, {});
        });

        $scope.$watch('hierarchyId', function(id) {
          if (id == null) return;
          hierarchyService.hierarchy(id, function(hierarchy) {
            $scope.hierarchy = hierarchy;
            if (!$scope.hierarchyTypeId) {
              $scope.hierarchyTypeId = hierarchy.HierarchyTypeId;
            }
            if (!$scope.parentId) {
              $scope.parentId = hierarchy.ParentHierarchyId;
            }
          })
        });

        $scope.$watch('parentId', function(pId) {
          hierarchyService.childs(pId, function(childs) {
            $scope.options = childs;
          })
        });

        $scope.addNew = function(name, hierarchyTypeId, parentId) {
          hierarchyService.create(
            $scope.newName, $scope.hierarchyTypeId, $scope.parentId,
            function(id) {
              hierarchyService.childs($scope.parentId, function(childs) {
                $scope.options = childs;
                $scope.hierarchyId = id;  
              })
            }
          );
        }
      }
    };
  })
})(window.app);
