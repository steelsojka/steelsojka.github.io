(function($, window) {


  var directives = [];

  // This is my implementation for angularJS directives. I don't need full blown
  // angularJS, but I want some form of declarative binding to attach functionality
  // to elements. We don't get dependency injection and all that fun stuff
  // but this is just a quick way to get directives ;)
  window.directive = function(name, fn) {
    directives.push({
      name: name,
      fn: fn
    });
  };

  var settings = {
    // This is just a quick hack to check for mobile devices...
    // We only need it to disable a couple things
    isMobile: /Android|iPod|iPad|iPhone/.test(navigator.userAgent)
  };

  // Sub pub emitter
  var emitter = $({});
 
  // Processes all our "directives"
  function processDirectives() {
    $.each(directives, function(index, directive) {
      $("[data-" + directive.name + "]").each(function() {
        directive.fn($(this), emitter, settings);
      });
    });
  };

  $(function() {
    processDirectives();
  });

}(jQuery, window));

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

  var setContainerHeight = function() {
    element.height(getMaxSize());
  };

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

    setContainerHeight();

    items[index].$el.addClass("active").css("z-index", 10);

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

  // If we have images that determine the size of the container
  // resize when they are loaded
  $.each(items, function() {
    this.$el.find("img")[0].onload = setContainerHeight;
  });

  advance(0);

  $(window).on("resize", function() {
    advance(index);
  });
});

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

directive("scroll-spy", function(element, emitter, settings) {
  if (settings.isMobile) {
    return;
  }

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
      data: $this.data("scroll-spy-data"),
      event: $this.data("scroll-spy-event") || "scroll-spy:change"
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

      emitter.trigger(target[0].event, [target[0].data]);

      activeTargets.addClass("scroll-target-" + target[0].id);
      prevTarget = target[0];
    }
  };

  setTimeout(onScroll(), 0);

  $window.on("scroll", onScroll);
});


directive("typeout", function(element, emitter, settings) {
  if (settings.isMobile) {
    return;
  }

  var template = "<span class='typeout'>" + (element.data("typeout-default") || "") + "</span><span class='typeout-cursor'></span>";

  var speed = 350;
  var hidden = false;
  var text = element.data("typeout") || "";
  var event = "typeout:change";

  element.html(template);

  var cursor = element.find(".typeout-cursor").text("|");
  var textEl = element.find(".typeout");

  var blink = function() {
    cursor.css("opacity", (hidden ? 1 : 0));
    hidden = !hidden;
  };

  var setText = function(message) {
    text = message.split("");
  };

  var typeout = function(reverse) {
    var index = reverse ? text.length : 1;
    var typingText = text.join("");

    var typeChar = function() {
      textEl.text(text.slice(0, index).join(""));

      index = reverse ? index - 1 : index + 1;

      var nextChar = reverse ? index >= 0 : index <= text.length;

      if (nextChar && typingText === text.join("")) {
        setTimeout(typeChar, 50);
      }
    };

    typeChar();
  };

  setInterval(blink, speed);

  blink();
  setText(text);

  emitter.on(event, function(e, message) {
    if (message) {
      setText(message);
    }

    typeout();
  });
});
