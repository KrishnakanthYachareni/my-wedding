(function () {
  "use strict";

  var W = window.WEDDING || {};
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function storage(fn) { try { return fn(); } catch (e) { return null; } }

  /* ==========================================================
     Falling petals — marigold, rose & jasmine (mallepoolu)
     ========================================================== */
  var Petals = (function () {
    var canvas = $("#petals");
    if (!canvas || !canvas.getContext) return { burst: function () {} };
    var ctx = canvas.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = 0, h = 0, items = [], running = false;
    var AMBIENT = reducedMotion ? 0 : (window.innerWidth < 600 ? 12 : 20);
    var MARIGOLD = ["#ffb300", "#ff9800", "#f57c00", "#ffca28", "#ffa726"];
    var ROSE = ["#c2185b", "#b3122e", "#d81b60"];

    function resize() {
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function make(burst) {
      var r = Math.random();
      var type = r < 0.6 ? "marigold" : r < 0.82 ? "rose" : "jasmine";
      var p = {
        type: type,
        x: burst ? w / 2 + (Math.random() - 0.5) * 80 : Math.random() * w,
        y: burst ? h * 0.45 : -20 - Math.random() * h,
        vx: burst ? (Math.random() - 0.5) * 9 : (Math.random() - 0.5) * 0.4,
        vy: burst ? -Math.random() * 9 - 3 : 0.5 + Math.random() * 0.8,
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.06,
        size: type === "jasmine" ? 5 + Math.random() * 3 : 6 + Math.random() * 7,
        phase: Math.random() * Math.PI * 2,
        color: type === "rose" ? ROSE[(Math.random() * ROSE.length) | 0] : MARIGOLD[(Math.random() * MARIGOLD.length) | 0],
        burst: !!burst,
        life: 0,
      };
      return p;
    }

    function draw(p) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      if (p.type === "jasmine") {
        ctx.fillStyle = "#fffdf5";
        for (var i = 0; i < 5; i++) {
          ctx.rotate((Math.PI * 2) / 5);
          ctx.beginPath();
          ctx.ellipse(0, -p.size * 0.55, p.size * 0.28, p.size * 0.55, 0, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = "#f2d16b";
        ctx.beginPath(); ctx.arc(0, 0, p.size * 0.18, 0, Math.PI * 2); ctx.fill();
      } else {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.92;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size * 0.5, p.size * 0.3 * (0.6 + 0.4 * Math.abs(Math.sin(p.phase))), 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 0.25;
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.ellipse(-p.size * 0.12, -p.size * 0.06, p.size * 0.2, p.size * 0.08, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    function tick() {
      ctx.clearRect(0, 0, w, h);
      for (var i = items.length - 1; i >= 0; i--) {
        var p = items[i];
        p.life++;
        p.phase += 0.03;
        if (p.burst) {
          p.vy += 0.18;
          p.vx *= 0.985;
          p.vy = Math.min(p.vy, 2.6);
        }
        p.x += p.vx + Math.sin(p.phase) * 0.6;
        p.y += p.vy;
        p.rot += p.vr;
        if (p.y > h + 30 || p.x < -40 || p.x > w + 40) {
          if (p.burst) { items.splice(i, 1); continue; }
          var n = make(false); n.y = -20; items[i] = n; continue;
        }
        draw(p);
      }
      if (items.length) requestAnimationFrame(tick); else running = false;
    }

    function start() { if (!running && items.length) { running = true; requestAnimationFrame(tick); } }

    resize();
    window.addEventListener("resize", resize);
    for (var i = 0; i < AMBIENT; i++) items.push(make(false));

    return {
      start: start,
      burst: function (n) {
        if (reducedMotion) return;
        for (var i = 0; i < (n || 70); i++) items.push(make(true));
        start();
      },
    };
  })();

  /* ==========================================================
     Music (optional)
     ========================================================== */
  var audio = null;
  var musicBtn = $("#musicToggle");
  if (W.musicUrl) {
    audio = new Audio(W.musicUrl);
    audio.loop = true;
    audio.volume = 0.5;
    musicBtn.hidden = false;
    musicBtn.addEventListener("click", function () {
      if (audio.paused) playMusic(); else { audio.pause(); musicBtn.classList.remove("is-playing"); }
    });
  }
  function playMusic() {
    if (!audio) return;
    var p = audio.play();
    if (p && p.then) p.then(function () { musicBtn.classList.add("is-playing"); }).catch(function () {});
  }

  /* ==========================================================
     Door intro
     ========================================================== */
  var stage = $("#doorStage");
  var nav = $("#bottomNav");
  var params = new URLSearchParams(location.search);
  var skipDoor = params.has("nodoor") || location.hash.length > 1 ||
    storage(function () { return sessionStorage.getItem("kn-opened"); });

  function afterOpen() {
    document.body.classList.remove("has-door");
    nav.classList.add("is-shown");
    Petals.start();
  }

  if (skipDoor) {
    stage.classList.add("is-open", "is-gone");
    afterOpen();
  } else {
    $("#doorOpen").addEventListener("click", function () {
      stage.classList.add("is-open");
      storage(function () { sessionStorage.setItem("kn-opened", "1"); });
      playMusic();
      setTimeout(function () { Petals.burst(80); }, 500);
      setTimeout(afterOpen, 900);
      setTimeout(function () { stage.classList.add("is-gone"); }, 2300);
    });
  }

  /* ==========================================================
     Countdown
     ========================================================== */
  var cd = $("#countdown");
  var cdLabel = $("#countdownLabel");
  var cdEls = {};
  $$("[data-cd]").forEach(function (el) { cdEls[el.getAttribute("data-cd")] = el; });
  var tMuhurtham = new Date(W.muhurtham).getTime();
  var rec = W.events && W.events.reception;
  var tRecStart = rec ? new Date(rec.start).getTime() : 0;
  var tRecEnd = rec ? new Date(rec.end).getTime() : 0;
  var tCelebrations = new Date("2026-12-02T18:00:00+05:30").getTime();

  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function updateCountdown() {
    var now = Date.now(), target, label;
    if (now < tMuhurtham) {
      target = tMuhurtham;
      label = now >= tCelebrations ? "Celebrations have begun! Muhurtham in" : "Counting down to the Muhurtham";
    } else if (now < tRecStart) {
      target = tRecStart;
      label = "Just married! 💛 Counting down to the Reception";
    } else if (now < tRecEnd) {
      cd.classList.add("is-done");
      cdLabel.textContent = "The reception is happening now — join us!";
      return;
    } else {
      cd.classList.add("is-done");
      cdLabel.textContent = "Happily married — thank you for your blessings 🙏";
      return;
    }
    var diff = Math.max(0, target - now);
    var s = Math.floor(diff / 1000);
    cdEls.d.textContent = pad(Math.floor(s / 86400));
    cdEls.h.textContent = pad(Math.floor((s % 86400) / 3600));
    cdEls.m.textContent = pad(Math.floor((s % 3600) / 60));
    cdEls.s.textContent = pad(s % 60);
    if (cdLabel.textContent !== label) cdLabel.textContent = label;
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ==========================================================
     Scroll reveal + bottom nav highlighting
     ========================================================== */
  if ("IntersectionObserver" in window) {
    var revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-in"); revealIO.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    $$(".reveal").forEach(function (el) { revealIO.observe(el); });

    var navLinks = {};
    $$("[data-nav]").forEach(function (a) { navLinks[a.getAttribute("data-nav")] = a; });
    var navIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var id = e.target.id === "rituals" || e.target.id === "invite" ? (e.target.id === "rituals" ? "events" : "home") : e.target.id;
        Object.keys(navLinks).forEach(function (k) { navLinks[k].classList.toggle("is-active", k === id); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    ["home", "invite", "events", "rituals", "film", "live", "share"].forEach(function (id) {
      var el = document.getElementById(id); if (el) navIO.observe(el);
    });
  } else {
    $$(".reveal").forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ==========================================================
     Rituals carousel dots
     ========================================================== */
  var track = $("#ritualsTrack");
  if (track) {
    var cards = $$(".ritual", track);
    var dots = document.createElement("div");
    dots.className = "rituals-dots";
    cards.forEach(function () { dots.appendChild(document.createElement("i")); });
    track.parentNode.insertBefore(dots, track.nextSibling);
    var dotEls = $$("i", dots);
    var updateDots = function () {
      var center = track.scrollLeft + track.clientWidth / 2, best = 0, bestD = Infinity;
      cards.forEach(function (c, i) {
        var d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - center);
        if (d < bestD) { bestD = d; best = i; }
      });
      dotEls.forEach(function (d, i) { d.classList.toggle("on", i === best); });
    };
    track.addEventListener("scroll", function () { requestAnimationFrame(updateDots); }, { passive: true });
    updateDots();
  }

  /* ==========================================================
     YouTube (lightweight: thumbnail first, player on tap)
     ========================================================== */
  function youtubeId(v) {
    if (!v) return "";
    var m = String(v).match(/(?:youtu\.be\/|v=|embed\/|shorts\/|live\/)([\w-]{11})/);
    return m ? m[1] : (/^[\w-]{11}$/.test(v) ? v : "");
  }
  var vid = youtubeId(W.youtube);
  var videoBox = $("#video");
  if (vid) {
    $("#videoThumb").src = "https://i.ytimg.com/vi/" + vid + "/hqdefault.jpg";
    $("#videoYoutube").href = "https://www.youtube.com/watch?v=" + vid;
    $("#videoPlay").addEventListener("click", function () {
      if (audio && !audio.paused) { audio.pause(); musicBtn.classList.remove("is-playing"); }
      var f = document.createElement("iframe");
      f.src = "https://www.youtube-nocookie.com/embed/" + vid + "?autoplay=1&rel=0&playsinline=1&modestbranding=1";
      f.title = "Pre-wedding film";
      f.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      f.allowFullscreen = true;
      videoBox.innerHTML = "";
      videoBox.appendChild(f);
    });
  } else {
    videoBox.classList.add("video--soon");
    videoBox.innerHTML =
      '<div class="video__soon">' +
        '<span class="video__soon-kicker">Our pre-wedding film</span>' +
        '<span class="video__soon-title">Coming Soon</span>' +
        '<span class="video__soon-note">Stay tuned ✨</span>' +
      '</div>';
    $("#videoYoutube").parentNode.hidden = true;
  }

  /* ==========================================================
     Live stream status
     ========================================================== */
  var pill = $("#livePill"), liveBtn = $("#liveBtn"), liveBtnText = $("#liveBtnText");
  function updateLive() {
    var now = Date.now(), windows = W.liveWindows || [], liveNow = null, next = null;
    windows.forEach(function (w) {
      var a = new Date(w.from).getTime(), b = new Date(w.to).getTime();
      if (now >= a && now < b) liveNow = w;
      else if (now < a && (!next || a < new Date(next.from).getTime())) next = w;
    });
    pill.classList.toggle("is-live", !!liveNow);
    if (liveNow) pill.textContent = "Live now · " + liveNow.name;
    else if (next && next === windows[0]) pill.textContent = "Upcoming";
    else if (next) pill.textContent = "Next · " + next.name;
    else pill.textContent = "Thank you for watching";

    if (W.liveStreamUrl) {
      liveBtn.href = W.liveStreamUrl;
      liveBtn.removeAttribute("aria-disabled");
      liveBtnText.textContent = liveNow ? "Watch Live Now" : "Open Live Stream";
    } else {
      liveBtn.setAttribute("aria-disabled", "true");
      liveBtn.removeAttribute("href");
      liveBtnText.textContent = "Link will be shared here";
    }
  }
  updateLive();
  setInterval(updateLive, 30000);

  /* ==========================================================
     Add to calendar
     ========================================================== */
  function gcalDate(iso) { return new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, ""); }
  var isApple = /iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent);
  $$("[data-calendar]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var ev = W.events[btn.getAttribute("data-calendar")];
      if (!ev) return;
      if (isApple) { location.href = ev.ics; return; }
      var url = "https://calendar.google.com/calendar/render?action=TEMPLATE" +
        "&text=" + encodeURIComponent(ev.title) +
        "&dates=" + gcalDate(ev.start) + "/" + gcalDate(ev.end) +
        "&details=" + encodeURIComponent(ev.details + "\nMap: " + ev.map) +
        "&location=" + encodeURIComponent(ev.location);
      window.open(url, "_blank", "noopener");
    });
  });

  /* ==========================================================
     Sharing
     ========================================================== */
  var siteUrl = W.siteUrl || (location.origin + location.pathname).replace(/index\.html$/, "");
  var shareText =
    "🪔 *Krishna weds Nandini* 🪔\n" +
    "\n" +
    "💍 *Muhurtham:* Thu, 3 Dec 2026 · 4:46 AM\n📍 Annavaram\n_(Celebrations begin on the night of 2 Dec)_\n\n" +
    "🎉 *Reception:* Sun, 6 Dec 2026 · 5 PM onwards\n📍 Siddipet\n\n" +
    "We'd love for you to join us and bless the couple 🙏\n";

  var toastEl = $("#toast"), toastTimer;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("is-shown");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove("is-shown"); }, 2200);
  }
  function copy(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    return new Promise(function (res, rej) {
      var ta = document.createElement("textarea");
      ta.value = text; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy") ? res() : rej(); } catch (e) { rej(e); }
      document.body.removeChild(ta);
    });
  }

  $("#shareWhatsapp").addEventListener("click", function () {
    window.open("https://wa.me/?text=" + encodeURIComponent(shareText + siteUrl), "_blank", "noopener");
  });
  $("#shareNative").addEventListener("click", function () {
    if (navigator.share) {
      navigator.share({ title: "Krishna & Nandini · Wedding Invitation", text: shareText, url: siteUrl }).catch(function () {});
    } else {
      copy(shareText + siteUrl).then(function () { toast("Invitation copied — paste anywhere"); }, function () { toast(siteUrl); });
    }
  });
  $("#shareCopy").addEventListener("click", function () {
    copy(siteUrl).then(function () {
      $("#copyText").textContent = "Copied!";
      toast("Link copied");
      setTimeout(function () { $("#copyText").textContent = "Copy link"; }, 2000);
    }, function () { toast(siteUrl); });
  });
})();
