/*global Polymer*/

Polymer('creationix-ticker', {

  ready: function () {

    var self = this;

    // This is the internal list of message objects
    var messages = this.messages = [];
    // This is the left offset of the first message.  We start out off the right.

    this.width = this.clientWidth;

    // Start out with items appearing on the right side.
    this.left = this.width;

    var before = Date.now();

    // Speed in pixels per second
    // TODO: make this configurable
    var speed = 100;

    window.requestAnimationFrame(onFrame);
    function onFrame() {
      window.requestAnimationFrame(onFrame);
      // Check to see if the element has been resized
      self.width = self.clientWidth;

      // Calculate the time delta between the frames
      // Should be somewhere around 16ms.
      var now = Date.now();
      var delta = now - before;
      before = now;

      // Apply the velocity
      self.left -= speed * delta / 1000;

      var offset = self.left;
      messages.forEach(function (item, i) {
        offset += item.padding;
        item.el.style.webkitTransform = "translateX(" + Math.floor(offset) + "px)";
        offset += item.width;

        if (offset <= 0) {
          self.left = offset;
          item.done = true;
        }
      });

      // Remove the finished items in reverse order.
      for (var i = messages.length - 1; i >= 0; i--) {
        var item = messages[i];
        if (!item.done) continue;
        item.done = false;
        messages.splice(messages.indexOf(item), 1);
        item.el.parentNode.removeChild(item.el);
        if (!item.dying) self.addMessage(item);
      }

    }
  },

  // This the public API for adding a new message to the ticker queue
  // It will display as the next message jumping in front of any existing
  // queued messages, but after any that have not been shown at least once.
  addMessage: function (message) {
    var el, item;
    if (typeof message === "string") {
      // Create the element for the message and insert into the shadowRoot
      el = document.createElement("li");
      this.shadowRoot.appendChild(el);
      el.textContent = message;
      // Create the message object that contains the timing information and
      // a reference to the dom element.
      var created = Date.now();
      item = {
        el: el,           // The actual element to be moved
        created: created, // Created timestamp.  Used to remove the oldest message when full
        padding: 0,       // Used to ensure elements start on the far right.
        width: el.clientWidth, //
        seen: false,      // Flag to tell if it's ever been on the screen.
      };

    }
    else {
      item = message;
      item.seen = true;
      el = item.el;
      this.shadowRoot.appendChild(el);
    }

    var offset = this.left;
    var other;
    for (var i = 0, l = this.messages.length; i < l; i++) {
      other = this.messages[i];
      offset += other.padding + other.width;
    }
    item.padding = Math.max(0, this.width - offset);
    this.messages.push(item);

    l = this.messages.length;
    if (l > 25) {
      // If the list is too long, remove the oldest message
      var oldest = Infinity, index = -1;
      for (i = 0; i < l; i++) {
        other = this.messages[i];
        if (!other.dying && other.created < oldest) {
          oldest = other.created;
          index = i;
        }
      }
      if (index >= 0) this.messages[index].dying = true;

    }

  }

});
