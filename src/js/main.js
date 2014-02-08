(function($, window) {

  var $window = $(window);
  var ACTIVE_CLASS = "active";
  
  var scrollSpy = function(elements) {
    var $prevSource, prevTarget;

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

        if (this.offsetTop <= windowTop + 1) {
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
  };

  $(function() {
    scrollSpy($("[data-scroll-spy]"));
  });


}(jQuery, window));
