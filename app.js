window.requestAnimationFrame =
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame;

window.addEventListener("polymer-ready", function () {
  var ticker = new window.CreationixTicker();
  document.body.appendChild(ticker);
  ticker.addMessage("The laptop is orange");
  ticker.addMessage("This is a ticker");
  ticker.addMessage("It's cool right?!");
  var i = 0;
  setInterval(function () {
    ticker.addMessage("Message " + (++i));
  }, 1000);
}, false);
