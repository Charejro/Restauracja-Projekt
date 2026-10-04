/* ===================================================================
   Tester strony — Portowa Fala
   Definicje testów + logika aplikacji. Działa w przeglądarce,
   bez serwera i bez instalacji (file://).
   =================================================================== */
(function () {
  "use strict";

  /* ------------------------------------------------------------------
     WIDOKI (szerokość × wysokość ramki w px)
     ------------------------------------------------------------------ */
  const V_DESK = [1366, 900];
  const V_MOB = [375, 760];

  /* ------------------------------------------------------------------
     DEFINICJE TESTÓW
     Każdy test to funkcja (ctx) => {...} wykonywana NA STRONIE.
     ctx udostępnia: $, $$, text, click, set, check, submit,
     wait, sleep, assert, eq, match, warn, errors, today.
     ------------------------------------------------------------------ */
  const SUITES = [
    {
      icon: "🏗️",
      name: "Ładowanie i metadane",
      tests: [
        {
          name: "Dokument ma ustawiony język polski",
          desc: "Atrybut lang=\"pl\" na elemencie strony (ważne dla SEO i czytników ekranu).",
          code: (ctx) => {
            ctx.eq(document.documentElement.getAttribute("lang"), "pl", "Atrybut lang dokumentu");
          }
        },
        {
          name: "Tytuł strony zawiera nazwę restauracji",
          desc: "Znacznik <title> powinien być opisowy i zawierać „Portowa Fala”.",
          code: (ctx) => {
            const t = (document.title || "").trim();
            ctx.assert(t.length >= 10, "Tytuł jest za krótki: " + JSON.stringify(t));
            ctx.assert(t.indexOf("Portowa Fala") !== -1, "Tytuł nie zawiera nazwy restauracji: " + JSON.stringify(t));
          }
        },
        {
          name: "Meta description (opis dla Google)",
          desc: "Opis powinien mieć 50–170 znaków; dłuższy bywa ucinany w wynikach wyszukiwania.",
          code: (ctx) => {
            const m = ctx.$('meta[name="description"]');
            ctx.assert(m, "Brak tagu <meta name=\"description\">");
            const len = (m.getAttribute("content") || "").trim().length;
            ctx.assert(len >= 50, "Opis jest za krótki (" + len + " znaków)");
            if (len > 170) ctx.warn("Opis ma " + len + " znaków — Google zwykle ucina po ok. 160 znakach");
          }
        },
        {
          name: "Meta viewport (obsługa telefonów)",
          desc: "Bez meta viewport strona nie skaluje się poprawnie na urządzeniach mobilnych.",
          code: (ctx) => {
            const m = ctx.$('meta[name="viewport"]');
            ctx.assert(m, "Brak meta viewport — strona nie zadziała dobrze na telefonie");
            ctx.match(m.getAttribute("content") || "", /width\s*=\s*device-width/, "Zawartość meta viewport");
          }
        },
        {
          name: "CSS i czcionki strony są aktywne",
          desc: "Sprawdza, czy css/styles.css faktycznie wpływa na wygląd (sticky nav, rodzina czcionek).",
          code: (ctx) => {
            ctx.assert(ctx.$('link[rel="stylesheet"][href*="styles.css"]'), "Brak dołączenia css/styles.css");
            const nav = ctx.$("#nav");
            ctx.assert(nav, "Brak nagłówka nawigacji (#nav)");
            ctx.eq(getComputedStyle(nav).position, "sticky", "Nawigacja nie jest przyklejona (CSS nieaktywny?)");
            const font = getComputedStyle(document.body).fontFamily || "";
            ctx.assert(/Manrope|Segoe UI|system-ui/.test(font), "Nie zastosowano czcionki strony: " + font);
          }
        },
        {
          name: "Brak błędów JS i brakujących plików przy starcie",
          desc: "Nasłuch błędów działa od pierwszych milisekund ładowania strony.",
          code: (ctx) => {
            const errs = ctx.errors();
            ctx.eq(errs.length, 0, "Wykryte problemy: " + errs.join(" | "));
          }
        }
      ]
    },

    {
      icon: "🧭",
      name: "Nawigacja i struktura",
      tests: [
        {
          name: "Wszystkie linki menu prowadzą do istniejących sekcji",
          desc: "Każdy link #nazwa z górnego menu ma odpowiadający element id na stronie.",
          code: (ctx) => {
            const links = ctx.$$(".nav__links a[href^='#']");
            ctx.eq(links.length, 5, "Liczba linków w menu");
            const missing = links
              .map((a) => a.getAttribute("href").slice(1))
              .filter((id) => !document.getElementById(id));
            ctx.eq(missing.length, 0, "Linki bez sekcji docelowej: " + missing.join(", "));
          }
        },
        {
          name: "Stopka z rokiem i nazwą",
          desc: "Rok w stopce generowany jest przez JS i musi się zgadzać z bieżącym.",
          code: (ctx) => {
            ctx.eq(ctx.text("#year"), String(new Date().getFullYear()), "Rok w stopce");
            const footer = ctx.$(".footer");
            ctx.assert(footer, "Brak stopki");
            ctx.assert(footer.textContent.indexOf("Portowa Fala") !== -1, "Stopka nie zawiera nazwy restauracji");
          }
        },
        {
          name: "Sekcja hero z wezwaniami do działania",
          desc: "Hero powinno mieć nagłówek H1 i dwa CTA: zamówienie oraz rezerwację.",
          code: (ctx) => {
            const h1 = ctx.$(".hero h1");
            ctx.assert(h1 && h1.textContent.trim().length > 5, "Brak nagłówka H1 w sekcji hero");
            const ctas = ctx.$$(".hero__cta a");
            ctx.eq(ctas.length, 2, "Liczba przycisków CTA w hero");
            const hrefs = ctas.map((a) => a.getAttribute("href"));
            ctx.assert(hrefs.indexOf("#zamow") !== -1 && hrefs.indexOf("#rezerwacja") !== -1,
              "CTA nie prowadzą do zamówienia i rezerwacji");
          }
        }
      ]
    },

    {
      icon: "🍽️",
      name: "Menu i dania",
      tests: [
        {
          name: "Domyślna kategoria „Zupy” renderuje się z 5 daniami",
          desc: "Po wejściu na stronę menu pokazuje zupy, a pierwsza to „Zupa rybna po kaszubsku”.",
          code: (ctx) => {
            const dishes = ctx.$$("#menuGrid .dish");
            ctx.eq(dishes.length, 5, "Liczba dań w kategorii Zupy");
            ctx.assert(ctx.text("#menuGrid .dish:first-child .dish__name").indexOf("Zupa rybna") !== -1,
              "Pierwsze danie to nie zupa rybna");
          }
        },
        {
          name: "Przełączanie zakładek menu działa",
          desc: "Klik w „Obiad główny” (7 dań) i „Napoje” (7 pozycji) zmienia zawartość siatki.",
          code: async (ctx) => {
            const tabs = ctx.$$("#menuTabs .tab");
            ctx.eq(tabs.length, 5, "Liczba zakładek menu");

            tabs[1].click();
            await ctx.wait(() => ctx.$$("#menuGrid .dish").length === 7, 2000, "Zakładka Obiad główny");
            ctx.assert(tabs[1].classList.contains("is-active"), "Kliknięta zakładka nie jest aktywna");
            ctx.assert(!tabs[0].classList.contains("is-active"), "Poprzednia zakładka nadal aktywna");

            tabs[4].click();
            await ctx.wait(() => {
              const name = ctx.text("#menuGrid .dish__name") || "";
              return name.indexOf("Kompot") !== -1;
            }, 2000, "Zakładka Napoje");
            ctx.eq(ctx.$$("#menuGrid .dish").length, 7, "Liczba pozycji w Napojach");
            ctx.assert(!tabs[1].classList.contains("is-active"), "Stara zakładka pozostała aktywna");
          }
        },
        {
          name: "Karta dania ma nazwę, cenę, opis i przycisk",
          desc: "Każda z 7 kart obiadowych przechodzi kontrolę kompletności.",
          code: async (ctx) => {
            ctx.$$("#menuTabs .tab")[1].click();
            await ctx.wait(() => ctx.$$("#menuGrid .dish").length === 7, 2000, "Obiady");
            for (const d of ctx.$$("#menuGrid .dish")) {
              const name = d.querySelector(".dish__name");
              const price = d.querySelector(".dish__price");
              const desc = d.querySelector(".dish__desc");
              const add = d.querySelector("[data-add]");
              ctx.assert(name && name.textContent.trim().length > 2, "Danie bez nazwy");
              ctx.assert(price && /^\d+,\d{2} zł$/.test(price.textContent.trim()),
                "Niepoprawny format ceny: " + (price && price.textContent));
              ctx.assert(desc && desc.textContent.trim().length >= 10, "Brak opisu w: " + name.textContent);
              ctx.assert(add && add.textContent.indexOf("Dodaj") !== -1, "Brak przycisku Dodaj w: " + name.textContent);
            }
          }
        },
        {
          name: "Ilustracje dań ładują się poprawnie",
          desc: "Obrazki SVG generowane przez js/dish-images.js są osadzone jako data URI.",
          code: async (ctx) => {
            await ctx.wait(() => {
              const imgs = ctx.$$("#menuGrid .dish__photo");
              return imgs.length > 0 && imgs.every((i) => i.complete && i.naturalWidth > 0);
            }, 4000, "Wczytanie obrazków dań");
            const bad = ctx.$$("#menuGrid .dish__photo").filter(
              (i) => !(i.naturalWidth > 0) || !/^data:image\/svg\+xml/.test(i.src)
            );
            ctx.eq(bad.length, 0, "Niepoprawne obrazki: " + bad.length);
          }
        },
        {
          name: "Licznik stolików spójny z planem sali",
          desc: "Sekcja „O nas” pokazuje 13 stolików — tyle samo, ile generuje plan sali.",
          code: (ctx) => {
            ctx.eq(ctx.text("#statTables"), "13", "Liczba stolików w sekcji O nas");
          }
        }
      ]
    },

    {
      icon: "🛒",
      name: "Koszyk",
      tests: [
        {
          name: "Dodanie dania aktualizuje licznik i pokazuje powiadomienie",
          desc: "Klik „+ Dodaj” zwiększa badge i wyświetla toast z nazwą dania.",
          code: async (ctx) => {
            const first = ctx.$("#menuGrid .dish");
            const name = first.querySelector(".dish__name").textContent.trim();
            first.querySelector("[data-add]").click();
            await ctx.wait(() => ctx.text("#cartCount") === "1", 1500, "Licznik koszyka");
            const toast = ctx.$("#toast");
            ctx.assert(toast.classList.contains("is-visible"), "Brak powiadomienia po dodaniu");
            ctx.assert(ctx.text("#toast").indexOf(name) !== -1, "Powiadomienie bez nazwy dania");
          }
        },
        {
          name: "Panel koszyka pokazuje pozycję i poprawną sumę",
          desc: "Po otwarciu koszyka widać 1 pozycję, a suma zgadza się z ceną dania.",
          code: async (ctx) => {
            const first = ctx.$("#menuGrid .dish");
            first.querySelector("[data-add]").click();
            ctx.eq(ctx.text("#cartCount"), "1", "Licznik po dodaniu");

            ctx.click("#cartBtn");
            await ctx.wait(() => ctx.$("#cartDrawer").classList.contains("is-open"), 1500, "Otwarcie koszyka");
            ctx.eq(ctx.$$("#cartItems .cart-item").length, 1, "Liczba pozycji w koszyku");

            const price = parseFloat(first.querySelector(".dish__price").textContent.replace(",", "."));
            const expected = price.toFixed(2).replace(".", ",") + " zł";
            ctx.eq(ctx.text("#cartTotal"), expected, "Suma koszyka");
          }
        },
        {
          name: "Zwiększanie ilości przelicza sumę",
          desc: "Przycisk „+” zmienia ilość na 2 i podwaja wartość.",
          code: async (ctx) => {
            ctx.$("#menuGrid .dish [data-add]").click();
            ctx.click("#cartBtn");
            const inc = ctx.$$("#cartItems [data-inc]")[0];
            ctx.assert(inc, "Brak przycisku zwiększania ilości");
            inc.click();
            await ctx.wait(() => ctx.$$("#cartItems .cart-item__qty span")[0].textContent.trim() === "2",
              1500, "Ilość 2 w koszyku");
            ctx.eq(ctx.text("#cartCount"), "2", "Licznik po zwiększeniu");
            const price = parseFloat(ctx.$$("#menuGrid .dish__price")[0].textContent.replace(",", "."));
            ctx.eq(ctx.text("#cartTotal"), (price * 2).toFixed(2).replace(".", ",") + " zł", "Suma po zwiększeniu");
          }
        },
        {
          name: "Usuwanie pozycji opróżnia koszyk",
          desc: "Po usunięciu ostatniej pozycji widać komunikat o pustym koszyku, a suma to 0,00 zł.",
          code: async (ctx) => {
            ctx.$("#menuGrid .dish [data-add]").click();
            ctx.click("#cartBtn");
            const rem = ctx.$$("#cartItems [data-remove]")[0];
            ctx.assert(rem, "Brak przycisku usuwania");
            rem.click();
            await ctx.wait(() => ctx.$$("#cartItems .cart-item").length === 0, 1500, "Pusty koszyk");
            ctx.eq(ctx.text("#cartCount"), "0", "Licznik po usunięciu");
            ctx.eq(ctx.text("#cartTotal"), "0,00 zł", "Suma po usunięciu");
            ctx.assert((ctx.text("#cartItems") || "").indexOf("Koszyk jest pusty") !== -1,
              "Brak komunikatu o pustym koszyku");
          }
        },
        {
          name: "Podsumowanie zamówienia zgodne z koszykiem",
          desc: "Suma pozycji = suma w podsumowaniu; zaliczka to 10%, a przedpłata to całość.",
          code: async (ctx) => {
            const add = ctx.$$("#menuGrid [data-add]");
            add[0].click();
            add[1].click();
            ctx.click("#cartBtn");
            await ctx.wait(() => ctx.$$("#summaryList li").length === 2, 1500, "Podsumowanie zamówienia");

            let total = 0;
            ctx.$$("#summaryList li").forEach((li) => {
              const val = li.querySelector("span:last-child");
              total += parseFloat(val.textContent.replace(",", "."));
            });
            const shown = parseFloat((ctx.text("#summaryTotal") || "").replace(" zł", "").replace(",", "."));
            ctx.assert(Math.abs(total - shown) < 0.005,
              "Suma podsumowania (" + ctx.text("#summaryTotal") + ") nie zgadza się z pozycjami (" + total.toFixed(2) + " zł)");
            ctx.eq(ctx.text("#depositAmount"), (total * 0.1).toFixed(2).replace(".", ",") + " zł", "Zaliczka 10%");
            ctx.eq(ctx.text("#prepayAmount"), total.toFixed(2).replace(".", ",") + " zł", "Płatność z góry");
          }
        },
        {
          name: "„Wstaw koszyk do zamówienia” działa",
          desc: "Klik przenosi pozycje koszyka do pola „Co chcesz zjeść?”.",
          code: async (ctx) => {
            ctx.$("#menuGrid .dish [data-add]").click();
            ctx.click("#addCartToForm");
            await ctx.wait(() => (ctx.$("#orderFood").value || "").length > 0, 1500, "Wstawienie koszyka");
            ctx.assert((ctx.$("#orderFood").value || "").indexOf("1×") !== -1,
              "Pole zamówienia bez pozycji koszyka: " + ctx.$("#orderFood").value);
          }
        },
        {
          name: "„Przejdź do zamówienia” zamyka koszyk i przenosi pozycje",
          desc: "Przycisk w panelu koszyka zamyka go i uzupełnia formularz zamówienia.",
          code: async (ctx) => {
            ctx.$("#menuGrid .dish [data-add]").click();
            ctx.click("#cartBtn");
            await ctx.wait(() => ctx.$("#cartDrawer").classList.contains("is-open"), 1500, "Otwarty koszyk");
            ctx.click("#cartToOrder");
            await ctx.wait(() => !ctx.$("#cartDrawer").classList.contains("is-open"), 2000, "Zamknięcie koszyka");
            ctx.assert((ctx.$("#orderFood").value || "").indexOf("Zupa rybna") !== -1,
              "Formularz nie dostał pozycji koszyka");
          }
        }
      ]
    },

    {
      icon: "📝",
      name: "Formularz zamówienia",
      tests: [
        {
          name: "Walidacja: pusty formularz pokazuje błędy",
          desc: "Wysłanie pustego formularza blokuje zamówienie i pokazuje komunikat.",
          code: async (ctx) => {
            ctx.submit("#orderForm");
            await ctx.wait(() => ctx.$("#orderPhone").closest(".field").classList.contains("has-error"),
              1500, "Oznaczenie błędu telefonu");
            const err = ctx.$("#orderPhone").closest(".field").querySelector(".err");
            ctx.assert(err && err.textContent.trim().length > 3, "Brak treści komunikatu o błędzie telefonu");
            ctx.assert((ctx.text("#toast") || "").indexOf("Uzupełnij") !== -1,
              "Brak powiadomienia o brakujących danych");
          }
        },
        {
          name: "Walidacja: numer telefonu z 8 cyframi jest odrzucany",
          desc: "Wymagane jest minimum 9 cyfr.",
          code: async (ctx) => {
            ctx.set("#orderPhone", "12345678");
            ctx.set("#orderAddress", "ul. Morska 1, 84-120 Władysławowo");
            ctx.set("#orderFood", "1× dorsz po kaszubsku");
            ctx.submit("#orderForm");
            await ctx.wait(() => ctx.$("#orderPhone").closest(".field").classList.contains("has-error"),
              1500, "Błąd telefonu");
          }
        },
        {
          name: "Adres wymagany przy dowozie, zbędny przy odbiorze",
          desc: "Przy dowozie pusty adres to błąd; po wybraniu odbioru osobistego pole znika i zamówienie przechodzi.",
          code: async (ctx) => {
            ctx.set("#orderPhone", "601234567");
            ctx.set("#orderFood", "1× dorsz po kaszubsku");
            ctx.submit("#orderForm");
            await ctx.wait(() => ctx.$("#orderAddress").closest(".field").classList.contains("has-error"),
              1500, "Błąd pustego adresu");

            ctx.check("fulfilment", "odbiór");
            await ctx.wait(() => ctx.$("#orderAddress").closest(".field").style.display === "none",
              1500, "Ukrycie adresu przy odbiorze");
            ctx.eq(ctx.$("#orderAddress").required, false, "Adres nadal wymagany przy odbiorze");

            ctx.submit("#orderForm");
            await ctx.wait(() => (ctx.text("#toast") || "").indexOf("Zamówienie przyjęte") !== -1,
              2000, "Zamówienie na odbiór");
          }
        },
        {
          name: "Odbiór osobisty ukrywa sekcję płatności",
          desc: "Sekcja płatności dotyczy tylko dowozu — przy odbiorze ma być schowana.",
          code: async (ctx) => {
            ctx.check("fulfilment", "odbiór");
            await ctx.wait(() => ctx.$("#payField").style.display === "none", 1500, "Ukrycie płatności");
            ctx.check("fulfilment", "dowóz");
            await ctx.wait(() => ctx.$("#payField").style.display !== "none", 1500, "Powrót płatności");
          }
        },
        {
          name: "Poprawne zamówienie kończy się potwierdzeniem i czyszczeniem",
          desc: "Po wysłaniu danych widać toast sukcesu, formularz i koszyk są puste.",
          code: async (ctx) => {
            ctx.$("#menuGrid .dish [data-add]").click();
            ctx.click("#addCartToForm");
            ctx.set("#orderPhone", "601 234 567");
            ctx.set("#orderAddress", "ul. Portowa 4, 84-120 Władysławowo");
            ctx.submit("#orderForm");
            await ctx.wait(() => (ctx.text("#toast") || "").indexOf("Zamówienie przyjęte") !== -1,
              2000, "Potwierdzenie zamówienia");
            ctx.eq(ctx.$("#orderPhone").value, "", "Telefon nie został wyczyszczony");
            ctx.eq(ctx.$("#orderFood").value, "", "Pole jedzenia nie zostało wyczyszczone");
            ctx.eq(ctx.text("#cartCount"), "0", "Koszyk nie został wyczyszczony");
          }
        }
      ]
    },

    {
      icon: "🪑",
      name: "Rezerwacja stolika",
      tests: [
        {
          name: "Plan sali ma 13 stolików w 3 strefach",
          desc: "4 stoliki na tarasie, 5 przy oknie, 4 w sali głównej.",
          code: (ctx) => {
            ctx.eq(ctx.$$("#floor .table").length, 13, "Liczba stolików na planie");
            ctx.eq(ctx.$$("#floor .table--zone-taras").length, 4, "Stoliki na tarasie");
            ctx.eq(ctx.$$("#floor .table--zone-window").length, 5, "Stoliki przy oknie");
            ctx.eq(ctx.$$("#floor .table--zone-sala").length, 4, "Stoliki w sali głównej");
          }
        },
        {
          name: "Godziny rezerwacji od 12:00 do 21:30",
          desc: "20 slotów co 30 minut, domyślnie zaznaczone 18:00.",
          code: (ctx) => {
            const opts = ctx.$$("#resTime option");
            ctx.eq(opts.length, 20, "Liczba dostępnych godzin");
            ctx.eq(opts[0].value, "12:00", "Pierwsza godzina");
            ctx.eq(opts[opts.length - 1].value, "21:30", "Ostatnia godzina");
            ctx.eq(ctx.$("#resTime").value, "18:00", "Domyślna godzina");
          }
        },
        {
          name: "Data: minimalna i domyślna to dziś",
          desc: "Nie można wybrać dnia z przeszłości.",
          code: (ctx) => {
            const d = ctx.$("#resDate");
            ctx.eq(d.value, d.min, "Wartość domyślna daty różni się od minimalnej");
            ctx.match(d.min, /^\d{4}-\d{2}-\d{2}$/, "Format daty minimalnej");
            const today = ctx.today();
            if (d.min !== today) {
              ctx.warn("Data minimalna (" + d.min + ") różni się od dzisiejszej (" + today + ") — możliwe przesunięcie strefy czasowej");
            }
          }
        },
        {
          name: "Wybór liczby osób blokuje za małe stoliki",
          desc: "Przy 8 osobach stoliki 2- i 4-osobowe są nieaktywne.",
          code: async (ctx) => {
            ctx.set("#resGuests", "8");
            await ctx.wait(() => ctx.$("#floor .table--small"), 1500, "Oznaczenie małych stolików");
            const small = ctx.$$("#floor .table--small");
            ctx.assert(small.length >= 1, "Nie oznaczono żadnego stolika jako za mały");
            ctx.assert(small.every((b) => b.disabled), "Za małe stoliki pozostają klikalne");
            if (ctx.$$("#floor .table--free").length === 0) {
              ctx.warn("Przy 8 osobach żaden stolik nie pasuje — największe mają 6 miejsc");
            }
          }
        },
        {
          name: "Kliknięcie wolnego stolika wybiera go i podsumowuje",
          desc: "Wybór podświetla stolik i pojawia się w panelu oraz formularzu; zmiana godziny czyści wybór.",
          code: async (ctx) => {
            const free = ctx.$$("#floor .table--free").find((b) => !b.disabled);
            ctx.assert(free, "Brak wolnych stolików na wybrany termin");
            const id = free.dataset.table;
            free.click();
            await ctx.wait(() => ctx.$('#floor .table--selected[data-table="' + id + '"]'), 1500, "Podświetlenie stolika");
            ctx.match(ctx.text("#resPicked") || "", /Stolik\s+\d+/, "Panel wybranego stolika");
            const sum = ctx.text("#resFormSummary") || "";
            ctx.assert(sum.length > 10, "Brak podsumowania wyboru w formularzu");

            ctx.set("#resTime", "13:30");
            await ctx.wait(() => !ctx.$("#floor .table--selected"), 1500, "Wyczyszczenie wyboru po zmianie godziny");
          }
        },
        {
          name: "Pogoda steruje dostępnością tarasu",
          desc: "Box pogodowy ma jednoznaczny stan, a stoliki tarasowe są zablokowane dokładnie wtedy, gdy taras jest zamknięty.",
          code: async (ctx) => {
            await ctx.wait(() => ctx.text("#weatherTemp") !== "Sprawdzam pogodę…", 8000, "Odpowiedź pogodowa");
            const box = ctx.$("#weatherBox");
            const open = box.classList.contains("weather--open");
            const closed = box.classList.contains("weather--closed");
            ctx.assert(open !== closed, "Box pogodowy nie ma jednoznacznego stanu");
            const terraceBlocked = ctx.$$("#floor .table--zone-taras.table--weather").length;
            if (closed) ctx.eq(terraceBlocked, 4, "Zamknięty taras powinien blokować wszystkie 4 stoliki");
            else ctx.eq(terraceBlocked, 0, "Otwarty taras nie powinien blokować stolików");
            ctx.assert((ctx.text("#weatherSeats") || "").length > 5, "Brak informacji o dostępności tarasu");
          }
        },
        {
          name: "Rezerwacja kończy się potwierdzeniem i blokuje stolik",
          desc: "Walidacja danych, toast sukcesu i stolik staje się zajęty na ten termin.",
          code: async (ctx) => {
            const free = ctx.$$("#floor .table--free").find((b) => !b.disabled);
            ctx.assert(free, "Brak wolnego stolika do rezerwacji");
            const id = free.dataset.table;
            free.click();
            await ctx.wait(() => ctx.$('#floor .table--selected[data-table="' + id + '"]'), 1500, "Wybór stolika");

            ctx.submit("#resForm");
            await ctx.wait(() => (ctx.text("#toast") || "").indexOf("Uzupełnij") !== -1,
              1500, "Walidacja danych rezerwacji");

            ctx.set("#resName", "Jan Testowy");
            ctx.set("#resPhone", "601 234 567");
            ctx.submit("#resForm");
            await ctx.wait(() => (ctx.text("#toast") || "").indexOf("zarezerwowany") !== -1,
              2000, "Potwierdzenie rezerwacji");
            await ctx.wait(() => ctx.$('#floor .table--taken[data-table="' + id + '"]'),
              1500, "Stolik nie został oznaczony jako zajęty");
            ctx.eq(ctx.$("#resName").value, "", "Formularz rezerwacji nie został wyczyszczony");
          }
        }
      ]
    },

    {
      icon: "📱",
      name: "Responsywność i dostępność",
      tests: [
        {
          name: "Telefon: hamburger zwija i rozwija menu",
          desc: "Przy 375 px linki są ukryte, hamburger działa i aktualizuje aria-expanded.",
          viewport: V_MOB,
          code: async (ctx) => {
            const burger = ctx.$("#hamburger");
            const links = ctx.$("#navLinks");
            ctx.assert(getComputedStyle(burger).display !== "none", "Hamburger ukryty na telefonie");
            ctx.assert(!links.classList.contains("is-open"), "Menu startowo otwarte");

            const h0 = links.getBoundingClientRect().height;
            ctx.assert(h0 < 5, "Menu powinno być zwinięte, wysokość: " + Math.round(h0) + " px");

            burger.click();
            await ctx.wait(() => links.classList.contains("is-open"), 1000, "Rozwinięcie menu");
            ctx.eq(burger.getAttribute("aria-expanded"), "true", "aria-expanded po otwarciu");
            await ctx.wait(() => links.getBoundingClientRect().height > 60, 1000, "Widoczne linki menu");

            burger.click();
            await ctx.wait(() => !links.classList.contains("is-open"), 1000, "Zwinięcie menu");
            ctx.eq(burger.getAttribute("aria-expanded"), "false", "aria-expanded po zwinięciu");
          }
        },
        {
          name: "Desktop: siatka wielokolumnowa i brak hamburgera",
          desc: "Przy 1366 px menu dań ma co najmniej 2 kolumny, a hamburger jest ukryty.",
          viewport: V_DESK,
          code: (ctx) => {
            const cols = getComputedStyle(ctx.$(".menu-grid")).gridTemplateColumns.split(" ").length;
            ctx.assert(cols >= 2, "Menu nie jest wielokolumnowe (kolumny: " + cols + ")");
            ctx.eq(getComputedStyle(ctx.$("#hamburger")).display, "none", "Hamburger widoczny na desktopie");
          }
        },
        {
          name: "Telefon: strona nie wystaje poza ekran",
          desc: "Brak poziomego paska przewijania przy 375 px.",
          viewport: V_MOB,
          code: (ctx) => {
            const doc = document.documentElement;
            const diff = doc.scrollWidth - doc.clientWidth;
            ctx.assert(diff <= 1, "Strona wystaje poza ekran o " + diff + " px — pojawia się poziome przewijanie");
          }
        },
        {
          name: "Dostępność: obrazy mają opisy alt",
          desc: "Każdy obraz ma atrybut alt, a zdjęcia dań — opisową nazwę.",
          code: (ctx) => {
            const imgs = ctx.$$("img");
            ctx.assert(imgs.length > 0, "Brak obrazów na stronie");
            const missingAttr = imgs.filter((i) => !i.hasAttribute("alt"));
            ctx.eq(missingAttr.length, 0, "Obrazy bez atrybutu alt: " + missingAttr.length);
            const dishes = ctx.$$(".dish__photo");
            const noDesc = dishes.filter((i) => !i.alt || !i.alt.trim());
            ctx.eq(noDesc.length, 0, "Zdjęcia dań bez opisowego alt: " + noDesc.length);
          }
        },
        {
          name: "Dostępność: pola formularzy mają etykiety",
          desc: "Każde pole w formularzach zamówienia i rezerwacji jest powiązane z <label>.",
          code: (ctx) => {
            const fields = ctx.$$(
              "#orderForm input:not([type=radio]), #orderForm textarea, #orderForm select, " +
              "#resForm input, #resDate, #resTime, #resGuests"
            );
            const missing = fields.filter((el) => {
              if (el.getAttribute("aria-label")) return false;
              if (el.id && document.querySelector('label[for="' + el.id + '"]')) return false;
              if (el.closest("label")) return false;
              return true;
            });
            ctx.eq(missing.length, 0, "Pola bez etykiety: " + missing.map((e) => e.id || e.name || e.tagName).join(", "));
          }
        },
        {
          name: "Dostępność: przyciski mają type i nazwę",
          desc: "Wszystkie przyciski mają atrybut type oraz widoczny tekst lub aria-label.",
          code: (ctx) => {
            const buttons = ctx.$$("button");
            const noType = buttons.filter((b) => !b.hasAttribute("type"));
            ctx.eq(noType.length, 0, "Przyciski bez atrybutu type: " + noType.length);
            const noLabel = buttons.filter((b) => !(b.textContent.trim() || b.getAttribute("aria-label") || b.title));
            ctx.eq(noLabel.length, 0, "Przyciski bez nazwy: " + noLabel.length);
          }
        },
        {
          name: "Nagłówki: jeden H1 i sekcje jako H2",
          desc: "Poprawna hierarchia nagłówków (SEO i czytniki ekranu).",
          code: (ctx) => {
            ctx.eq(ctx.$$("h1").length, 1, "Strona powinna mieć dokładnie jeden nagłówek H1");
            ctx.assert(ctx.$$("h2").length >= 5, "Za mało nagłówków H2 (sekcje): " + ctx.$$("h2").length);
          }
        },
        {
          name: "SEO dodatkowe (Open Graph, favicon, dane strukturalne)",
          desc: "Test miękki — brakujące elementy to ostrzeżenia, nie błędy.",
          code: (ctx) => {
            if (!ctx.$('meta[property="og:title"]')) ctx.warn("Brak Open Graph — linki mogą brzydko wyglądać w social media");
            if (!ctx.$('link[rel="canonical"]')) ctx.warn("Brak adresu canonical");
            if (!ctx.$('link[rel="icon"]')) ctx.warn("Brak favikony (favicon)");
            if (!ctx.$('script[type="application/ld+json"]')) ctx.warn("Brak danych strukturalnych schema.org (Restaurant) — pomagają w Google");
            if (!ctx.$('meta[name="theme-color"]')) ctx.warn("Brak meta theme-color");
          }
        },
        {
          name: "Smoke test: interakcje bez błędów JS",
          desc: "Klika zakładki, koszyk, stolik i wysyła błędny formularz — dozwolony jest tylko oczekiwany błąd walidacji.",
          code: async (ctx) => {
            const tabs = ctx.$$("#menuTabs .tab");
            tabs[1].click();
            tabs[4].click();
            tabs[0].click();
            ctx.$$("#menuGrid [data-add]")[0].click();
            ctx.click("#cartBtn");
            ctx.click("#closeCart");
            const free = ctx.$$("#floor .table--free").find((b) => !b.disabled);
            if (free) free.click();
            ctx.set("#resGuests", "4");
            ctx.set("#orderPhone", "abc");
            ctx.submit("#orderForm");
            await ctx.sleep(300);
            const errs = ctx.errors();
            ctx.eq(errs.length, 0, "Błędy JS podczas interakcji: " + errs.slice(0, 3).join(" | "));
          }
        }
      ]
    }
  ];

  /* ------------------------------------------------------------------
     SPŁASZCZENIE TESTÓW
     ------------------------------------------------------------------ */
  const flat = [];
  SUITES.forEach((suite, si) => {
    suite.tests.forEach((test, ti) => {
      test.suite = suite;
      test.uid = "s" + si + "t" + ti;
      test.status = "pending";
      test.ms = null;
      test.error = "";
      test.stack = "";
      test.warns = [];
      test.viewport = test.viewport || V_DESK;
      flat.push(test);
    });
  });

  const byUid = {};
  flat.forEach((t) => { byUid[t.uid] = t; });

  /* ------------------------------------------------------------------
     ELEMENTY INTERFEJSU
     ------------------------------------------------------------------ */
  const $ = (s) => document.querySelector(s);
  const results = $("#results");
  const frame = $("#frame");
  const stage = $("#stage");
  const vpLabel = $("#vpLabel");
  const runAllBtn = $("#runAll");
  const retryBtn = $("#retryFailed");
  const stopBtn = $("#stopRun");
  const downloadBtn = $("#downloadReport");
  const copyBtn = $("#copySummary");
  const donutArc = $("#donutArc");
  const donutLabel = $("#donutLabel");
  const progressBar = $("#progressBar");
  const verdict = $("#verdict");
  const statusText = $("#statusText");
  const envInfo = $("#envInfo");

  const STATUS = {
    pending: { icon: "○", cls: "status--pending" },
    running: { icon: '<span class="spin"></span>', cls: "status--running" },
    pass: { icon: "✅", cls: "status--pass" },
    warn: { icon: "⚠️", cls: "status--warn" },
    fail: { icon: "❌", cls: "status--fail" },
    skip: { icon: "⏭️", cls: "status--pending" }
  };

  let activeFilter = "all";
  let running = false;
  let stopFlag = false;

  /* ------------------------------------------------------------------
     RYSOWANIE LISTY TESTÓW
     ------------------------------------------------------------------ */
  const testEls = {};

  function escapeHtml(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderSuites() {
    results.innerHTML = SUITES.map((suite, si) => {
      const tests = suite.tests.map((test) => (
        '<div class="test" data-test="' + test.uid + '">' +
          '<div class="test__row" data-toggle="' + test.uid + '">' +
            '<span class="test__status status--pending" data-status="' + test.uid + '">○</span>' +
            '<span class="test__name">' + escapeHtml(test.name) + '</span>' +
            '<span class="test__ms" data-ms="' + test.uid + '"></span>' +
            '<button class="test__run" type="button" data-run-test="' + test.uid + '" title="Uruchom ten test">▶</button>' +
          '</div>' +
          '<div class="test__details">' +
            '<div class="test__desc">' + escapeHtml(test.desc || "") + '</div>' +
            '<div data-detail="' + test.uid + '"></div>' +
          '</div>' +
        '</div>'
      )).join("");

      return '<section class="suite" data-suite="' + si + '">' +
        '<div class="suite__head">' +
          '<span class="suite__icon">' + suite.icon + '</span>' +
          '<span class="suite__name">' + escapeHtml(suite.name) + '</span>' +
          '<span class="suite__counts" data-counts="' + si + '">0 / ' + suite.tests.length + '</span>' +
          '<button class="suite__run" type="button" data-run-suite="' + si + '" title="Uruchom tę grupę">▶</button>' +
        '</div>' +
        '<div class="suite__body">' + tests + '</div>' +
      '</section>';
    }).join("");

    SUITES.forEach((suite) => {
      suite.tests.forEach((t) => {
        testEls[t.uid] = results.querySelector('.test[data-test="' + t.uid + '"]');
      });
    });
  }

  function updateTestDOM(t) {
    const el = testEls[t.uid];
    if (!el) return;
    const st = el.querySelector("[data-status]");
    const s = STATUS[t.status] || STATUS.pending;
    st.className = "test__status " + s.cls;
    st.innerHTML = s.icon;

    el.querySelector("[data-ms]").textContent =
      t.ms != null && t.status !== "running" ? t.ms + " ms" : "";

    const det = el.querySelector("[data-detail]");
    let html = "";
    if (t.status === "fail") {
      html += '<div class="test__box test__box--fail">❌ ' + escapeHtml(t.error || "Nieznany błąd") + '</div>';
      if (t.stack) html += '<div class="test__stack">' + escapeHtml(t.stack) + '</div>';
    }
    if (t.warns.length) {
      html += '<div class="test__box test__box--warn">⚠️ ' + t.warns.map(escapeHtml).join("<br>⚠️ ") + '</div>';
    }
    if (t.status === "pass" && !t.warns.length) {
      html += '<div class="test__box test__box--ok">✔ Wszystkie sprawdzenia przeszły pomyślnie.</div>';
    }
    det.innerHTML = html;
    applyFilter();
  }

  function applyFilter() {
    SUITES.forEach((suite, si) => {
      let visibleInSuite = 0;
      suite.tests.forEach((t) => {
        const el = testEls[t.uid];
        const match = activeFilter === "all" || t.status === activeFilter ||
          (activeFilter === "pending" && (t.status === "pending" || t.status === "running"));
        el.classList.toggle("filtered-out", !match);
        if (match) visibleInSuite++;
      });
      const suiteEl = results.querySelector('.suite[data-suite="' + si + '"]');
      if (suiteEl) suiteEl.classList.toggle("filtered-out", visibleInSuite === 0);
    });
  }

  /* ------------------------------------------------------------------
     PODSUMOWANIE
     ------------------------------------------------------------------ */
  function summarize() {
    const c = { pass: 0, fail: 0, warn: 0, pending: 0, running: 0, skip: 0 };
    flat.forEach((t) => { c[t.status] = (c[t.status] || 0) + 1; });
    const executed = c.pass + c.fail + c.warn;
    return {
      counts: c,
      total: flat.length,
      done: c.pass + c.fail + c.warn + c.skip,
      executed: executed,
      score: executed ? Math.round((c.pass / executed) * 100) : null
    };
  }

  function updateSummary() {
    const s = summarize();
    const c = s.counts;
    $("#cntAll").textContent = s.total;
    $("#cntPass").textContent = c.pass;
    $("#cntFail").textContent = c.fail;
    $("#cntWarn").textContent = c.warn;
    $("#cntPending").textContent = c.pending + c.running;

    const C = 2 * Math.PI * 40;
    donutArc.setAttribute("stroke-dasharray", C.toFixed(1));
    const frac = s.score == null ? 0 : s.score / 100;
    donutArc.setAttribute("stroke-dashoffset", (C * (1 - frac)).toFixed(1));
    donutArc.setAttribute("stroke", s.score == null ? "#c9d4dc" : s.score >= 80 ? "#2f9e63" : s.score >= 50 ? "#d9a441" : "#d5544f");
    donutLabel.textContent = s.score == null ? "—" : s.score + "%";

    progressBar.style.width = s.total ? Math.round((s.done / s.total) * 100) + "%" : "0%";
    verdict.textContent = s.score == null
      ? "Gotowe do startu"
      : s.score >= 90 ? "Świetny wynik 🎉"
      : s.score >= 75 ? "Dobry wynik"
      : s.score >= 50 ? "Wymaga poprawek"
      : "Dużo do poprawy";

    SUITES.forEach((suite, si) => {
      const el = results.querySelector('[data-counts="' + si + '"]');
      if (!el) return;
      const done = suite.tests.filter((t) => t.status === "pass" || t.status === "warn" || t.status === "fail" || t.status === "skip").length;
      el.textContent = done + " / " + suite.tests.length;
    });

    const totalMs = flat.reduce((sum, t) => sum + (t.ms || 0), 0);
    if (s.done) statusText.textContent = "Czas testów: " + (totalMs / 1000).toFixed(1) + " s";
  }

  /* ------------------------------------------------------------------
     KOMUNIKACJA Z RAMKĄ
     ------------------------------------------------------------------ */
  let frameGen = 0;
  let readyWaiter = null;
  let codeSeq = 0;
  const pendingResults = new Map();

  window.addEventListener("message", (ev) => {
    if (ev.source !== frame.contentWindow) return;
    const d = ev.data || {};
    if (d.pf !== 1) return;
    if (d.cmd === "ready" && readyWaiter) {
      readyWaiter(String(d.r));
      return;
    }
    if (d.cmd === "result") {
      const w = pendingResults.get(d.id);
      if (w) {
        pendingResults.delete(d.id);
        w(d);
      }
    }
  });

  function fitStage() {
    const w = parseFloat(frame.style.width) || V_DESK[0];
    const h = parseFloat(frame.style.height) || V_DESK[1];
    const avail = stage.clientWidth || w;
    const scale = Math.min(1, avail / w);
    frame.style.transform = "scale(" + scale + ")";
    stage.style.height = Math.round(h * scale) + "px";
  }

  function loadFrame(viewport) {
    const vp = viewport || V_DESK;
    frame.style.width = vp[0] + "px";
    frame.style.height = vp[1] + "px";
    vpLabel.textContent = vp[0] + " × " + vp[1] + " px";
    fitStage();

    return new Promise((resolve, reject) => {
      const token = ++frameGen;
      readyWaiter = null;
      const timer = setTimeout(() => {
        readyWaiter = null;
        reject(new Error("Agent testowy nie odpowiedział. Sprawdź, czy plik js/test-agent.js istnieje, " +
          "a w index.html jest dołączony <script src=\"js/test-agent.js\"></script>."));
      }, 6000);

      readyWaiter = (got) => {
        if (String(got) !== String(token)) return;
        clearTimeout(timer);
        readyWaiter = null;
        resolve();
      };

      frame.src = "index.html?test=1&r=" + token;
    });
  }

  function runCode(code) {
    return new Promise((resolve, reject) => {
      const id = "c" + (++codeSeq);
      const timer = setTimeout(() => {
        pendingResults.delete(id);
        reject(new Error("Test przekroczył limit 15 s i został przerwany."));
      }, 15000);
      pendingResults.set(id, (d) => {
        clearTimeout(timer);
        resolve(d);
      });
      frame.contentWindow.postMessage({ pf: 1, cmd: "run", id: id, code: code }, "*");
    });
  }

  async function runOne(t) {
    t.status = "running";
    t.error = "";
    t.stack = "";
    t.warns = [];
    t.ms = 0;
    updateTestDOM(t);
    updateSummary();

    const started = performance.now();
    try {
      await loadFrame(t.viewport);
      const res = await runCode(t.code.toString());
      if (res.ok) {
        t.warns = res.warns || [];
        t.status = t.warns.length ? "warn" : "pass";
      } else {
        t.status = "fail";
        t.error = res.error || "Nieznany błąd";
        t.stack = res.stack || "";
        t.warns = res.warns || [];
      }
    } catch (e) {
      t.status = "fail";
      t.error = e.message || String(e);
    }
    t.ms = Math.round(performance.now() - started);
    updateTestDOM(t);
    updateSummary();
  }

  async function runList(list) {
    if (running || !list.length) return;
    running = true;
    stopFlag = false;
    runAllBtn.disabled = true;
    retryBtn.disabled = true;
    downloadBtn.disabled = false;
    stopBtn.hidden = false;

    list.forEach((t) => {
      t.status = "pending";
      t.error = "";
      t.stack = "";
      t.warns = [];
      t.ms = null;
      updateTestDOM(t);
    });
    updateSummary();

    for (const t of list) {
      if (stopFlag) {
        t.status = "skip";
        updateTestDOM(t);
        continue;
      }
      await runOne(t);
    }

    running = false;
    stopBtn.hidden = true;
    runAllBtn.disabled = false;
    retryBtn.disabled = !flat.some((t) => t.status === "fail");
    updateSummary();
  }

  /* ------------------------------------------------------------------
     RAPORTY
     ------------------------------------------------------------------ */
  function buildReport() {
    const s = summarize();
    return {
      aplikacja: "Tester strony — Portowa Fala",
      wygenerowano: new Date().toISOString(),
      adresStrony: "index.html",
      przegladarka: navigator.userAgent,
      wynik: {
        procent: s.score,
        wykonane: s.executed,
        wszystkich: s.total,
        pass: s.counts.pass,
        fail: s.counts.fail,
        warn: s.counts.warn
      },
      grupy: SUITES.map((suite) => ({
        nazwa: suite.name,
        testy: suite.tests.map((t) => ({
          nazwa: t.name,
          status: t.status,
          czas_ms: t.ms,
          blad: t.error || null,
          ostrzezenia: t.warns
        }))
      }))
    };
  }

  function reportText() {
    const s = summarize();
    const lines = [];
    lines.push("Tester strony — Portowa Fala");
    lines.push(new Date().toLocaleString("pl-PL"));
    lines.push("Wynik: " + (s.score == null ? "—" : s.score + "%") +
      " · ✅ " + s.counts.pass + " · ❌ " + s.counts.fail + " · ⚠️ " + s.counts.warn);
    flat.filter((t) => t.status === "fail").forEach((t) => lines.push("❌ " + t.name + " — " + t.error));
    flat.filter((t) => t.status === "warn").forEach((t) => lines.push("⚠️ " + t.name + " — " + t.warns.join("; ")));
    return lines.join("\n");
  }

  function flashButton(btn, text) {
    const old = btn.textContent;
    btn.textContent = text;
    setTimeout(() => { btn.textContent = old; }, 1500);
  }

  /* ------------------------------------------------------------------
     ZDARZENIA
     ------------------------------------------------------------------ */
  results.addEventListener("click", (ev) => {
    const suiteRun = ev.target.closest("[data-run-suite]");
    if (suiteRun) {
      ev.stopPropagation();
      runList(SUITES[Number(suiteRun.dataset.runSuite)].tests.slice());
      return;
    }
    const testRun = ev.target.closest("[data-run-test]");
    if (testRun) {
      ev.stopPropagation();
      const t = byUid[testRun.dataset.runTest];
      if (t) runList([t]);
      return;
    }
    const head = ev.target.closest(".suite__head");
    if (head) {
      head.parentElement.classList.toggle("is-collapsed");
      return;
    }
    const row = ev.target.closest(".test__row");
    if (row) {
      const t = byUid[row.dataset.toggle];
      if (t) testEls[t.uid].classList.toggle("is-open");
    }
  });

  document.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".chip").forEach((c) => c.classList.remove("is-active"));
      chip.classList.add("is-active");
      activeFilter = chip.dataset.filter;
      applyFilter();
    });
  });

  runAllBtn.addEventListener("click", () => runList(flat.slice()));
  retryBtn.addEventListener("click", () => {
    const failed = flat.filter((t) => t.status === "fail" || t.status === "warn");
    runList(failed);
  });
  stopBtn.addEventListener("click", () => {
    stopFlag = true;
    stopBtn.disabled = true;
    statusText.textContent = "Zatrzymywanie po bieżącym teście…";
    setTimeout(() => { stopBtn.disabled = false; }, 1000);
  });
  downloadBtn.addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(buildReport(), null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    const ts = new Date().toISOString().slice(0, 16).replace(/[:T]/g, "-");
    a.download = "raport-testow-portowa-fala-" + ts + ".json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  });
  copyBtn.addEventListener("click", () => {
    const txt = reportText();
    const done = () => flashButton(copyBtn, "✔ Skopiowano");
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(txt).then(done, () => fallbackCopy(txt, done));
    } else {
      fallbackCopy(txt, done);
    }
  });

  function fallbackCopy(txt, done) {
    const ta = document.createElement("textarea");
    ta.value = txt;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      done();
    } catch (e) {
      window.prompt("Skopiuj raport ręcznie:", txt);
    }
    ta.remove();
  }

  window.addEventListener("resize", fitStage);

  /* ------------------------------------------------------------------
     START
     ------------------------------------------------------------------ */
  renderSuites();
  applyFilter();

  const d = new Date();
  envInfo.textContent = d.toLocaleDateString("pl-PL") + " " +
    d.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" });

  updateSummary();
  statusText.textContent = "Testy uruchomią się automatycznie…";
  setTimeout(() => runList(flat.slice()), 500);
})();
