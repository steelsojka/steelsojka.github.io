directive("simple-spy", function(element) {
  var ABOVE_CLASS = "simple-spy-above";
  var BELOW_CLASS = "simple-spy-below";

  var target = element.data("simple-spy");

  if (!target) {
    return;
  }

  target = $(target).map(function() {
    var $this = $(this);

    return {
      $el: $this,
      top: $this.offset().top,
      offset: $this.data("simple-spy-offset") || 0
    };
  })[0];

  var $window = $(window);
  var activeClass = ABOVE_CLASS;

  var onScroll = function(event) {
    var windowTop = $window.scrollTop();

    if (target.top - target.offset <= windowTop && activeClass !== ABOVE_CLASS) {
      activeClass = ABOVE_CLASS;
      element.addClass(ABOVE_CLASS).removeClass(BELOW_CLASS);
    } else if (target.top -target.offset > windowTop && activeClass !== BELOW_CLASS) {
      activeClass = BELOW_CLASS;
      element.addClass(BELOW_CLASS).removeClass(ABOVE_CLASS);
    }
  };

  $window.on("scroll", onScroll);

});
