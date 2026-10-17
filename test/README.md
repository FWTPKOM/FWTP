# WTP LIVE — wersja 2

Zastąp pliki `index.html`, `style.css` i `app.js` w folderze `FWTP/test/` plikami z paczki. Wersja 2 pokazuje dokładne błędy API i nie zamyka okna klucza, dopóki nie pobierze danych.

**Ważne:** strona GitHub Pages jest statyczna. Jeśli API Warszawy nie zezwala na zapytania CORS z przeglądarki, do publicznego działania potrzebny jest backend/proxy (np. Cloudflare Worker). Samo podanie prawidłowego klucza nie rozwiąże CORS. Klucz API nie jest zapisany w kodzie ani w localStorage. Nie wpisuj klucza do publicznego repozytorium.

Jeśli mapa nie pojawia się: sprawdź w konsoli przeglądarki F12 błędy ładowania biblioteki Leaflet. Jeśli jest błąd CORS, przekaż sam tekst błędu, bez klucza API.
