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
