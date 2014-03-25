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
        console.log(self);
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
          item.start = now;
        }
      }
    },

    // This the public API for adding a new message to the ticker queue
    // It will display as the next message jumping in front of any existing
    // queued messages.
    // TODO: we shouldn't jump in front of queued messages that haven't been
    // shown at least one time.
    addMessage: function (message) {

      // Create the element for the message and insert into the shadowRoot
      var el = document.createElement("li");
      el.textContent = message;
      this.shadowRoot.appendChild(el);

      // Create the message object that contains the timing information and
      // a reference to the dom element.
      var item = {
        el: el,            // The actual element to be moved
        start: Date.now(), // Time it started animating
        active: false,     // Flag to tell if it's currently on the screen.
        seen: false,       // Flag to tell if it's ever been on the screen.
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
    }

  });


}());
