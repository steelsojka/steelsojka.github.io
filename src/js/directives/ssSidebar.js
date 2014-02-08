angular.module("steelApp").directive("ssSidebar", ["$window", "$document", function($window, $document) {
  return {
    restrict: "EA",
    link: function(scope, element, attrs) {
      var height = scope.$eval(attrs.height) || 50;
      var totalElements = 0;

      var widths = attrs.widths.split(",").map(function(width) {
        return parseInt(width, 10);
      });

      var createElements = function() {
        var elementCount = $window.innerHeight / height;
        var newElements = Math.max(elementCount - totalElements, 0);
        var fragment = $document[0].createDocumentFragment();
        var x = 0;

        for (var i = 0; i < newElements; i++) {
          var div = $document[0].createElement("div");
          div.style.height = height;
          div.style.width = widths[x++] + "%";
          fragment.appendChild(div);

          if (x >= widths.length) {
            x = 0;
          }
        }

        element[0].appendChild(fragment);

        totalElements = elementCount;
      };

      $window.addEventListener("resize", createElements, false);

      createElements();
    }
  };
}]);
