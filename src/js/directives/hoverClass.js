directive("hover-class", function(element) {
  var target = element.find(element.data("hover-target"));
  var klass = element.data("hover-class");

  target = target.length ? target : element;
  
  var toggle = function(remove) {
    element[remove ? "removeClass" : "addClass"](klass);
  };

  element
    .on("mouseenter", $.proxy(toggle, this, false))
    .on("mouseleave", $.proxy(toggle, this, true));
});
