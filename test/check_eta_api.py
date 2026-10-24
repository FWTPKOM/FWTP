#!/usr/bin/env python3
"""WTP LIVE v55: safe network diagnostic for ETA API from GitHub Actions."""
import os
import socket
import ssl
import sys
import time
import urllib.error
import urllib.request

HOST = 'eta.ztm.waw.pl'
KEY = os.environ.get('ETA_API_KEY', '').strip()
TIMEOUT = 7

def describe(e):
    if isinstance(e, (TimeoutError, socket.timeout)):
        return 'TIMEOUT'
    if isinstance(e, socket.gaierror):
        return 'DNS_ERROR'
    if isinstance(e, ssl.SSLError):
        return 'TLS_ERROR (' + type(e).__name__ + ')'
    if isinstance(e, ConnectionRefusedError):
        return 'CONNECTION_REFUSED'
    if isinstance(e, ConnectionResetError):
        return 'CONNECTION_RESET'
    if isinstance(e, OSError):
        return type(e).__name__ + ' errno=' + str(e.errno)
    return type(e).__name__

def tcp_probe(host, port):
    start = time.monotonic()
    try:
        with socket.create_connection((host, port), timeout=TIMEOUT):
            print(f'  TCP {host}:{port}: OK ({time.monotonic()-start:.1f}s)')
            return True
    except OSError as e:
        print(f'  TCP {host}:{port}: {describe(e)} ({time.monotonic()-start:.1f}s)')
        return False

def tls_probe():
    try:
        with socket.create_connection((HOST, 443), timeout=TIMEOUT) as sock:
            sock.settimeout(TIMEOUT)
            with ssl.create_default_context().wrap_socket(sock, server_hostname=HOST) as secure:
                print('  TLS: OK (' + secure.version() + ')')
                return True
    except OSError as e:
        print('  TLS: ' + describe(e))
        return False

def http_probe(path, proxy_enabled):
    opener = urllib.request.build_opener() if proxy_enabled else urllib.request.build_opener(urllib.request.ProxyHandler({}))
    request = urllib.request.Request('https://' + HOST + path, headers={
        'X-api-key': KEY,
        'Accept': 'application/json',
        'User-Agent': 'WTP-LIVE-Diagnostic/55',
    })
    mode = 'system-proxy' if proxy_enabled else 'direct'
    try:
        with opener.open(request, timeout=TIMEOUT) as response:
            # Never print response body or credentials.
            print(f'  HTTPS {path} [{mode}]: HTTP {response.status}; content-type={response.headers.get("Content-Type", "unknown").split(";")[0]}')
            return response.status == 200
    except urllib.error.HTTPError as e:
        print(f'  HTTPS {path} [{mode}]: HTTP {e.code} (serwer odpowiedzial)')
    except urllib.error.URLError as e:
        print(f'  HTTPS {path} [{mode}]: {describe(e.reason)}')
    except OSError as e:
        print(f'  HTTPS {path} [{mode}]: {describe(e)}')
    return False

print('WTP LIVE v55 - diagnostyka polaczenia ETA')
print('Sekret ETA_API_KEY:', 'OBECNY' if KEY else 'BRAK')
if not KEY:
    sys.exit(1)

try:
    addresses = socket.getaddrinfo(HOST, 443, family=socket.AF_INET, type=socket.SOCK_STREAM)
    print('DNS ETA: OK; adresow IPv4:', len({item[4][0] for item in addresses}))
except OSError as e:
    print('DNS ETA:', describe(e))

print('\n1. Test polaczenia do serwera kontrolnego (github.com):')
tcp_probe('github.com', 443)
print('\n2. Test TCP do ETA:')
tcp_ok = tcp_probe(HOST, 443)
print('\n3. Test TLS do ETA:')
tls_ok = tls_probe() if tcp_ok else False
if not tcp_ok:
    print('  POMINIETO: TCP do ETA nie dziala; handshake TLS nie jest mozliwy.')

print('\n4. Test HTTP z naglowkiem X-api-key:')
found = False
for path in ('/timetable1', '/api/timetable1', '/api/version'):
    found = http_probe(path, True) or found
if not found:
    print('\n5. Kontrolne polaczenie HTTP bez proxy:')
    found = http_probe('/timetable1', False) or found

print('\nPODSUMOWANIE:')
if found:
    print('API odpowiedzialo HTTP 200; mozna przejsc do analizy odpowiedzi.')
else:
    print('Brak HTTP 200. Jesli TCP ETA=TIMEOUT, problem dotyczy polaczenia sieciowego, nie mozna jeszcze ocenic klucza.')
    print('Jesli TCP/TLS=OK, sprawdz kody HTTP i endpointy.')
sys.exit(0 if found else 1)
