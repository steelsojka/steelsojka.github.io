angular.module("steelApp", []);

angular.module("steelApp").directive("ssSidebar", ["$window", "$document", function($window, $document) {
  return {
    restrict: "EA",
    link: function(scope, element, attrs) {
      var height = scope.$eval(attrs.height) || 50;
      var totalElements = 0;

      var createElements = function() {
        var elementCount = $window.innerHeight / height;
        var newElements = Math.max(elementCount - totalElements, 0);
        var fragment = $document[0].createDocumentFragment();

        for (var i = 0; i < newElements; i++) {
          var div = $document[0].createElement("div");
          div.style.height = height;
          fragment.appendChild(div);
        }

        element[0].appendChild(fragment);
      };

      $window.addEventListener("resize", createElements, false);

      createElements();
    }
  };
}]);
