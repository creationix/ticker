/*global Polymer*/
(function () {
  var width;

  Polymer('creationix-ticker', {
    maxItems: 10,
    ready: function () {
      var messages = this.messages = [];
      this.messageIndex = 0;
      setInterval(onFrame, 30);
      var prev = 0;
      var num = 0;
      function onFrame() {
        var now = Date.now();
        var width = window.innerWidth;
        messages.forEach(function (item) {
          if (!item.active && num && prev > 0) {
            reset(item);
          }
          else {
            if (!item.active) {
              item.start = now;
              item.active = true;
              num++;
            }
          }
          var delta = now - item.start;
          var offset = width * (1 - delta / 5000);
          item.el.style.webkitTransform = "translateX(" + offset + "px)";
          var selfWidth = item.el.offsetWidth;
          prev = offset - width + selfWidth;
          if (offset < -1 * selfWidth) {
            reset(item);
          }
        });

        function reset(item) {
          item.start = now;
          if (item.active) {
            item.active = false;
            num--;
          }
          item.start = now;
        }
      }
    },
    addMessage: function (message) {
      var item = {
        el: document.createElement("li"),
        start: Date.now()
      };
      this.messages.sort(function (a, b) {
        return a.start - b.start;
      });
      item.el.textContent = message;
      this.messages.push(item);
      this.shadowRoot.appendChild(item.el);
    }

  });


}());
