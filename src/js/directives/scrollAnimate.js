directive("scroll-animate", function(element) {
  var SCROLL_DURATION = 300;
  var $this = $(this);
  var $target = $(element.data("scroll-animate"));
  var $html = $("html, body");

  element.on("click", function(event) {
    $html.animate({
      scrollTop: $target.offset().top
    }, SCROLL_DURATION);
  });
});
