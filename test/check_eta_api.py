#!/usr/bin/env python3
"""WTP LIVE v54: diagnostyka ETA bez ujawniania klucza i tresci odpowiedzi."""
import os
import sys
import json
import socket
import ssl
import urllib.request
import urllib.error

HOST = 'eta.ztm.waw.pl'
KEY = os.getenv('ETA_API_KEY', '').strip()
PATHS = ('/timetable1', '/api/timetable1', '/api/version')

def reason(exc):
    if isinstance(exc, (TimeoutError, socket.timeout)):
        return 'timeout'
    if isinstance(exc, socket.gaierror):
        return f'DNS (errno={exc.errno})'
    if isinstance(exc, ssl.SSLError):
        return f'TLS/SSL ({type(exc).__name__})'
    if isinstance(exc, ConnectionRefusedError):
        return 'polaczenie odrzucone'
    if isinstance(exc, ConnectionResetError):
        return 'polaczenie zerwane'
    if isinstance(exc, OSError):
        return f'{type(exc).__name__} (errno={exc.errno})'
    return type(exc).__name__

if not KEY:
    print('BLAD: Brak sekretu ETA_API_KEY w Actions.')
    sys.exit(1)

print('WTP LIVE v54 - diagnostyka ETA')
print('Sekret jest ustawiony: TAK (wartosc ukryta).')
try:
    infos = socket.getaddrinfo(HOST, 443, type=socket.SOCK_STREAM)
    families = sorted({'IPv6' if x[0] == socket.AF_INET6 else 'IPv4' for x in infos})
    print('DNS: OK; rodziny:', ', '.join(families))
except OSError as exc:
    print('DNS:', reason(exc))

ok = False
for path in PATHS:
    print(f'\nTest {path}:')
    req = urllib.request.Request(
        'https://' + HOST + path,
        headers={'X-api-key': KEY, 'Accept': 'application/json', 'User-Agent': 'WTP-LIVE-ETA-Test/54'},
        method='GET',
    )
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            body = resp.read(128 * 1024)
            ct = resp.headers.get('Content-Type', '').split(';')[0]
            try:
                value = json.loads(body)
                shape = ('obiekt: ' + ', '.join(str(k) for k in list(value)[:10])) if isinstance(value, dict) else ('lista: ' + str(len(value))) if isinstance(value, list) else type(value).__name__
            except (ValueError, UnicodeError):
                shape = 'nie-JSON'
            print(f'  HTTP {resp.status}; typ={ct}; struktura={shape}')
            if resp.status == 200 and shape != 'nie-JSON':
                ok = True
    except urllib.error.HTTPError as exc:
        print(f'  HTTP {exc.code}; odpowiedz serwera (bez tresci)')
        if exc.code in (401, 403):
            print('  Uwaga: problem autoryzacji lub uprawnien dla tej sciezki.')
        elif exc.code == 404:
            print('  Uwaga: sciezka nie istnieje na serwerze.')
    except urllib.error.URLError as exc:
        print('  URLError:', reason(exc.reason))
    except (TimeoutError, OSError) as exc:
        print('  Blad sieci:', reason(exc))

print('\nWYNIK:', 'co najmniej jeden endpoint zwrocil JSON HTTP 200' if ok else 'brak potwierdzonego dostepu; przeslij log bez sekretow')
sys.exit(0 if ok else 1)
