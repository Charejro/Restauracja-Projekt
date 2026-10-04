/* ===================================================================
   Portowa Fala — wspólna logika stron
   Strona główna: opis + zdjęcia + przyciski (Menu / Rezerwacja)
   Podstrony: menu, zamówienie, rezerwacja
   =================================================================== */
(function () {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const zl = (n) => n.toFixed(2).replace(".", ",") + " zł";
  const MENU = window.MENU || {};
  const TAGS = window.MENU_TAGS || {};

  /* ------------------------------------------------------------------
     1. KOSZYK (zapisywany w przeglądarce — działa między podstronami)
     ------------------------------------------------------------------ */
  const CART_KEY = "portowaFala_cart_v1";
  let cart = new Map();

  function loadCart() {
    try {
      const raw = localStorage.getItem(CART_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      cart = new Map(arr);
    } catch (e) {
      cart = new Map();
    }
  }
  function saveCart() {
    try { localStorage.setItem(CART_KEY, JSON.stringify(Array.from(cart.entries()))); } catch (e) {}
  }
  function cartTotal() {
    let t = 0;
    cart.forEach((it) => { t += it.price * it.qty; });
    return t;
  }
  function cartCount() {
    let c = 0;
    cart.forEach((it) => { c += it.qty; });
    return c;
  }

  /* ------------------------------------------------------------------
     2. ELEMENTY WSPÓLNE (panel koszyka + powiadomienia) — wstrzykiwane
     ------------------------------------------------------------------ */
  function ensureChrome() {
    if (!$("#toast")) {
      const t = document.createElement("div");
      t.className = "toast";
      t.id = "toast";
      t.setAttribute("role", "status");
      t.setAttribute("aria-live", "polite");
      document.body.appendChild(t);
    }
    if (!$("#cartDrawer")) {
      const overlay = document.createElement("div");
      overlay.className = "drawer-overlay";
      overlay.id = "drawerOverlay";
      const drawer = document.createElement("aside");
      drawer.className = "drawer";
      drawer.id = "cartDrawer";
      drawer.setAttribute("aria-label", "Koszyk");
      drawer.setAttribute("aria-hidden", "true");
      drawer.innerHTML = `
        <div class="drawer__head">
          <h3>Twój koszyk</h3>
          <button class="icon-btn" id="closeCart" type="button" aria-label="Zamknij">✕</button>
        </div>
        <div class="drawer__body" id="cartItems"></div>
        <div class="drawer__foot">
          <div class="summary-total"><span>Razem</span><strong id="cartTotal">0,00 zł</strong></div>
          <a class="btn btn--primary btn--block" href="zamow.html" id="cartToOrder">Przejdź do zamówienia</a>
        </div>`;
      document.body.appendChild(overlay);
      document.body.appendChild(drawer);

      overlay.addEventListener("click", closeCart);
      $("#closeCart").addEventListener("click", closeCart);
      closeCart();
    }

    $("#cartBtn") && $("#cartBtn").addEventListener("click", openCart);
    $("#cartItems") && $("#cartItems").addEventListener("click", (e) => {
      const inc = e.target.closest("[data-inc]");
      const dec = e.target.closest("[data-dec]");
      const rem = e.target.closest("[data-remove]");
      if (inc) changeQty(inc.dataset.inc, 1);
      if (dec) changeQty(dec.dataset.dec, -1);
      if (rem) removeFromCart(rem.dataset.remove);
    });
  }

  function openCart() {
    $("#cartDrawer").classList.add("is-open");
    $("#drawerOverlay").classList.add("is-open");
    $("#cartDrawer").setAttribute("aria-hidden", "false");
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
    if (!silent) toast(`Dodano: ${item.name}`, "ok");
    if ($("#cartBtn") && !silent) {
      $("#cartBtn").classList.remove("is-bump");
      void $("#cartBtn").offsetWidth;
      $("#cartBtn").classList.add("is-bump");
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
        box.innerHTML = `<p class="muted">Koszyk jest pusty. Dodaj dania z <a href="menu.html">menu</a>.</p>`;
      } else {
        box.innerHTML = Array.from(cart.values()).map((it) => {
          const img = window.dishArt ? window.dishArt(it) : "";
          return `
          <div class="cart-item">
            <img class="cart-item__img" src="${img}" alt="" width="46" height="46" />
            <div class="cart-item__info">
              <div class="cart-item__name">${it.name}</div>
              <div class="cart-item__price">${zl(it.price)} / szt.</div>
              <div class="cart-item__qty">
                <button class="qty-btn" type="button" data-dec="${it.id}" aria-label="Mniej">−</button>
                <span>${it.qty}</span>
                <button class="qty-btn" type="button" data-inc="${it.id}" aria-label="Więcej">+</button>
                <button class="cart-item__remove" type="button" data-remove="${it.id}">usuń</button>
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
    return Array.from(cart.values()).map((it) => `${it.qty}× ${it.name}`).join(", ");
  }

  /* ------------------------------------------------------------------
     3. MENU (menu.html)
     ------------------------------------------------------------------ */
  function renderMenu(cat) {
    const grid = $("#menuGrid");
    if (!grid) return;
    const items = MENU[cat] || [];
    grid.innerHTML = items.map((it, i) => {
      const src = window.dishArt ? window.dishArt(it, cat) : "";
      return `
      <article class="dish" style="animation-delay:${i * 40}ms">
        <img class="dish__photo" src="${src}" alt="${it.name}" width="400" height="250" />
        <div class="dish__body">
          ${it.tag ? `<span class="dish__tag">${it.tag}</span>` : ""}
          <div class="dish__head">
            <h3 class="dish__name">${it.name}</h3>
            <span class="dish__price">${zl(it.price)}</span>
          </div>
          <p class="dish__desc">${it.desc}</p>
          <div class="dish__foot">
            <span class="dish__allerg">${TAGS[cat] || ""}</span>
            <button class="btn btn--ghost" type="button" data-add="${it.id}">+ Dodaj</button>
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
        $$("#menuTabs .tab").forEach((t) => { t.classList.remove("is-active"); t.setAttribute("aria-selected", "false"); });
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
      list.innerHTML = `<li class="muted">Koszyk jest pusty.</li>`;
    } else {
      list.innerHTML = Array.from(cart.values()).map((it) =>
        `<li><span>${it.qty}× ${it.name}</span><span>${zl(it.price * it.qty)}</span></li>`).join("");
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

    function syncFulfilment() {
      const val = orderForm.querySelector('input[name="fulfilment"]:checked').value;
      const isDelivery = val === "dowóz";
      if (payField) payField.style.display = isDelivery ? "" : "none";
      if (addressField) addressField.style.display = isDelivery ? "" : "none";
      const addr = $("#orderAddress");
      if (addr) addr.required = isDelivery;
    }
    orderForm.querySelectorAll('input[name="fulfilment"]').forEach((r) => r.addEventListener("change", syncFulfilment));
    syncFulfilment();

    const link = $("#addCartToForm");
    if (link) link.addEventListener("click", () => {
      if (cart.size === 0) { toast("Najpierw dodaj coś z menu.", "err"); return; }
      const field = $("#orderFood");
      field.value = cartToText();
      clearError(field);
      toast("Koszyk wstawiony do zamówienia", "ok");
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

      if (phone.value.replace(/\D/g, "").length < 9) { setError(phone, "Podaj poprawny numer telefonu (min. 9 cyfr)."); ok = false; }
      if (fulfilment === "dowóz" && address.value.trim().length < 5) { setError(address, "Podaj pełny adres dostawy."); ok = false; }
      if (food.value.trim().length < 3) { setError(food, "Napisz, co chcesz zjeść."); ok = false; }
      if (!ok) { toast("Uzupełnij brakujące dane.", "err"); return; }

      const payment = fulfilment === "dowóz"
        ? orderForm.querySelector('input[name="payment"]:checked').value
        : "płatność przy odbiorze";
      const total = cartTotal();
      const kwota = fulfilment === "dowóz" && payment === "zaliczka"
        ? `Zaliczka ${zl(total * 0.1)} (10%), resztę płacisz kurierowi.`
        : fulfilment === "dowóz"
          ? `Płatność z góry: ${zl(total)}.`
          : "Płatność na miejscu.";

      toast(`Zamówienie przyjęte! Oddzwonimy na ${phone.value.trim()}. ${kwota}`, "ok");
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
  const ZONE_NAME = { window: "przy oknie (widok na morze)", sala: "sala główna", taras: "taras na zewnątrz" };
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

  let selectedTable = null;
  let booked = new Set();
  let weather = { open: true, temp: null, code: null, wind: null, demo: true };

  const COORDS = { lat: 54.7974, lon: 18.4003 }; // Władysławowo
  const WMO = {
    0: ["bezchmurnie", "☀️"], 1: ["głównie bezchmurnie", "🌤️"], 2: ["częściowe zachmurzenie", "⛅"],
    3: ["zachmurzenie", "☁️"], 45: ["mgła", "🌫️"], 48: ["mgła osadzająca", "🌫️"],
    51: ["mżawka", "🌦️"], 53: ["mżawka", "🌦️"], 55: ["mżawka", "🌦️"],
    61: ["deszcz", "🌧️"], 63: ["deszcz", "🌧️"], 65: ["ulewa", "🌧️"],
    66: ["deszcz ze śniegiem", "🌨️"], 67: ["deszcz ze śniegiem", "🌨️"],
    71: ["śnieg", "🌨️"], 73: ["śnieg", "🌨️"], 75: ["śnieg", "❄️"],
    80: ["przelotne opady", "🌦️"], 81: ["przelotne opady", "🌧️"], 82: ["nawałnica", "⛈️"],
    95: ["burza", "⛈️"], 96: ["burza z gradem", "⛈️"], 99: ["burza z gradem", "⛈️"]
  };
  const weatherInfo = (code) => WMO[code] || ["zmienne warunki", "🌥️"];

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
    const [text, emoji] = weather.code != null ? weatherInfo(weather.code) : [];
    $("#weatherIcon").textContent = weather.demo ? (weather.open ? "🌤️" : "🌧️") : emoji;
    $("#weatherTemp").textContent = weather.temp != null
      ? `${Math.round(weather.temp)}°C · ${text}`
      : (weather.open ? "Taras otwarty" : "Taras zamknięty");
    $("#weatherDesc").textContent = weather.demo
      ? "Władysławowo · warunki szacowane (chwilowy brak danych)"
      : `Władysławowo · wiatr ${Math.round(weather.wind)} km/h · dane na żywo`;
    $("#weatherSeats").textContent = weather.open
      ? "✔ Stoliki na tarasie dostępne do rezerwacji"
      : "✖ Rezerwacja tarasu wstrzymana — wybierz stolik w środku";
    box.classList.toggle("weather--open", weather.open);
    box.classList.toggle("weather--closed", !weather.open);
    const floor = $("#floor");
    if (floor) floor.classList.toggle("floor--weather-closed", !weather.open);
    const label = $("#terraceLabel");
    if (label) {
      label.textContent = weather.open
        ? "☀️ TARAS na zewnątrz — przed oknem panoramicznym"
        : "🌧️ TARAS zamknięty — zła pogoda";
    }
    if (selectedTable && !weather.open) {
      const t = TABLES.find((x) => x.id === selectedTable);
      if (t && t.zone === "taras") selectedTable = null;
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
    TABLES.forEach((t) => {
      const el = document.createElement("button");
      el.type = "button";
      el.className = `table table--${t.shape} table--zone-${t.zone}`;
      el.style.left = t.x + "%";
      el.style.top = t.y + "%";
      const size = t.seats >= 6 ? 74 : t.seats === 4 ? 62 : 50;
      el.style.width = size + "px";
      el.style.height = size + "px";
      el.dataset.table = t.id;

      const taken = isTaken(t.id, date, time);
      const tooSmall = t.seats < guests;
      const outdoorClosed = t.zone === "taras" && !weather.open;

      if (selectedTable === t.id && !taken && !tooSmall && !outdoorClosed) el.classList.add("table--selected");
      else if (taken) el.classList.add("table--taken");
      else if (outdoorClosed) el.classList.add("table--weather");
      else if (tooSmall) el.classList.add("table--small");
      else el.classList.add("table--free");

      const reason = taken ? " • zajęty" : outdoorClosed ? " • taras zamknięty (zła pogoda)" : tooSmall ? " • za mały" : " • wolny";
      el.innerHTML = `<span>${t.label}<small>${t.seats} os.</small></span>`;
      el.title = `Stolik ${t.label} • ${t.seats} os. • ${ZONE_NAME[t.zone]}${reason}`;
      if (taken || tooSmall || outdoorClosed) el.disabled = true;
      floor.appendChild(el);
    });
  }

  function renderPicked() {
    const box = $("#resPicked");
    if (!box) return;
    const sum = $("#resFormSummary");
    if (!selectedTable) {
      box.innerHTML = `<p class="muted">Nie wybrano jeszcze stolika.</p>`;
      if (sum) sum.innerHTML = "";
      return;
    }
    const t = TABLES.find((x) => x.id === selectedTable);
    const date = $("#resDate").value, time = $("#resTime").value, guests = $("#resGuests").value;
    const outdoorNote = t.zone === "taras" ? `<p class="muted">Stolik na wolnym powietrzu — potwierdzimy go, jeśli pogoda dopisze.</p>` : "";
    box.innerHTML = `<p>Stolik <strong>${t.label}</strong> • ${t.seats} os.<br>${ZONE_NAME[t.zone]}</p>
      ${outdoorNote}
      <p class="muted">${date} o ${time} • ${guests} os.</p>`;
    if (sum) sum.innerHTML = `Wybrano: <b>stolik ${t.label}</b> (${ZONE_NAME[t.zone]}), <b>${date}</b> o <b>${time}</b> dla <b>${guests} os.</b>`;
  }

  function initReservationPage() {
    const floor = $("#floor");
    if (!floor) return;

    const resDate = $("#resDate"), resTime = $("#resTime"), resGuests = $("#resGuests");

    for (let h = 12; h <= 21; h++) {
      for (const m of ["00", "30"]) {
        const t = `${String(h).padStart(2, "0")}:${m}`;
        const opt = document.createElement("option");
        opt.value = t; opt.textContent = t;
        resTime.appendChild(opt);
      }
    }
    resTime.value = "18:00";
    const today = new Date().toISOString().slice(0, 10);
    resDate.value = today;
    resDate.min = today;

    floor.addEventListener("click", (e) => {
      const el = e.target.closest(".table");
      if (!el || el.disabled) return;
      const t = TABLES.find((x) => x.id === el.dataset.table);
      if (!t) return;
      selectedTable = t.id;
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
      if (name.value.trim().length < 3) { setError(name, "Podaj imię i nazwisko."); ok = false; } else clearError(name);
      if (phone.value.replace(/\D/g, "").length < 9) { setError(phone, "Podaj poprawny numer telefonu."); ok = false; } else clearError(phone);
      if (!selectedTable) { toast("Wybierz stolik na planie sali.", "err"); return; }
      if (!ok) { toast("Uzupełnij dane rezerwacji.", "err"); return; }

      const t = TABLES.find((x) => x.id === selectedTable);
      const key = `${resDate.value}|${resTime.value}|${selectedTable}`;
      booked.add(key);
      toast(`Stolik ${t.label} zarezerwowany na ${resDate.value} o ${resTime.value}. Do zobaczenia!`, "ok");
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
     6. WALIDACJA, POWIADOMIENIA, NAWIGACJA, OBRAZY MIEJSC
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
    $$("[data-place]").forEach((el) => {
      const kind = el.dataset.place;
      el.src = window.placeArt(kind);
    });
  }

  /* ------------------------------------------------------------------
     7. START
     ------------------------------------------------------------------ */
  loadCart();
  ensureChrome();
  initNav();
  initPlaceImages();
  initMenuPage();
  initOrderPage();
  initReservationPage();
  renderCart();
})();
