(function () {
  "use strict";

  var W = window.WEDDING || {};
  var body = document.body;
  var params = new URLSearchParams(location.search);

  // Print the site address on the cards once it's configured.
  if (W.siteUrl) {
    var short = W.siteUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");
    document.querySelectorAll("[data-site]").forEach(function (el) { el.textContent = short; });
  }

  /* Render mode: story.html?render=wedding shows just that card, no controls */
  var renderId = params.get("render");
  if (renderId) {
    var target = document.getElementById(renderId);
    if (target) {
      target.hidden = false;
      target.classList.add("is-render");
      body.classList.add("render");
    }
    return;
  }

  var track = document.getElementById("stories");
  var stories = Array.prototype.slice.call(document.querySelectorAll(".story:not([hidden])"));
  var dotsBox = document.getElementById("storyDots");
  var download = document.getElementById("downloadImage");
  var current = 0;

  var dots = stories.map(function (s, i) {
    var b = document.createElement("button");
    b.setAttribute("aria-label", s.getAttribute("data-label"));
    b.addEventListener("click", function (e) { e.stopPropagation(); go(i); });
    dotsBox.appendChild(b);
    return b;
  });

  function go(i) { track.scrollTo({ left: i * track.clientWidth, behavior: "smooth" }); }
  function imageFor(i) { return "assets/stories/" + stories[i].id + ".png"; }
  function sync() {
    current = Math.round(track.scrollLeft / track.clientWidth);
    current = Math.max(0, Math.min(stories.length - 1, current));
    dots.forEach(function (d, i) { d.classList.toggle("on", i === current); });
    download.href = imageFor(current);
    download.setAttribute("download", "Krishna-Nandini-" + stories[current].id + ".png");
  }
  track.addEventListener("scroll", function () { requestAnimationFrame(sync); }, { passive: true });
  window.addEventListener("resize", function () { go(current); });

  var start = stories.findIndex(function (s) { return "#" + s.id === location.hash; });
  if (start > 0) track.scrollLeft = start * track.clientWidth;
  sync();

  // Tap anywhere on a card to hide/show the controls for a clean screenshot.
  track.addEventListener("click", function () { body.classList.toggle("ui-hidden"); });

  var toastEl = document.getElementById("toast"), timer;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("is-shown");
    clearTimeout(timer);
    timer = setTimeout(function () { toastEl.classList.remove("is-shown"); }, 2800);
  }

  // Share the HD image straight to WhatsApp Status / Instagram Story via the phone's share sheet.
  document.getElementById("shareImage").addEventListener("click", function () {
    var url = imageFor(current);
    var name = "Krishna-Nandini-" + stories[current].id + ".png";
    fetch(url)
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.blob(); })
      .then(function (blob) {
        var file = new File([blob], name, { type: "image/png" });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          return navigator.share({ files: [file], title: "Krishna & Nandini" });
        }
        window.open(url, "_blank");
        toast("Long-press the image to save, then post it");
      })
      .catch(function (err) {
        if (err && err.name === "AbortError") return;
        toast("Tap the card to hide buttons, then take a screenshot");
      });
  });
})();
