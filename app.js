window.requestAnimationFrame =
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame;

window.addEventListener("polymer-ready", function () {
  var ticker = new window.CreationixTicker();
  document.body.appendChild(ticker);
  ticker.addMessage("The laptop is orange");
  ticker.addMessage("This is a ticker");
  ticker.addMessage("It's cool right?!");
  setInterval(function () {
    ticker.addMessage("Message " + Date.now());
  }, 4000);
}, false);
