#!/usr/bin/env python3
"""WTP LIVE v53 — bezpieczny test dostępu do API ETA; bez publikacji klucza."""
import json
import os
import sys
import urllib.error
import urllib.request

BASE = 'https://eta.ztm.waw.pl'
KEY = os.environ.get('ETA_API_KEY', '').strip()
if not KEY:
    print('BŁĄD: Brak sekretu ETA_API_KEY w GitHub Actions.')
    sys.exit(1)

results = []
for path in ('/api/version', '/api/timetable1'):
    req = urllib.request.Request(BASE + path, headers={
        'X-api-key': KEY,
        'Accept': 'application/json',
        'User-Agent': 'WTP-LIVE-ETA-Connectivity/53',
    }, method='GET')
    try:
        with urllib.request.urlopen(req, timeout=25) as resp:
            raw = resp.read(1024 * 1024)
            content_type = resp.headers.get('Content-Type', '')
            try:
                parsed = json.loads(raw)
                if isinstance(parsed, list):
                    shape = 'lista JSON (' + str(len(parsed)) + ' elementów)'
                elif isinstance(parsed, dict):
                    shape = 'obiekt JSON (pola: ' + ', '.join(list(parsed)[:12]) + ')'
                else:
                    shape = 'wartość JSON'
            except (ValueError, UnicodeDecodeError):
                shape = 'odpowiedź nie jest JSON'
            print(f'{path}: HTTP {resp.status}; {shape}; Content-Type: {content_type}')
            results.append(resp.status == 200 and shape != 'odpowiedź nie jest JSON')
    except urllib.error.HTTPError as exc:
        print(f'{path}: HTTP {exc.code} — serwer odmówił dostępu lub brak danych.')
        results.append(False)
    except (urllib.error.URLError, TimeoutError, OSError) as exc:
        print(f'{path}: błąd połączenia: {type(exc).__name__} (bez ujawniania adresu z kluczem).')
        results.append(False)

if all(results):
    print('WYNIK: oba endpointy odpowiedziały poprawnym JSON. Można badać strukturę rozkładów.')
else:
    print('WYNIK: test nie przeszedł. Nie uruchamiaj jeszcze importu brygad.')
    sys.exit(1)
