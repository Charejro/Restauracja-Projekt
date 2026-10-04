# Aplikacja testowa — Portowa Fala

Zestaw **42 automatycznych testów** strony, uruchamiany w przeglądarce. Nie wymaga instalacji
Node.js, Pythona ani serwera — wystarczy otworzyć `testy.html`.

## Uruchamianie

1. Otwórz `testy.html` (dwuklik) w Chrome, Edge lub Firefox.
2. Testy startują automatycznie. Przyciski u góry:
   - **▶ Uruchom wszystkie** — pełny zestaw od nowa,
   - **↻ Ponów nieudane** — powtarza testy z błędami i ostrzeżeniami,
   - **■ Zatrzymaj** — kończy po bieżącym teście,
   - **📋 Kopiuj podsumowanie** — wklej wynik np. do czatu,
   - **⬇ Raport JSON** — plik z pełnymi wynikami.
3. Kliknij wiersz testu, aby rozwinąć szczegóły (opis, błąd, ostrzeżenia). Przycisk **▶** przy
   teście uruchamia tylko ten jeden test, a przy nazwie grupy — całą grupę.
4. Filtry u góry (✅ / ❌ / ⚠️) pokazują tylko wybrane wyniki.

## Jak to działa

- `testy.html` ładuje `index.html?test=1` w ramce obok wyników.
- `js/test-agent.js` (dołączony do `index.html`) odbiera testy przez `postMessage`, wykonuje je
  na prawdziwej stronie i odsyła rezultaty.
- Przed każdym testem strona jest przeładowywana, więc testy są niezależne od siebie.
- Poza adresem z `?test=1` agent nic nie robi — na produkcji to jeden nieaktywny skrypt.

## Co jest sprawdzane

| Grupa | Przykłady |
| --- | --- |
| 🏗️ Ładowanie i metadane | `lang`, `<title>`, meta description, viewport, aktywny CSS, brak błędów JS |
| 🧭 Nawigacja i struktura | działające linki do sekcji, stopka z rokiem, hero z CTA |
| 🍽️ Menu i dania | zakładki kategorii, kompletność kart, ładowanie ilustracji SVG |
| 🛒 Koszyk | dodawanie, ilości, usuwanie, sumy, zaliczka 10%, przenoszenie do formularza |
| 📝 Formularz zamówienia | walidacja telefonu i adresu, odbiór osobisty, potwierdzenie i reset |
| 🪑 Rezerwacja | plan sali 13 stolików, godziny, wybór stolika, pogoda a taras, potwierdzenie |
| 📱 Responsywność i dostępność | hamburger na telefonie, siatka na desktopie, brak przewijania poziomego, `alt`, `label`, nagłówki, smoke test |

## Dodawanie własnych testów

W `js/testy.js` dopisz obiekt w tablicy `SUITES`:

```js
{
  name: "Mój nowy test",
  desc: "Co sprawdza.",
  viewport: [1366, 900],        // opcjonalnie, domyślnie desktop
  code: async (ctx) => {
    ctx.click("#cartBtn");
    await ctx.wait(() => ctx.$("#cartDrawer").classList.contains("is-open"), 1500, "otwarcie koszyka");
    ctx.eq(ctx.text("#cartTotal"), "0,00 zł", "suma koszyka");
  }
}
```

Dostępne helpery `ctx`: `$`, `$$`, `text`, `click`, `set`, `check`, `submit`, `wait`, `sleep`,
`assert`, `eq`, `match`, `warn` (ostrzeżenie bez błędu), `errors` (błędy JS strony), `today`.

## Wymagania

- `js/test-agent.js` musi istnieć i być dołączony w `index.html` (`<script src="js/test-agent.js"></script>`).
- Testy pogodowe korzystają z `api.open-meteo.com`. Bez internetu strona przechodzi w tryb
  szacowany, a test nadal przechodzi — sprawdzana jest spójność stanu tarasu ze stolikami.
