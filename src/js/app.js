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

  // Sub pub emitter
  var emitter = $({});
 
  // Processes all our "directives"
  function processDirectives() {
    $.each(directives, function(index, directive) {
      $("[data-" + directive.name + "]").each(function() {
        directive.fn($(this), emitter);
      });
    });
  };

  $(function() {
    processDirectives();
  });

}(jQuery, window));
