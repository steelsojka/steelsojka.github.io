directive("carousel", function(element, emitter) {
  var items = element.find("[data-carousel-item]").map(function() {
    var $this = $(this);

    return {
      $el: $this,
      label: $this.data("carousel-item"),
      link: $this.data("carousel-link") || ""
    };
  });

  var label = element.find("[data-carousel-label]");
  var index = 0;
  var timeoutId = null;

  var advance = function(back) {

    var newIndex;

    if (typeof back !== "number") {
      newIndex = back ? index - 1 : index + 1;
    } else {
      newIndex = back;
    }

    if (newIndex > items.length - 1) {
      index = 0;
    } else if (newIndex < 0) {
      index = items.length - 1;
    } else {
      index = newIndex;
    }

    $.each(items, function() {
      this.$el.removeClass("active").css("z-index", 0);
    });

    items[index].$el.addClass("active").css("z-index", 10);

    element.height(getMaxSize());
    label.text(items[index].label).attr("href", items[index].link);

    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    // Auto advance after 15 seconds
    timeoutId = setTimeout(advance, 15000);
  };

  var getMaxSize = function() {
    return Math.max.apply(Math, items.map(function() {
      return this.$el.height();
    }));
  };

  var next = function() {
    advance();
  };

  var previous = function() {
    advance(true);
  };

  var nextEl = element.find("[data-carousel-next]").on('click', next);
  var prevEl = element.find("[data-carousel-previous]").on('click', previous);

  advance(0);

  $(window).on("resize", function() {
    advance(index);
  });
});
