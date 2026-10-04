/* ===================================================================
   Portowa Fala — agent testowy
   Aktywny wyłącznie, gdy adres zawiera parametr ?test=1.
   W normalnym użyciu strony skrypt kończy działanie od razu.
   Odbiera testy z testy.html przez postMessage, wykonuje je na
   prawdziwej stronie i odsyła wyniki.
   =================================================================== */
(function () {
  "use strict";

  var params;
  try { params = new URLSearchParams(window.location.search); } catch (err) { return; }
  if (!params.has("test")) return;

  var RUN = params.get("r") || "";
  var errors = [];

  function push(msg) { if (errors.length < 60) errors.push(String(msg)); }

  /* --- Zbieranie błędów strony (tylko pliki lokalne — błędy sieci
         pokroju czcionek Google nie psują testów offline) --- */
  window.addEventListener("error", function (e) {
    var t = e.target;
    if (t && t !== window && t.tagName) {
      var url = t.src || t.href || "";
      if (url.indexOf("http") !== 0) push("Nie załadowano pliku: " + url.split("/").pop());
      return;
    }
    push("Błąd JS: " + (e.message || "?") + (e.lineno ? " (linia " + e.lineno + ")" : ""));
  }, true);

  window.addEventListener("unhandledrejection", function (e) {
    var r = e.reason;
    push("Odrzucony Promise: " + ((r && (r.message || r)) || "?"));
  });

  var origError = console.error ? console.error.bind(console) : function () {};
  console.error = function () {
    try { push("console.error: " + Array.prototype.slice.call(arguments).join(" ")); } catch (x) { /* ignore */ }
    origError.apply(null, arguments);
  };

  /* --- W trybie testowym przewijanie wewnątrz ramki nie może przesuwać
         panelu testów (scrollIntoView potrafi przewinąć też dokument-rodzica). --- */
  try {
    Element.prototype.scrollIntoView = function () { /* celowo puste */ };
  } catch (e) { /* ignore */ }

  /* --- Znaczek trybu testowego --- */
  function addBadge() {
    if (document.getElementById("pf-test-badge")) return;
    var b = document.createElement("div");
    b.id = "pf-test-badge";
    b.textContent = "🧪 TRYB TESTOWY";
    b.style.cssText = "position:fixed;left:10px;bottom:10px;z-index:2147483647;background:#082036;color:#fff;" +
      "font:600 11px/1 system-ui,sans-serif;padding:7px 10px;border-radius:999px;opacity:.85;pointer-events:none";
    (document.body || document.documentElement).appendChild(b);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", addBadge);
  else addBadge();

  /* --- Pomocnik: czekanie na warunek --- */
  function waitFor(fn, timeout, label) {
    if (timeout == null) timeout = 4000;
    var start = Date.now();
    return new Promise(function (resolve, reject) {
      (function tick() {
        var v;
        try { v = fn(); } catch (e) { v = false; }
        if (v) return resolve(v);
        if (Date.now() - start > timeout) {
          return reject(new Error("Przekroczono czas oczekiwania (" + timeout + " ms): " + (label || "warunek nie spełniony")));
        }
        setTimeout(tick, 50);
      })();
    });
  }

  /* --- Kontekst przekazywany do każdego testu --- */
  function makeCtx(warns) {
    var C = {};

    C.$ = function (sel, root) { return (root || document).querySelector(sel); };
    C.$$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

    C.text = function (target) {
      var el = typeof target === "string" ? C.$(target) : target;
      return el ? el.textContent.replace(/\s+/g, " ").trim() : null;
    };

    C.click = function (target) {
      var el = typeof target === "string" ? C.$(target) : target;
      if (!el) throw new Error("Nie znaleziono elementu do kliknięcia: " + target);
      el.click();
      return el;
    };

    C.set = function (target, value) {
      var el = typeof target === "string" ? C.$(target) : target;
      if (!el) throw new Error("Nie znaleziono pola: " + target);
      el.value = value;
      el.dispatchEvent(new Event("input", { bubbles: true }));
      el.dispatchEvent(new Event("change", { bubbles: true }));
      return el;
    };

    C.check = function (name, value) {
      var el = C.$('input[name="' + name + '"][value="' + value + '"]');
      if (!el) throw new Error('Nie znaleziono opcji "' + value + '" w grupie ' + name);
      el.checked = true;
      el.dispatchEvent(new Event("change", { bubbles: true }));
      return el;
    };

    C.submit = function (target) {
      var f = typeof target === "string" ? C.$(target) : target;
      if (!f) throw new Error("Nie znaleziono formularza: " + target);
      if (typeof f.requestSubmit === "function") f.requestSubmit();
      else f.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
    };

    C.wait = waitFor;
    C.sleep = function (ms) { return new Promise(function (res) { setTimeout(res, ms); }); };

    C.assert = function (cond, msg) {
      if (!cond) throw new Error(msg || "Warunek nie został spełniony");
    };
    C.eq = function (actual, expected, msg) {
      if (actual !== expected) {
        throw new Error((msg || "Niezgodność") + " — oczekiwano: " + JSON.stringify(expected) + ", otrzymano: " + JSON.stringify(actual));
      }
    };
    C.match = function (str, re, msg) {
      if (!re.test(String(str))) {
        throw new Error((msg || "Brak dopasowania") + " — wzorzec " + re + ", wartość: " + JSON.stringify(str));
      }
    };

    C.warn = function (msg) { warns.push(String(msg)); };
    C.errors = function () { return errors.slice(); };

    C.today = function () {
      var d = new Date();
      var m = String(d.getMonth() + 1).padStart(2, "0");
      var day = String(d.getDate()).padStart(2, "0");
      return d.getFullYear() + "-" + m + "-" + day;
    };

    return C;
  }

  function reply(id, payload) {
    payload.pf = 1;
    payload.cmd = "result";
    payload.id = id;
    try { parent.postMessage(payload, "*"); } catch (e) { /* ignore */ }
  }

  window.addEventListener("message", function (ev) {
    var d = ev.data || {};
    if (!d || d.pf !== 1 || d.cmd !== "run") return;

    var warns = [];
    var fn;
    try {
      fn = new Function("ctx", "return (" + d.code + ")(ctx)");
    } catch (e) {
      reply(d.id, { ok: false, error: "Błąd składni testu: " + e.message });
      return;
    }

    var ctx = makeCtx(warns);
    Promise.resolve()
      .then(function () { return fn(ctx); })
      .then(
        function () { reply(d.id, { ok: true, warns: warns }); },
        function (e) {
          reply(d.id, {
            ok: false,
            error: (e && e.message) || String(e),
            stack: e && e.stack ? String(e.stack).split("\n").slice(0, 4).join("\n") : "",
            warns: warns
          });
        }
      );
  });

  /* --- Zgłoszenie gotowości do panelu testów --- */
  function ready() {
    try { parent.postMessage({ pf: 1, cmd: "ready", r: RUN }, "*"); } catch (e) { /* ignore */ }
  }
  if (document.readyState === "interactive" || document.readyState === "complete") ready();
  else document.addEventListener("DOMContentLoaded", ready);
})();
