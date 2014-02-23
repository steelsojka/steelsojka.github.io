directive("hover-event", function(element, emitter) {
  var event = element.data("hover-event");
  var data = element.data("hover-event-data");

  element
    .on("mouseenter", function() {
      emitter.trigger(event + ":on", [data]);
    })
    .on("mouseout", function() {
      emitter.trigger(event + ":off", [data]);
    });
});
