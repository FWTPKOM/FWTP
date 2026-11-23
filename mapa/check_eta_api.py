#!/usr/bin/env python3
"""WTP LIVE v56: safe network and Basic Auth diagnostics (no credential output)."""
import base64
import os
import socket
import ssl
import urllib.error
import urllib.request
from urllib.parse import urlparse

HOST = 'eta.ztm.waw.pl'
URL = f'https://{HOST}/timetable1'
TIMEOUT = 12


def tcp(host, port=443):
    try:
        with socket.create_connection((host, port), timeout=TIMEOUT):
            return True, 'OK'
    except (OSError, TimeoutError) as exc:
        return False, type(exc).__name__ + (': timeout' if isinstance(exc, TimeoutError) else '')


def request(label, auth=None):
    headers = {'User-Agent': 'WTP-LIVE-ETA-diagnostic/56', 'Accept': 'application/json, */*'}
    if auth:
        user, password = auth
        token = base64.b64encode(f'{user}:{password}'.encode()).decode()
        headers['Authorization'] = f'Basic {token}'
    req = urllib.request.Request(URL, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=TIMEOUT) as resp:
            print(f'{label}: HTTP {resp.status}; content-type={resp.headers.get("Content-Type", "unknown")}; bytes-read={len(resp.read(256))}')
            return resp.status in (200, 204)
    except urllib.error.HTTPError as exc:
        print(f'{label}: HTTP {exc.code} (odpowiedź serwera, bez treści i nagłówków)')
    except urllib.error.URLError as exc:
        reason = exc.reason
        if isinstance(reason, socket.timeout) or isinstance(reason, TimeoutError):
            detail = 'timeout'
        elif isinstance(reason, ssl.SSLError):
            detail = 'TLS/SSL'
        elif isinstance(reason, OSError):
            detail = type(reason).__name__
        else:
            detail = 'problem sieciowy'
        print(f'{label}: URLError ({detail})')
    except Exception as exc:
        print(f'{label}: {type(exc).__name__} (bez szczegółów)')
    return False


def main():
    print('WTP LIVE v56 - test ETA Basic Auth')
    user = os.environ.get('ETA_BASIC_USER', '')
    password = os.environ.get('ETA_BASIC_PASSWORD', '')
    print('ETA_BASIC_USER:', 'USTAWIONY' if user else 'BRAK')
    print('ETA_BASIC_PASSWORD:', 'USTAWIONY' if password else 'BRAK')
    try:
        addr = socket.getaddrinfo(HOST, 443, type=socket.SOCK_STREAM)
        print('DNS:', 'OK' if addr else 'BRAK')
    except OSError:
        print('DNS: BŁĄD')
    print('TCP github.com:443:', tcp('github.com')[1])
    reachable, status = tcp(HOST)
    print(f'TCP {HOST}:443: {status}')
    if not reachable:
        print('WNIOSEK: Brak połączenia TCP z ETA z GitHub Actions. Basic Auth nie może być sprawdzony.')
        return 2
    print('TCP ETA działa; test HTTP bez uwierzytelnienia:')
    request('Bez Basic Auth')
    if not (user and password):
        print('WNIOSEK: Dodaj oba sekrety ETA_BASIC_USER i ETA_BASIC_PASSWORD.')
        return 2
    print('Test HTTP z Basic Auth:')
    if request('Z Basic Auth', (user, password)):
        print('WYNIK: połączenie i autoryzacja OK.')
        return 0
    print('WYNIK: brak potwierdzonego dostępu.')
    return 1


if __name__ == '__main__':
    raise SystemExit(main())
