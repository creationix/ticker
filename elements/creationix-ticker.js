/*global Polymer*/
(function () {

  Polymer('creationix-ticker', {

    ready: function () {

      // This is the internal list of message objects
      var messages = this.messages = [];


      this.messageIndex = 0;
      var self = this;
      var prev = 0;
      var num = 0;
      window.requestAnimationFrame(onFrame);
      function onFrame() {
        window.requestAnimationFrame(onFrame);
        var now = Date.now();
        var width = self.clientWidth;
        messages.forEach(function (item) {
          if (!item.active && num && prev > 0) {
            reset(item);
          }
          else {
            if (!item.active) {
              item.start = now;
              item.active = true;
              item.seen = true;
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
          if (item.dying) {
            messages.splice(messages.indexOf(item), 1);
            item.el.parentNode.removeChild(item.el);
          }
          item.start = now;
        }
      }
    },

    // This the public API for adding a new message to the ticker queue
    // It will display as the next message jumping in front of any existing
    // queued messages, but after any that have not been shown at least once.
    addMessage: function (message) {

      // Create the element for the message and insert into the shadowRoot
      var el = document.createElement("li");
      el.textContent = message;
      this.shadowRoot.appendChild(el);

      // Create the message object that contains the timing information and
      // a reference to the dom element.
      var created = Date.now();
      var item = {
        el: el,           // The actual element to be moved
        created: created, // Created timestamp
        start: created,   // Time it started animating
        active: false,    // Flag to tell if it's currently on the screen.
        seen: false,      // Flag to tell if it's ever been on the screen.
        dying: false,
      };


      // Insert after the last visible message
      // Remember that the list wraps and last message may seem before others.
      // If all messages are visible, then just push on the end.
      for (var i = 0, l = this.messages.length; i < l; i++) {
        var other = this.messages[i];
        if (other.seen && !other.active) break;
      }
      if (i < l) {
        this.messages.splice(i, 0, item);
      }
      else {
        this.messages.sort(function (a, b) {
          return a.start - b.start;
        });
        // debugger;
        this.messages.push(item);
      }

      l = this.messages.length;
      if (l > 25) {
        // If the list is too long, remove the oldest message
        var oldest = Infinity, index = -1;
        for (i = 0; i < l; i++) {
          var other = this.messages[i];
          if (!other.dying && other.created < oldest) {
            oldest = other.created;
            other.dying = true;
            index = i;
          }
        }
      }

    }

  });


}());
