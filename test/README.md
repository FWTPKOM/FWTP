# WTP LIVE – wersja 1

Projekt statyczny przygotowany do GitHub Pages.

## Funkcje
- mapa autobusów i tramwajów na żywo,
- automatyczne odświeżanie pozycji co 10 sekund,
- filtrowanie po numerze linii,
- informacje: linia, brygada, numer taborowy, czas GPS,
- wyszukiwarka przystanków,
- linie na wybranym słupku,
- planowe odjazdy wraz z kierunkiem i brygadą.

## Uruchomienie
1. Rozpakuj ZIP.
2. Wgraj `index.html`, `style.css` i `app.js` do repozytorium GitHub.
3. W Settings -> Pages ustaw publikację z odpowiedniej gałęzi.
4. Po wejściu na stronę wpisz własny ApiKey z api.um.warszawa.pl.

Klucz API NIE jest zapisany w plikach ani localStorage.

## Ważne przed publicznym udostępnieniem
GitHub Pages nie ma backendu. W tej wersji każdy użytkownik musi podać własny klucz API.
Docelowo można dodać proxy/serverless function i trzymać klucz jako sekret po stronie serwera.
