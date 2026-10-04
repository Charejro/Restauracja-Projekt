/* ===================================================================
   Portowa Fala — wspólna logika stron (PL / EN)
   =================================================================== */
(function () {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const I18N = window.I18N;
  const t = (key, vars) => (I18N ? I18N.t(key, vars) : key);
  const pick = (obj, field) => (I18N ? I18N.pick(obj, field) : (obj ? obj[field] : ""));
  const MENU = window.MENU || {};
  const TAGS = window.MENU_TAGS || {};

  const zl = (n) => (I18N && I18N.lang === "en")
    ? "PLN " + n.toFixed(2)
    : n.toFixed(2).replace(".", ",") + " zł";

  /* ------------------------------------------------------------------
     1. KOSZYK (zapisywany w przeglądarce — działa między podstronami)
     ------------------------------------------------------------------ */
  const CART_KEY = "portowaFala_cart_v1";
  let cart = new Map();

  function loadCart() {
    try {
      const raw = localStorage.getItem(CART_KEY);
      cart = new Map(raw ? JSON.parse(raw) : []);
    } catch (e) {
      cart = new Map();
    }
  }
  function saveCart() {
    try { localStorage.setItem(CART_KEY, JSON.stringify(Array.from(cart.entries()))); } catch (e) {}
  }
  function cartTotal() {
    let sum = 0;
    cart.forEach((it) => { sum += it.price * it.qty; });
    return sum;
  }
  function cartCount() {
    let c = 0;
    cart.forEach((it) => { c += it.qty; });
    return c;
  }

  /* ------------------------------------------------------------------
     2. ELEMENTY WSPÓLNE (panel koszyka + powiadomienia)
     ------------------------------------------------------------------ */
  function ensureChrome() {
    if (!$("#toast")) {
      const el = document.createElement("div");
      el.className = "toast";
      el.id = "toast";
      el.setAttribute("role", "status");
      el.setAttribute("aria-live", "polite");
      document.body.appendChild(el);
    }
    if (!$("#cartDrawer")) {
      const overlay = document.createElement("div");
      overlay.className = "drawer-overlay";
      overlay.id = "drawerOverlay";
      const drawer = document.createElement("aside");
      drawer.className = "drawer";
      drawer.id = "cartDrawer";
      drawer.setAttribute("aria-label", "Koszyk");
      drawer.setAttribute("data-i18n-aria-label", "cart.aria");
      drawer.setAttribute("aria-hidden", "true");
      drawer.innerHTML = `
        <div class="drawer__head">
          <h3 data-i18n="cart.title">Twój koszyk</h3>
          <button class="icon-btn" id="closeCart" type="button" aria-label="Zamknij">✕</button>
        </div>
        <div class="drawer__body" id="cartItems" data-i18n-skip></div>
        <div class="drawer__foot">
          <div class="summary-total"><span data-i18n="cart.total">Razem</span><strong id="cartTotal" data-i18n-skip>0,00 zł</strong></div>
          <a class="btn btn--primary btn--block" href="zamow.html" data-i18n="cart.goToOrder">Przejdź do zamówienia</a>
        </div>`;
      document.body.appendChild(overlay);
      document.body.appendChild(drawer);

      overlay.addEventListener("click", closeCart);
      $("#closeCart").addEventListener("click", closeCart);
    }

    const cartBtn = $("#cartBtn");
    if (cartBtn && !cartBtn.dataset.bound) {
      cartBtn.dataset.bound = "1";
      cartBtn.addEventListener("click", openCart);
    }
    const items = $("#cartItems");
    if (items && !items.dataset.bound) {
      items.dataset.bound = "1";
      items.addEventListener("click", (e) => {
        const inc = e.target.closest("[data-inc]");
        const dec = e.target.closest("[data-dec]");
        const rem = e.target.closest("[data-remove]");
        if (inc) changeQty(inc.dataset.inc, 1);
        if (dec) changeQty(dec.dataset.dec, -1);
        if (rem) removeFromCart(rem.dataset.remove);
      });
    }
  }

  function openCart() {
    const d = $("#cartDrawer"), o = $("#drawerOverlay");
    if (!d) return;
    d.classList.add("is-open");
    if (o) o.classList.add("is-open");
    d.setAttribute("aria-hidden", "false");
  }
  function closeCart() {
    const d = $("#cartDrawer"), o = $("#drawerOverlay");
    if (d) { d.classList.remove("is-open"); d.setAttribute("aria-hidden", "true"); }
    if (o) o.classList.remove("is-open");
  }

  function addToCart(id, silent) {
    const item = window.findMenuItem ? window.findMenuItem(id) : null;
    if (!item) return;
    const cur = cart.get(id);
    if (cur) cur.qty += 1;
    else cart.set(id, { id: item.id, name: item.name, price: item.price, qty: 1 });
    saveCart();
    renderCart();
    if (!silent) toast(t("toast.added", { name: pick(item, "name") }), "ok");
    const btn = $("#cartBtn");
    if (btn && !silent) {
      btn.classList.remove("is-bump");
      void btn.offsetWidth;
      btn.classList.add("is-bump");
    }
  }

  function changeQty(id, delta) {
    const cur = cart.get(id);
    if (!cur) return;
    cur.qty += delta;
    if (cur.qty <= 0) cart.delete(id);
    saveCart();
    renderCart();
  }

  function removeFromCart(id) {
    cart.delete(id);
    saveCart();
    renderCart();
  }

  function renderCart() {
    const badge = $("#cartCount");
    if (badge) badge.textContent = cartCount();

    const box = $("#cartItems");
    if (box) {
      if (cart.size === 0) {
        box.innerHTML = `<p class="muted">${t("cart.empty")}</p>`;
      } else {
        box.innerHTML = Array.from(cart.values()).map((it) => {
          const img = window.dishArt ? window.dishArt(it) : "";
          const item = window.findMenuItem ? window.findMenuItem(it.id) : null;
          const name = item ? pick(item, "name") : it.name;
          return `
          <div class="cart-item">
            <img class="cart-item__img" src="${img}" alt="" width="46" height="46" />
            <div class="cart-item__info">
              <div class="cart-item__name">${name}</div>
              <div class="cart-item__price">${zl(it.price)} / ${I18N && I18N.lang === "en" ? "pc." : "szt."}</div>
              <div class="cart-item__qty">
                <button class="qty-btn" type="button" data-dec="${it.id}" aria-label="−">−</button>
                <span>${it.qty}</span>
                <button class="qty-btn" type="button" data-inc="${it.id}" aria-label="+">+</button>
                <button class="cart-item__remove" type="button" data-remove="${it.id}">${t("cart.remove")}</button>
              </div>
            </div>
            <strong>${zl(it.price * it.qty)}</strong>
          </div>`;
        }).join("");
      }
    }

    const total = $("#cartTotal");
    if (total) total.textContent = zl(cartTotal());
    updateOrderSummary();
  }

  function cartToText() {
    if (cart.size === 0) return "";
    return Array.from(cart.values()).map((it) => {
      const item = window.findMenuItem ? window.findMenuItem(it.id) : null;
      return `${it.qty}× ${item ? pick(item, "name") : it.name}`;
    }).join(", ");
  }

  /* ------------------------------------------------------------------
     3. MENU (menu.html)
     ------------------------------------------------------------------ */
  let currentCat = "zupy";

  function renderMenu(cat) {
    const grid = $("#menuGrid");
    if (!grid) return;
    if (cat) currentCat = cat;
    const items = MENU[currentCat] || [];
    grid.innerHTML = items.map((it, i) => {
      const src = window.dishArt ? window.dishArt(it, currentCat) : "";
      const name = pick(it, "name");
      const desc = pick(it, "desc");
      const tag = it.tag ? t(it.tag) : "";
      return `
      <article class="dish" style="animation-delay:${i * 40}ms">
        <img class="dish__photo" src="${src}" alt="${name}" width="400" height="250" />
        <div class="dish__body">
          ${tag ? `<span class="dish__tag">${tag}</span>` : ""}
          <div class="dish__head">
            <h3 class="dish__name">${name}</h3>
            <span class="dish__price">${zl(it.price)}</span>
          </div>
          <p class="dish__desc">${desc}</p>
          <div class="dish__foot">
            <span class="dish__allerg">${t(TAGS[currentCat] || "")}</span>
            <button class="btn btn--ghost" type="button" data-add="${it.id}">${t("+ Dodaj")}</button>
          </div>
        </div>
      </article>`;
    }).join("");
  }

  function initMenuPage() {
    const grid = $("#menuGrid");
    if (!grid) return;
    $$("#menuTabs .tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        $$("#menuTabs .tab").forEach((x) => { x.classList.remove("is-active"); x.setAttribute("aria-selected", "false"); });
        tab.classList.add("is-active");
        tab.setAttribute("aria-selected", "true");
        renderMenu(tab.dataset.cat);
      });
    });
    grid.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-add]");
      if (btn) addToCart(btn.dataset.add);
    });
    renderMenu($("#menuTabs .tab.is-active").dataset.cat);
  }

  /* ------------------------------------------------------------------
     4. ZAMÓWIENIE (zamow.html)
     ------------------------------------------------------------------ */
  function updateOrderSummary() {
    const list = $("#summaryList");
    if (!list) return;
    if (cart.size === 0) {
      list.innerHTML = `<li class="muted">${t("Koszyk jest pusty.")}</li>`;
    } else {
      list.innerHTML = Array.from(cart.values()).map((it) => {
        const item = window.findMenuItem ? window.findMenuItem(it.id) : null;
        const name = item ? pick(item, "name") : it.name;
        return `<li><span>${it.qty}× ${name}</span><span>${zl(it.price * it.qty)}</span></li>`;
      }).join("");
    }
    const total = cartTotal();
    const st = $("#summaryTotal");
    if (st) st.textContent = zl(total);
    const dep = $("#depositAmount");
    if (dep) dep.textContent = zl(total * 0.1);
    const pre = $("#prepayAmount");
    if (pre) pre.textContent = zl(total);
  }

  function initOrderPage() {
    const orderForm = $("#orderForm");
    if (!orderForm) return;

    const payField = $("#payField");
    const addressField = $("#orderAddress") ? $("#orderAddress").closest(".field") : null;
    const addressWrap = $("#orderAddress") ? $("#orderAddress").closest(".field") : null;

    function syncFulfilment() {
      const val = orderForm.querySelector('input[name="fulfilment"]:checked').value;
      const isDelivery = val === "dowóz";
      if (payField) payField.style.display = isDelivery ? "" : "none";
      if (addressWrap) addressWrap.style.display = isDelivery ? "" : "none";
      const addr = $("#orderAddress");
      if (addr) addr.required = isDelivery;
    }
    orderForm.querySelectorAll('input[name="fulfilment"]').forEach((r) => r.addEventListener("change", syncFulfilment));
    syncFulfilment();

    const link = $("#addCartToForm");
    if (link) link.addEventListener("click", () => {
      if (cart.size === 0) { toast(t("toast.addFirst"), "err"); return; }
      const field = $("#orderFood");
      field.value = cartToText();
      clearError(field);
      toast(t("toast.cartInserted"), "ok");
    });

    orderForm.addEventListener("input", (e) => {
      if (e.target.matches("input, textarea")) clearError(e.target);
    });

    orderForm.addEventListener("submit", (e) => {
      e.preventDefault();
      let ok = true;
      const phone = $("#orderPhone");
      const address = $("#orderAddress");
      const food = $("#orderFood");
      const fulfilment = orderForm.querySelector('input[name="fulfilment"]:checked').value;

      if (phone.value.replace(/\D/g, "").length < 9) { setError(phone, t("err.phoneMin")); ok = false; }
      if (fulfilment === "dowóz" && address.value.trim().length < 5) { setError(address, t("err.address")); ok = false; }
      if (food.value.trim().length < 3) { setError(food, t("err.food")); ok = false; }
      if (!ok) { toast(t("toast.missing"), "err"); return; }

      const payment = fulfilment === "dowóz"
        ? orderForm.querySelector('input[name="payment"]:checked').value
        : "onsite";
      const total = cartTotal();
      let kwota;
      if (fulfilment !== "dowóz") kwota = t("pay.onsite");
      else if (payment === "zaliczka") kwota = t("pay.deposit", { amount: zl(total * 0.1) });
      else kwota = t("pay.prepay", { amount: zl(total) });

      toast(t("toast.orderOk", { phone: phone.value.trim(), payment: kwota }), "ok");
      orderForm.reset();
      syncFulfilment();
      cart.clear();
      saveCart();
      renderCart();
    });
  }

  /* ------------------------------------------------------------------
     5. REZERWACJA (rezerwacja.html)
     ------------------------------------------------------------------ */
  const TABLES = [
    { id: "T1", label: "10", x: 18, y: 20, seats: 2, shape: "round", zone: "taras" },
    { id: "T2", label: "11", x: 39, y: 17, seats: 4, shape: "round", zone: "taras" },
    { id: "T3", label: "12", x: 61, y: 17, seats: 4, shape: "round", zone: "taras" },
    { id: "T4", label: "13", x: 82, y: 20, seats: 2, shape: "round", zone: "taras" },
    { id: "W1", label: "1", x: 16, y: 45, seats: 2, shape: "round", zone: "window" },
    { id: "W2", label: "2", x: 31, y: 44, seats: 2, shape: "round", zone: "window" },
    { id: "W3", label: "3", x: 47, y: 44, seats: 4, shape: "square", zone: "window" },
    { id: "W4", label: "4", x: 65, y: 44, seats: 4, shape: "square", zone: "window" },
    { id: "W5", label: "5", x: 81, y: 45, seats: 2, shape: "round", zone: "window" },
    { id: "S1", label: "6", x: 22, y: 72, seats: 4, shape: "square", zone: "sala" },
    { id: "S2", label: "7", x: 41, y: 74, seats: 6, shape: "square", zone: "sala" },
    { id: "S3", label: "8", x: 61, y: 74, seats: 6, shape: "square", zone: "sala" },
    { id: "S4", label: "9", x: 80, y: 72, seats: 4, shape: "square", zone: "sala" }
  ];
  const EMOJI = { 0: "☀️", 1: "🌤️", 2: "⛅", 3: "☁️", 45: "🌫️", 48: "🌫️", 51: "🌦️", 53: "🌦️", 55: "🌦️", 61: "🌧️", 63: "🌧️", 65: "🌧️", 66: "🌨️", 67: "🌨️", 71: "🌨️", 73: "🌨️", 75: "❄️", 80: "🌦️", 81: "🌧️", 82: "⛈️", 95: "⛈️", 96: "⛈️", 99: "⛈️" };

  let selectedTable = null;
  let booked = new Set();
  let weather = { open: true, temp: null, code: null, wind: null, demo: true };

  const COORDS = { lat: 54.7974, lon: 18.4003 };
  const zoneName = (zone) => t("zone." + zone);

  function evaluateWeather(temp, code, wind) {
    const precipitation = (code >= 51 && code <= 67) || (code >= 71 && code <= 77) ||
      (code >= 80 && code <= 82) || code >= 95;
    return !precipitation && !(wind != null && wind >= 40) && temp >= 15;
  }

  async function loadWeather() {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${COORDS.lat}&longitude=${COORDS.lon}` +
        `&current=temperature_2m,weather_code,wind_speed_10m&timezone=Europe%2FWarsaw`;
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const c = (await res.json()).current;
      weather = { open: evaluateWeather(c.temperature_2m, c.weather_code, c.wind_speed_10m), temp: c.temperature_2m, code: c.weather_code, wind: c.wind_speed_10m, demo: false };
    } catch (e) {
      const m = new Date().getMonth();
      weather = { open: m >= 4 && m <= 8, temp: null, code: null, wind: null, demo: true };
    }
    renderWeather();
  }

  function renderWeather() {
    const box = $("#weatherBox");
    if (!box) return;
    const tempEl = $("#weatherTemp"), descEl = $("#weatherDesc"), seatsEl = $("#weatherSeats"), iconEl = $("#weatherIcon");

    if (tempEl) {
      tempEl.textContent = weather.temp != null
        ? `${Math.round(weather.temp)}°C · ${I18N ? I18N.weatherDesc(weather.code) : ""}`
        : (weather.open ? t("weather.terraceOpen") : t("weather.terraceClosed"));
    }
    if (iconEl) iconEl.textContent = weather.demo ? (weather.open ? "🌤️" : "🌧️") : (EMOJI[weather.code] || "🌥️");
    if (descEl) {
      descEl.textContent = weather.demo
        ? t("weather.demo")
        : t("weather.live", { wind: Math.round(weather.wind) });
    }
    if (seatsEl) seatsEl.textContent = weather.open ? t("weather.open") : t("weather.closed");

    box.classList.toggle("weather--open", weather.open);
    box.classList.toggle("weather--closed", !weather.open);
    const floor = $("#floor");
    if (floor) floor.classList.toggle("floor--weather-closed", !weather.open);
    const label = $("#terraceLabel");
    if (label) label.textContent = weather.open ? t("terrace.open") : t("terrace.closed");

    if (selectedTable && !weather.open) {
      const tb = TABLES.find((x) => x.id === selectedTable);
      if (tb && tb.zone === "taras") selectedTable = null;
    }
    renderFloor();
    renderPicked();
  }

  function hash(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return (h >>> 0) / 4294967295;
  }
  function isTaken(tableId, date, time) {
    const key = `${date}|${time}|${tableId}`;
    if (booked.has(key)) return true;
    return hash(key) < 0.32;
  }

  function renderFloor() {
    const floor = $("#floor");
    if (!floor) return;
    const date = $("#resDate").value, time = $("#resTime").value;
    const guests = Number($("#resGuests").value);
    $$(".table", floor).forEach((el) => el.remove());
    TABLES.forEach((tb) => {
      const el = document.createElement("button");
      el.type = "button";
      el.className = `table table--${tb.shape} table--zone-${tb.zone}`;
      el.style.left = tb.x + "%";
      el.style.top = tb.y + "%";
      const size = tb.seats >= 6 ? 74 : tb.seats === 4 ? 62 : 50;
      el.style.width = size + "px";
      el.style.height = size + "px";
      el.dataset.table = tb.id;

      const taken = isTaken(tb.id, date, time);
      const tooSmall = tb.seats < guests;
      const outdoorClosed = tb.zone === "taras" && !weather.open;

      if (selectedTable === tb.id && !taken && !tooSmall && !outdoorClosed) el.classList.add("table--selected");
      else if (taken) el.classList.add("table--taken");
      else if (outdoorClosed) el.classList.add("table--weather");
      else if (tooSmall) el.classList.add("table--small");
      else el.classList.add("table--free");

      const reason = taken ? t("reason.taken")
        : outdoorClosed ? t("reason.weather")
          : tooSmall ? t("reason.small")
            : t("reason.free");
      el.innerHTML = `<span>${tb.label}<small>${tb.seats}${I18N && I18N.lang === "en" ? " p." : " os."}</small></span>`;
      el.title = t("res.tableTitle", { label: tb.label, seats: tb.seats, zone: zoneName(tb.zone), reason });
      if (taken || tooSmall || outdoorClosed) el.disabled = true;
      floor.appendChild(el);
    });
  }

  function renderPicked() {
    const box = $("#resPicked");
    if (!box) return;
    const sum = $("#resFormSummary");
    if (!selectedTable) {
      box.innerHTML = `<p class="muted">${t("res.none")}</p>`;
      if (sum) sum.innerHTML = "";
      return;
    }
    const tb = TABLES.find((x) => x.id === selectedTable);
    const date = $("#resDate").value, time = $("#resTime").value, guests = $("#resGuests").value;
    const outdoorNote = tb.zone === "taras" ? `<p class="muted">${t("res.outdoor")}</p>` : "";
    box.innerHTML = `<p>${t("res.picked", { label: tb.label, seats: tb.seats })}<br>${zoneName(tb.zone)}</p>
      ${outdoorNote}
      <p class="muted">${t("res.pickedMeta", { date, time, guests })}</p>`;
    if (sum) sum.innerHTML = t("res.summary", { label: tb.label, zone: zoneName(tb.zone), date, time, guests });
  }

  function initReservationPage() {
    if (!$("#floor")) return;
    const resDate = $("#resDate"), resTime = $("#resTime"), resGuests = $("#resGuests");

    for (let h = 12; h <= 21; h++) {
      for (const m of ["00", "30"]) {
        const opt = document.createElement("option");
        opt.value = `${String(h).padStart(2, "0")}:${m}`;
        opt.textContent = opt.value;
        resTime.appendChild(opt);
      }
    }
    resTime.value = "18:00";
    const today = new Date().toISOString().slice(0, 10);
    resDate.value = today;
    resDate.min = today;

    const floor = $("#floor");
    floor.addEventListener("click", (e) => {
      const el = e.target.closest(".table");
      if (!el || el.disabled) return;
      const tb = TABLES.find((x) => x.id === el.dataset.table);
      if (!tb) return;
      selectedTable = tb.id;
      renderFloor();
      renderPicked();
    });

    [resDate, resTime, resGuests].forEach((el) => el.addEventListener("change", () => {
      selectedTable = null;
      renderFloor();
      renderPicked();
    }));

    $("#resForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const name = $("#resName"), phone = $("#resPhone");
      let ok = true;
      if (name.value.trim().length < 3) { setError(name, t("err.resName")); ok = false; } else clearError(name);
      if (phone.value.replace(/\D/g, "").length < 9) { setError(phone, t("err.resPhone")); ok = false; } else clearError(phone);
      if (!selectedTable) { toast(t("err.pickTable"), "err"); return; }
      if (!ok) { toast(t("err.resMissing"), "err"); return; }

      const tb = TABLES.find((x) => x.id === selectedTable);
      booked.add(`${resDate.value}|${resTime.value}|${selectedTable}`);
      toast(t("toast.booked", { table: tb.label, date: resDate.value, time: resTime.value }), "ok");
      e.target.reset();
      resDate.value = today;
      resTime.value = "18:00";
      selectedTable = null;
      renderFloor();
      renderPicked();
    });

    renderFloor();
    renderPicked();
    loadWeather();
  }

  /* ------------------------------------------------------------------
     6. WALIDACJA, POWIADOMIENIA, NAWIGACJA, OBRAZY
     ------------------------------------------------------------------ */
  function setError(field, message) {
    const wrap = field.closest(".field");
    wrap.classList.add("has-error");
    const err = wrap.querySelector(".err");
    if (err) err.textContent = message;
  }
  function clearError(field) {
    const wrap = field.closest(".field");
    if (wrap) wrap.classList.remove("has-error");
  }

  let toastTimer;
  function toast(msg, kind) {
    const el = $("#toast");
    if (!el) return;
    el.textContent = msg;
    el.className = "toast is-visible" + (kind ? " toast--" + kind : "");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { el.className = "toast"; }, 4500);
  }

  function initNav() {
    const hamburger = $("#hamburger"), links = $("#navLinks");
    if (hamburger && links) {
      hamburger.addEventListener("click", () => {
        links.classList.toggle("is-open");
        hamburger.setAttribute("aria-expanded", links.classList.contains("is-open") ? "true" : "false");
      });
      links.addEventListener("click", (e) => {
        if (e.target.tagName === "A") links.classList.remove("is-open");
      });
    }
    const year = $("#year");
    if (year) year.textContent = new Date().getFullYear();
  }

  function initPlaceImages() {
    if (!window.placeArt) return;
    $$("[data-place]").forEach((el) => { el.src = window.placeArt(el.dataset.place); });
  }

  /* Mapa Google — Port Rybacki, Władysławowo */
  const MAP_QUERY = "54.7942,18.4178";
  function initMaps() {
    const frames = $$("[data-map]");
    if (!frames.length) return;
    const hl = (I18N && I18N.lang === "en") ? "en" : "pl";
    const src = `https://maps.google.com/maps?q=${MAP_QUERY}&z=15&hl=${hl}&output=embed`;
    frames.forEach((f) => { if (f.getAttribute("src") !== src) f.setAttribute("src", src); });
  }

  function refreshDynamic() {
    renderMenu();
    renderCart();
    initMaps();
    if ($("#floor")) { renderWeather(); }
  }

  /* ------------------------------------------------------------------
     7. START
     ------------------------------------------------------------------ */
  loadCart();
  ensureChrome();
  initNav();
  initPlaceImages();
  initMaps();
  initMenuPage();
  initOrderPage();
  initReservationPage();
  renderCart();
  if (I18N) I18N.refresh();

  document.addEventListener("pf:langchange", refreshDynamic);
})();
