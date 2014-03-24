/*global Polymer*/
Polymer('creationix-ticker', {
  maxItems: 10,
  ready: function () {
    var messages = [];
    var currentMessage = 0;


    window.requestAnimationFrame(onFrame);
    function onFrame() {

      window.requestAnimationFrame(onFrame);
    }
  }

});
