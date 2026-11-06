/* =====================================================================
   Page engine. You shouldn't need to edit this; all content lives in
   content.js.
   ===================================================================== */
(function () {
  "use strict";

  var C = window.BDAY;
  if (!C || !C.sections) {
    document.body.classList.remove("locked");
    document.body.textContent = "content.js is missing or has a typo. Check the commas and quotes.";
    return;
  }

  var REDUCED = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var page = document.getElementById("page");
  var cover = document.getElementById("cover");
  var envelope = document.getElementById("envelope");
  var musicBtn = document.getElementById("musicBtn");
  var audio = document.getElementById("bgm");
  var canvas = document.getElementById("confetti");

  document.title = C.pageTitle || "Happy Birthday, " + (C.momName || "Mom");

  /* ---------- tiny DOM helper ---------- */
  function h(tag, attrs) {
    var el = document.createElement(tag);
    if (attrs) {
      for (var k in attrs) {
        var v = attrs[k];
        if (v == null || v === false) continue;
        if (k === "class") el.className = v;
        else if (k === "text") el.textContent = v;
        else if (k === "style") el.setAttribute("style", v);
        else el.setAttribute(k, v);
      }
    }
    for (var i = 2; i < arguments.length; i++) {
      var c = arguments[i];
      if (c == null || c === false) continue;
      if (Array.isArray(c)) c.forEach(function (x) { if (x) el.appendChild(x); });
      else el.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    }
    return el;
  }
  function d(ms) { return "--d:" + ms + "ms"; }
  function wait(ms) { return new Promise(function (r) { setTimeout(r, REDUCED ? 0 : ms); }); }

  function photo(src, icon) {
    var frame = h("div", { class: "photo", "data-icon": icon || "♥" });
    if (src) {
      var img = h("img", { alt: "", decoding: "async", draggable: "false" });
      img.onload = function () { frame.classList.add("loaded"); };
      img.onerror = function () { img.remove(); };
      img.src = src;
      frame.appendChild(img);
    }
    return frame;
  }

  function head(s) {
    return [
      s.label ? h("p", { class: "label rv", text: s.label }) : null,
      s.title ? h("h2", { class: "title rv", style: d(80), text: s.title }) : null,
    ];
  }
  function thanks(text) {
    if (!text) return null;
    return h("div", { class: "thanks rv", style: d(200) },
      h("span", { class: "thanks-tag", text: "Thank you" }),
      h("p", { text: text }));
  }

  /* ---------- cover ---------- */
  var cv = C.cover || {};
  document.getElementById("coverTo").textContent = cv.to || "To: Mommy";
  document.getElementById("coverHint").textContent = cv.hint || "Tap to open";
  document.getElementById("envCardText").textContent = cv.cardText || "Happy Birthday!";

  /* ---------- hero ---------- */
  var hr = C.hero || {};
  var heroEl = h("section", { class: "card hero" },
    hr.kicker ? h("p", { class: "label rv", text: hr.kicker }) : null,
    h("h1", { class: "hero-title rv", style: d(120) }, heroTitle(hr.title || "Happy Birthday, Mommy!")),
    h("figure", { class: "polaroid portrait tilt-l rv", style: d(300) },
      photo(hr.photo),
      hr.caption ? h("figcaption", { text: hr.caption }) : null),
    hr.subtitle ? h("p", { class: "hero-sub rv", style: d(450), text: hr.subtitle }) : null
  );
  function heroTitle(t) {
    // italicize everything after the comma: "Happy 48th Birthday, *Mommy!*"
    var i = t.indexOf(",");
    if (i < 0) return t;
    var f = document.createDocumentFragment();
    f.appendChild(document.createTextNode(t.slice(0, i + 1) + " "));
    f.appendChild(h("em", { text: t.slice(i + 1).trim() }));
    return f;
  }

  /* ---------- card builders ---------- */
  var builders = {
    panic: function (s, el) {
      el._play = function () { el.classList.add("go"); };
      el.append.apply(el, [].concat(head(s), [
        h("div", { class: "meter rv", style: d(150) },
          h("div", { class: "dial" }, h("span", { class: "dial-arc" }), h("span", { class: "needle" }), h("span", { class: "hub" })),
          h("div", { class: "meter-ends" },
            h("span", { text: s.meterLow || "chill" }),
            h("span", { class: "hot", text: s.meterHigh || "PANIC" }))),
        s.footer ? h("p", { class: "footer rv", style: d(400), text: s.footer }) : null,
      ]).filter(Boolean));
    },

    chat: function (s, el) {
      var body = h("div", { class: "chat-body" });
      var msgs = s.messages || [];
      el.append.apply(el, [].concat(head(s), [
        h("div", { class: "phone rv", style: d(150) },
          h("div", { class: "chat-top" },
            h("span", { class: "avatar", "aria-hidden": "true", text: (s.contact || "M").charAt(0) }),
            h("span", null,
              h("b", { text: s.contact || "Mommy" }),
              s.status ? h("small", { text: s.status }) : null)),
          body),
        s.footer ? h("p", { class: "footer rv", style: d(200), text: s.footer }) : null,
      ]).filter(Boolean));

      el._play = function () {
        var chain = wait(500);
        msgs.forEach(function (m) {
          chain = chain.then(function () {
            var dots = h("div", { class: "bubble " + m.from + " typing" }, h("i"), h("i"), h("i"));
            body.appendChild(dots);
            return wait(m.from === "me" ? 1400 : 900).then(function () {
              dots.remove();
              body.appendChild(h("div", { class: "bubble " + m.from },
                h("span", { text: m.text }),
                m.time ? h("time", { text: m.time }) : null));
              return wait(350);
            });
          });
        });
      };
    },

    volleyball: function (s, el) {
      var sets = s.sets || [];
      var rows = sets.map(function (st, i) {
        return h("div", { class: "set-row" },
          h("span", { class: "set-no", text: "Set " + (i + 1) }),
          h("span", { class: "sc " + (st[0] > st[1] ? "win" : ""), text: "–" }),
          h("span", { class: "sc " + (st[1] > st[0] ? "win" : ""), text: "–" }));
      });
      var wins = 0, losses = 0;
      sets.forEach(function (st) { st[0] > st[1] ? wins++ : losses++; });
      var final = h("div", { class: "final" },
        h("span", { class: "set-no", text: "Final" }),
        h("span", { class: "sc" + (wins > losses ? " win" : ""), text: String(wins) }),
        h("span", { class: "sc" + (losses > wins ? " win" : ""), text: String(losses) }));
      var verdict = h("p", { class: "verdict", text: s.verdict || "" });

      el.append.apply(el, [].concat(head(s), [
        h("div", { class: "board rv", style: d(150) },
          h("div", { class: "board-head" },
            h("span"),
            h("span", { class: "team us", text: s.team || "Choco Mucho" }),
            h("span", { class: "team", text: s.opponent || "Opponent" })),
          rows, final, verdict),
        s.footer ? h("p", { class: "footer rv", style: d(200), text: s.footer }) : null,
      ]).filter(Boolean));

      el._play = function () {
        var chain = wait(500);
        rows.forEach(function (row, i) {
          chain = chain.then(function () {
            var sc = row.querySelectorAll(".sc");
            sc[0].textContent = sets[i][0];
            sc[1].textContent = sets[i][1];
            row.classList.add("show", sets[i][0] > sets[i][1] ? "won" : "lost");
            return wait(i >= 2 ? 900 : 650);
          });
        });
        chain.then(function () { final.classList.add("show"); return wait(500); })
             .then(function () { verdict.classList.add("show"); });
      };
    },

    visa: function (s, el) {
      var stamps = (s.stamps || []).map(function (st, i) {
        return h("div", { class: "stamp s" + i },
          h("b", { text: st.code }),
          h("span", { text: "APPROVED" }),
          h("small", { text: st.country }));
      });
      el.append.apply(el, [].concat(head(s), [
        h("div", { class: "passport rv", style: d(150) },
          h("div", { class: "pp-head" }, h("span", { text: "VISAS" }), h("span", { text: "✈" })),
          h("div", { class: "pp-stamps" }, stamps)),
        s.body ? h("p", { class: "body rv", style: d(200), text: s.body }) : null,
        thanks(s.thanks),
      ]).filter(Boolean));
      el._play = function () { el.classList.add("go"); };
    },

    dish: function (s, el) {
      el.append.apply(el, [].concat(head(s), [
        h("figure", { class: "polaroid dish-photo tilt-r rv", style: d(150) },
          photo(s.photo, "🍲"),
          s.caption ? h("figcaption", { text: s.caption }) : null),
        thanks(s.thanks),
      ]).filter(Boolean));
    },

    iou: function (s, el) {
      var stamp = h("span", { class: "iou-stamp", "aria-hidden": "true", text: s.stamp || "PROMISE" });
      var hint = h("span", { class: "iou-hint", text: s.tapHint || "Tap to make it official" });
      var ticket = h("button", { type: "button", class: "ticket rv", style: d(150), "aria-label": "Stamp the promise" },
        h("span", { class: "ticket-l" }, h("b", { text: s.heading || "IOU" })),
        h("span", { class: "ticket-r" },
          h("span", { class: "ticket-text", text: s.text || "" }),
          s.valid ? h("small", { text: s.valid }) : null,
          hint),
        stamp);
      ticket.addEventListener("click", function () {
        if (ticket.classList.contains("stamped")) return;
        ticket.classList.add("stamped");
        if (navigator.vibrate) navigator.vibrate(30);
      });
      el.append.apply(el, [].concat(
        s.label ? h("p", { class: "label rv", text: s.label }) : null,
        ticket
      ).filter(Boolean));
    },

    grad: function (s, el) {
      el.append.apply(el, [].concat(head(s), [
        h("div", { class: "grad-art rv", style: d(150) },
          h("span", { class: "cap", "aria-hidden": "true", text: "🎓" }),
          h("div", { class: "diploma" },
            h("span", { class: "dip-title", text: s.diploma || "Diploma" }),
            h("span", { class: "dip-line" }),
            h("span", { class: "dip-class", text: s.classOf || "" }),
            h("span", { class: "dip-seal", "aria-hidden": "true" }))),
        s.body ? h("p", { class: "footer rv", style: d(300), text: s.body }) : null,
      ]).filter(Boolean));
      el._play = function () {
        el.classList.add("go");
        setTimeout(function () { confetti.burst(50); }, REDUCED ? 0 : 900);
      };
    },

    letter: function (s, el) {
      var paper = h("div", { class: "paper rv" });
      (s.lines || []).forEach(function (t, i) {
        paper.appendChild(t ? h("p", { class: "ln rv", style: d(150 + i * 60), text: t }) : h("div", { class: "gap" }));
      });
      if (s.signoff) paper.appendChild(h("p", { class: "ln signoff rv", style: d(300), text: s.signoff }));
      el.appendChild(paper);
    },

    cake: function (s, el) {
      var n = Math.max(1, Math.min(9, s.candles || 5));
      var out = 0;
      var candles = [];
      var row = h("div", { class: "candles" });
      for (var i = 0; i < n; i++) {
        (function (i) {
          var c = h("button", { type: "button", class: "candle", "aria-label": "Blow out candle " + (i + 1), style: "--i:" + i },
            h("span", { class: "flame" }), h("span", { class: "smoke" }), h("span", { class: "stick" }));
          c.addEventListener("click", function () {
            if (c.classList.contains("out")) return;
            c.classList.add("out");
            c.setAttribute("aria-label", "Candle " + (i + 1) + " is out");
            out++;
            if (out === n) setTimeout(finish, 400);
          });
          candles.push(c);
          row.appendChild(c);
        })(i);
      }
      var msg = h("div", { class: "cake-msg", "aria-live": "polite" },
        h("h2", { class: "big" }, heroTitle(s.after || "Happy Birthday, Mommy!")),
        s.afterSub ? h("p", { class: "body", text: s.afterSub }) : null,
        h("button", { type: "button", class: "relight", text: "↺ " + (s.relight || "Light them again") }));
      msg.querySelector(".relight").addEventListener("click", function () {
        out = 0;
        candles.forEach(function (c, i) { c.classList.remove("out"); c.setAttribute("aria-label", "Blow out candle " + (i + 1)); });
        el.classList.remove("done");
      });
      function finish() {
        el.classList.add("done");
        confetti.start();
        if (navigator.vibrate) navigator.vibrate([40, 60, 40]);
      }
      el.append(
        h("h2", { class: "title rv", text: s.title || "Make a wish" }),
        s.hint ? h("p", { class: "small rv", style: d(100), text: s.hint }) : document.createTextNode(""),
        h("div", { class: "cake-art rv", style: d(200) },
          row,
          h("div", { class: "tier top" }, h("span", { class: "drip" })),
          h("div", { class: "tier bottom" }, h("span", { class: "dots" })),
          h("div", { class: "plate" })),
        msg
      );
    },
  };

  /* ---------- build pages ---------- */
  var pages = [];
  function addPage(card) {
    var pg = h("div", { class: "pg", "aria-hidden": "true" }, h("div", { class: "pg-inner" }, card));
    pg._card = card;
    pages.push(pg);
    page.appendChild(pg);
  }
  addPage(heroEl);
  C.sections.forEach(function (s) {
    var build = builders[s.type];
    if (!build) { console.warn("Unknown section type:", s.type); return; }
    var el = h("section", { class: "card " + s.type });
    build(s, el);
    if (el._play) {
      var play = el._play;
      el._play = function () { if (el._played) return; el._played = true; play(); };
    }
    addPage(el);
  });
  var N = pages.length;

  /* ---------- page navigation ---------- */
  var nav = document.getElementById("nav");
  var prevBtn = document.getElementById("prevBtn");
  var nextBtn = document.getElementById("nextBtn");
  var dotsEl = document.getElementById("dots");
  pages.forEach(function () { dotsEl.appendChild(h("i")); });
  var cur = -1, playT;

  function go(to) {
    if (to < 0 || to >= N || to === cur) return;
    var dir = to > cur ? "fwd" : "back";
    var old = pages[cur], nw = pages[to];
    if (old) {
      old.classList.remove("active");
      old.classList.add("leaving");
      old.setAttribute("aria-hidden", "true");
      old.dataset.dir = dir;
      clearTimeout(old._t);
      old._t = setTimeout(function () { old.classList.remove("leaving"); }, 700);
    }
    clearTimeout(nw._t);
    nw.classList.remove("leaving");
    nw.dataset.dir = dir;
    nw.scrollTop = 0;
    void nw.offsetWidth; // restart animations
    nw.classList.add("active");
    nw.removeAttribute("aria-hidden");
    cur = to;

    for (var i = 0; i < N; i++) dotsEl.children[i].className = i === cur ? "on" : "";
    prevBtn.disabled = cur === 0;
    nextBtn.hidden = cur === N - 1;
    nextBtn.querySelector("span").textContent = cur === 0 ? "Start" : "Next";

    clearTimeout(playT);
    if (nw._card._play) playT = setTimeout(nw._card._play, REDUCED ? 0 : 450);
  }
  function next() { go(cur + 1); }
  function prev() { go(cur - 1); }
  prevBtn.addEventListener("click", prev);
  nextBtn.addEventListener("click", next);

  // horizontal swipe (vertical stays free for scrolling a tall page)
  var sx = 0, sy = 0, tracking = false;
  page.addEventListener("pointerdown", function (e) {
    if (e.button) return;
    tracking = true; sx = e.clientX; sy = e.clientY;
  });
  page.addEventListener("pointercancel", function () { tracking = false; });
  page.addEventListener("pointerup", function (e) {
    if (!tracking) return;
    tracking = false;
    var dx = e.clientX - sx, dy = e.clientY - sy;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.3) dx < 0 ? next() : prev();
  });
  document.addEventListener("keydown", function (e) {
    if (!opened || e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.key === "ArrowRight" || e.key === "PageDown") { e.preventDefault(); next(); }
    else if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); prev(); }
  });

  function startPages() {
    nav.hidden = false;
    var m = /[?&]p=(\d+)/.exec(location.search);
    go(m ? Math.max(0, Math.min(N - 1, parseInt(m[1], 10) - 1)) : 0);
  }

  /* ---------- confetti (canvas, stops itself) ---------- */
  var confetti = (function () {
    var ctx = canvas.getContext("2d");
    var parts = [], raf = 0, endAt = 0, W = 0, H = 0;
    var colors = C.confetti && C.confetti.length ? C.confetti : ["#D9485F", "#F2B544", "#fff"];

    function size() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function spawn(n, burst) {
      for (var i = 0; i < n; i++) {
        parts.push({
          x: burst ? W / 2 + (Math.random() - 0.5) * 80 : Math.random() * W,
          y: burst ? H * 0.55 : -20 - Math.random() * H * 0.4,
          vx: burst ? (Math.random() - 0.5) * 13 : (Math.random() - 0.5) * 2,
          vy: burst ? -7 - Math.random() * 10 : 2 + Math.random() * 3,
          r: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.3,
          w: 6 + Math.random() * 6, hgt: 8 + Math.random() * 8,
          c: colors[(Math.random() * colors.length) | 0],
          circle: Math.random() < 0.25, sway: Math.random() * 6.28,
        });
      }
    }
    function frame(t) {
      ctx.clearRect(0, 0, W, H);
      if (t < endAt && parts.length < 220 && Math.random() < 0.5) spawn(2, false);
      for (var i = parts.length - 1; i >= 0; i--) {
        var p = parts[i];
        p.vy = Math.min(p.vy + 0.18, 5.5);
        p.vx *= 0.985; p.sway += 0.05;
        p.x += p.vx + Math.sin(p.sway) * 0.6; p.y += p.vy; p.r += p.vr;
        if (p.y > H + 30) { parts.splice(i, 1); continue; }
        ctx.save();
        ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c;
        if (p.circle) { ctx.beginPath(); ctx.arc(0, 0, p.w / 2, 0, 6.283); ctx.fill(); }
        else ctx.fillRect(-p.w / 2, -p.hgt / 2, p.w, p.hgt * Math.abs(Math.cos(p.r * 1.3)) + 1);
        ctx.restore();
      }
      if (parts.length || t < endAt) raf = requestAnimationFrame(frame);
      else { raf = 0; ctx.clearRect(0, 0, W, H); }
    }
    function run(n, ms) {
      if (REDUCED) return;
      size(); spawn(n, true);
      endAt = Math.max(endAt, performance.now() + ms);
      if (!raf) raf = requestAnimationFrame(frame);
    }
    return {
      start: function () { run(110, 5000); },
      burst: function (n) { run(n || 40, 0); },
    };
  })();

  /* ---------- open the envelope ---------- */
  var opened = false;
  function open() {
    if (opened) return;
    opened = true;
    startMusic();
    cover.classList.add("opening");
    if (navigator.vibrate) navigator.vibrate(20);
    setTimeout(function () {
      cover.classList.add("gone");
      startPages();
      confetti.burst(60);
    }, REDUCED ? 50 : 1500);
    setTimeout(function () { cover.remove(); }, REDUCED ? 400 : 2300);
  }
  envelope.addEventListener("click", open);
  cover.addEventListener("click", function (e) { if (e.target === cover) open(); });

  // Skip the envelope while editing: index.html?open
  if (/[?&]open\b/.test(location.search)) {
    cover.remove();
    opened = true;
    startPages();
  }

  /* ---------- music ---------- */
  var hasMusic = !!(C.music && C.music.src);
  function setMusicUI(on) {
    musicBtn.setAttribute("aria-pressed", on ? "true" : "false");
    musicBtn.setAttribute("aria-label", on ? "Pause music" : "Play music");
    musicBtn.classList.toggle("on", on);
  }
  function startMusic() {
    if (!hasMusic) return;
    var p = audio.play();
    if (p && p.catch) p.catch(function () { setMusicUI(false); });
  }
  if (hasMusic) {
    audio.src = C.music.src;
    audio.volume = Math.max(0, Math.min(1, C.music.volume == null ? 0.6 : C.music.volume));
    musicBtn.hidden = false;
    musicBtn.addEventListener("click", function () { audio.paused ? startMusic() : audio.pause(); });
    audio.addEventListener("play", function () { setMusicUI(true); });
    audio.addEventListener("pause", function () { setMusicUI(false); });
    audio.addEventListener("error", function () { musicBtn.hidden = true; });
  }
})();
