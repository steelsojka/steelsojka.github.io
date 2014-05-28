angular.module("leafyjsApp", []).controller("appCtrl", function($scope) {
  $scope.node = new Leafy();
  $scope.selectedNode = null;

  $scope.setSelectedNode = function(node) {
    $scope.selectedNode = node;
  };

  $scope.addChildNode = function() {
    if ($scope.selectedNode) { 
      $scope.selectedNode.linkChild(new Leafy());
    }
  };

  $scope.addParentNode = function() {
    if ($scope.selectedNode) { 
      $scope.selectedNode.linkParent(new Leafy());
    }
  };
}).directive("node", function() {
  return {
    restrict: "EA",
    link: function(scope, element, attrs) {
      var node = scope.$eval(attrs.node);
      var siblingCount = 0;

      scope.$watch(function() {
        var parents = node.getParentLinks();
        return parents.reduce(function(sum, parent) {
          return parent.getChildLinks().length + sum;
        }, 0);
      }, function(val) {
        element[0].style.width = ((100 / val) + "%");
      });
    }
  }
});
