directive("cursor", function(element) {
  var speed = parseInt(element.data("cursor"), 10) || 150;
  var hidden = false;

  element.text("l");

  var blink = function() {
    element.css("opacity", (hidden ? 1 : 0));
    hidden = !hidden;
  };

  setInterval(blink, speed);

  blink();
});
