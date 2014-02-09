(function($, window) {

  var $window = $(window);
  var $body = $(document.body);
  var $html = $("html");

  var ACTIVE_CLASS = "active";
  var SCROLL_DURATION = 300;
  var directives = [];
 
  // This is my implimentation for angularJS directives. I don't need full blown
  // angularJS, but I want some form of declarative binding to attach functionality
  // to elements.
  directives.push({
    name: "scroll-spy",
    fn: function(elements) {
      var $prevSource, prevTarget;
      var navHeight = $(".sticky-nav").height();

      // Grab our targets initially so we don't have to do it in the onScroll listener
      var targets = $("[data-scroll-target]").map(function() {
        var $this = $(this);

        return {
          $el: $this,
          id: $this.data("scroll-target")
        };
      });

      var onScroll = function(event) {
        var windowTop = $window.scrollTop();
        var targetToChange, sourceToChange;
        var isChanged = false;

        elements.each(function() {
          var $this = $(this);

          if (this.offsetTop - navHeight <= windowTop) {
            sourceToChange = $this;
            isChanged = $prevSource ? $prevSource[0] !== this : true;
          }
        });

        if (!isChanged) {
          return;
        }

        sourceToChange.addClass(ACTIVE_CLASS);
        $prevSource && $prevSource.removeClass(ACTIVE_CLASS);
        $prevSource = sourceToChange;

        prevTarget && prevTarget.$el.removeClass(ACTIVE_CLASS);

        var target = $.grep(targets, function(target) {
          return sourceToChange.data("scroll-spy") === target.id;
        });

        if (target.length) {
          target[0].$el.addClass(ACTIVE_CLASS);
          prevTarget = target[0];
        }
      };

      $window.on("scroll", onScroll);
    }
  });

  directives.push({
    name: "scroll-animate",
    fn: function(elements) {
      elements.each(function() {
        var $this = $(this);
        var $target = $($this.data("scroll-animate"));

        $this.on("click", function(event) {
          $html.add($body).animate({
            scrollTop: $target.offset().top
          }, SCROLL_DURATION);
        });
      });
    }
  });

  var processDirectives = function() {
    $.each(directives, function(index, directive) {
      directive.fn($("[data-" + directive.name + "]"));
    });
  };

  $(function() {
    processDirectives();
  });


}(jQuery, window));
