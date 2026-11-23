# WTP LIVE v20 — instalacja bez ręcznego GTFS

## Co wgrać
Wgraj zawartość archiwum do **głównego katalogu repozytorium FWTP**, zachowując ścieżki:

- `test/index.html`
- `test/app.js`
- `test/config.js`
- `test/style.css`
- `test/update_gtfs.py`
- `.github/workflows/update-gtfs.yml`

**Nie wgrywaj folderu `gtfs/` — nie ma go w paczce.** Powstanie automatycznie po pierwszym udanym uruchomieniu workflow. Nie wgrywaj `test/worker.js`: Worker Cloudflare jest osobną usługą i pozostaje bez zmian.

## Uruchomienie automatyzacji

1. Otwórz repozytorium `FWTPKOM/FWTP` na GitHubie. Jeśli korzystasz z „Add file → Upload files”, **nie wrzucaj wszystkich plików do katalogu głównego bez zachowania folderów**. Najprościej skorzystać z GitHub Desktop i skopiować zawartość paczki do lokalnego repozytorium, następnie Commit i Push. Alternatywnie wgraj pliki z folderu `test` do `/test/`, a plik workflow do `/.github/workflows/`.
2. `Settings → Actions → General → Workflow permissions`: wybierz **Read and write permissions** i zapisz. Upewnij się, że Actions są włączone.
3. `Settings → Pages`: sprawdź, czy strona jest publikowana z gałęzi, na której pracuje workflow (zwykle `main`), albo czy workflow publikacji Pages obejmuje aktualizacje tej gałęzi.
4. `Actions → Automatyczna aktualizacja GTFS → Run workflow → Run workflow` (na domyślnej gałęzi).
5. Poczekaj na zielony wynik. W repozytorium pojawią się automatycznie `test/gtfs/status.json` oraz `test/gtfs/<linia>.json` — również nowe linie z pobranego GTFS.
6. Sprawdź `https://fwtpkom.github.io/FWTP/test/gtfs/status.json` oraz `https://fwtpkom.github.io/FWTP/test/`. GitHub Pages może potrzebować kilku minut na publikację.

## Co dzieje się później
Workflow jest zaplanowany co 4 godziny (UTC) i generuje komplet danych dla **bieżącego dnia w Polsce**. Zmiany linii i nowe linie pojawiają się automatycznie, o ile są zawarte w GTFS. Przy błędzie pobierania zadanie kończy się niepowodzeniem i nie zatwierdza zmian. Po północy nowy rozkład będzie dostępny dopiero po następnym udanym przebiegu; strona nie powinna pokazywać starego rozkładu jako aktualnego. Harmonogram GitHub Actions może się opóźniać.

## Diagnostyka
- Brak zakładki workflow: sprawdź, czy `.github/workflows/update-gtfs.yml` znajduje się w głównym katalogu i na gałęzi domyślnej.
- Błąd `403` przy `git push`: sprawdź `Settings → Actions → General → Workflow permissions`, polityki organizacji i ochronę gałęzi.
- Błąd pobierania: wejdź w `Actions`, otwórz nieudany przebieg i krok „Pobierz i przetwórz GTFS”. Źródła mogą być okresowo niedostępne.
- Brak danych na stronie: sprawdź status.json, datę w polu `date` i ustawienia Pages. Przy pierwszym uruchomieniu strona nie ma rozkładów, dopóki workflow nie zakończy się poprawnie.

## Zakres
GPS i Cloudflare Worker pozostają bez zmian. Godziny z GTFS są planowe; dopasowanie pojazdu do kursu jest przybliżone. Nowe chronione API `eta.ztm.waw.pl` **nie jest podłączone w v20** i nie należy wpisywać jego danych dostępowych do publicznego repozytorium.
