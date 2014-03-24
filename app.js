window.requestAnimationFrame =
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame;

window.addEventListener("polymer-ready", function () {
  var ticker = new CreationixTicker();
  document.body.appendChild(ticker);
  setInterval(function () {
    ticker.maxItems = Date.now();
  }, 500);
}, false);
