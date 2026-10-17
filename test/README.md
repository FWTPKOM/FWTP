# WTP LIVE v3 — bez logowania użytkowników

Strona działa na GitHub Pages. API Warszawy wymaga klucza, dlatego do publicznej mapy potrzebny jest Cloudflare Worker. Użytkownicy końcowi **nie podają żadnego klucza**.

## Konfiguracja (jednorazowa, przez właściciela)

1. Cloudflare Dashboard → Workers & Pages → Create → Worker. Wklej zawartość `worker.js` i opublikuj.
2. Worker → Settings → Variables and Secrets → Add → **Secret**, nazwa `API_KEY`. Wklej swój **nowy** klucz API Warszawa. Nie wpisuj klucza do plików na GitHubie.
3. Skopiuj adres Workera, np. `https://wtp-live-api.twojanazwa.workers.dev`.
4. W `config.js` wpisz ten adres w `window.WTP_API_PROXY`.
5. Do folderu `/FWTP/test/` na GitHubie wgraj `index.html`, `style.css`, `app.js`, `config.js` (zastępując stare). **Nie musisz wgrywać `worker.js` ani sekretu do GitHuba.**
6. Otwórz `https://fwtpkom.github.io/FWTP/test/` i odśwież Ctrl+F5.

**Uwaga:** v3 nie wymaga logowania użytkowników, ale pierwsza konfiguracja Workera wymaga konta Cloudflare. Sam GitHub Pages nie przechowuje sekretów serwerowych. Worker używa ograniczonej listy dozwolonych endpointów; przed dużym ruchem warto ograniczyć CORS do własnej domeny i włączyć limity żądań.

## Diagnostyka

- Mapa bez pojazdów i komunikat „ustaw adres Workera”: nieuzupełniony `config.js`.
- Błąd 500: brak sekretu `API_KEY`.
- Błąd 403 / błędny klucz: sprawdź klucz w panelu API Warszawy.
- „Failed to fetch”: sprawdź URL Workera i konfigurację domeny.
- W razie braku stylów: sprawdź, czy `style.css` i `config.js` leżą obok `index.html`.

API może czasowo nie odpowiadać, a zakres danych zależy od jego aktualnej dostępności. Nie weryfikowano jeszcze działania na żywym kluczu.
