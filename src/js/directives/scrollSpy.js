directive("scroll-spy", function(element, emitter) {
  var ACTIVE_CLASS = "active";
  var $prevSource, prevTarget;
  var $window = $(window);
  var navHeight = $(".sticky-nav").height();

  var sourceElements = element.find("[data-scroll-source]").map(function() {
    var $this = $(this);

    return {
      $el: $this,
      offset: $this.data("scroll-offset") || 0,
      id: $this.data("scroll-source")
    };
  });

  // Grab our targets initially so we don't have to do it in the onScroll listener
  var targets = element.find("[data-scroll-target]").map(function() {
    var $this = $(this);

    return {
      $el: $this,
      id: $this.data("scroll-target"),
      data: $this.data("scroll-spy-data")
    };
  });

  var activeTargets = element.find("[data-scroll-active]");

  var onScroll = function(event) {
    var windowTop = $window.scrollTop();
    var targetToChange, sourceToChange;
    var isChanged = false;

    $.each(sourceElements, function(index, source) {
      if (source.$el[0].offsetTop - navHeight + source.offset <= windowTop) {
        sourceToChange = source;
        isChanged = $prevSource ? $prevSource.$el[0] !== source.$el[0] : true;
      }
    });

    if (!isChanged) {
      return;
    }

    sourceToChange.$el.addClass(ACTIVE_CLASS);
    $prevSource && $prevSource.$el.removeClass(ACTIVE_CLASS);
    $prevSource = sourceToChange;

    if (prevTarget) {
      activeTargets.removeClass("scroll-target-" + prevTarget.id);
      prevTarget.$el.removeClass(ACTIVE_CLASS);
    }

    var target = $.grep(targets, function(target) {
      return sourceToChange.id === target.id;
    });

    if (target.length) {
      target[0].$el.addClass(ACTIVE_CLASS);
      emitter.trigger("scroll-spy:change", [target[0]]);
      activeTargets.addClass("scroll-target-" + target[0].id);
      prevTarget = target[0];
    }
  };

  setTimeout(onScroll(), 0);

  $window.on("scroll", onScroll);
});

