"""WTP LIVE v66: bezpieczny test dostepu GitHub Actions do ETA.
Nie zapisuje odpowiedzi, sekretow ani archiwow.
"""
import os
import socket
import sys
import time
from urllib.parse import urlsplit

import requests
from requests.auth import HTTPBasicAuth

HOST = "eta.ztm.waw.pl"
URL = f"https://{HOST}/timetable1"


def main():
    print("WTP LIVE v66 | GitHub Actions -> ETA", flush=True)
    user = os.environ.get("ETA_BASIC_USER", "")
    password = os.environ.get("ETA_BASIC_PASSWORD", "")
    key = os.environ.get("ETA_API_KEY", "")
    for name, val in (("ETA_BASIC_USER", user), ("ETA_BASIC_PASSWORD", password), ("ETA_API_KEY", key)):
        print(f"Sekret {name}: {'OBECNY' if val else 'BRAK'}", flush=True)
    if not all((user, password, key)):
        print("WYNIK: brak wymaganych sekretow repozytorium", flush=True)
        return 2

    try:
        ips = socket.getaddrinfo(HOST, 443, type=socket.SOCK_STREAM)
        print(f"DNS: OK; adresow: {len(set(x[4][0] for x in ips))}", flush=True)
    except OSError as exc:
        print(f"DNS: BLAD ({type(exc).__name__})", flush=True)
        return 3

    # Oddzielna diagnostyka TCP: nie drukujemy IP ani danych uwierzytelnienia.
    try:
        started = time.monotonic()
        with socket.create_connection((HOST, 443), timeout=8):
            print(f"TCP 443: OK ({time.monotonic()-started:.1f}s)", flush=True)
    except OSError as exc:
        print(f"TCP 443: BLAD ({type(exc).__name__}: {str(exc)[:100]})", flush=True)
        print("WYNIK: problem sieciowy; nie mozna ocenic danych logowania", flush=True)
        return 4

    try:
        with requests.Session() as session:
            session.trust_env = True
            response = session.get(
                URL,
                auth=HTTPBasicAuth(user, password),
                headers={"x-api-key": key, "Accept": "application/json"},
                timeout=(8, 15),
                allow_redirects=False,
                stream=True,
            )
            print(f"HTTP: {response.status_code}", flush=True)
            print(f"Content-Type: {response.headers.get('Content-Type', 'brak').split(';')[0]}", flush=True)
            if 300 <= response.status_code < 400:
                print("WYNIK: przekierowanie (cel ukryty)", flush=True)
                return 5
            if response.status_code != 200:
                print("WYNIK: serwer odpowiedzial, ale nie HTTP 200", flush=True)
                return 6
            # Manifest: maks. 256 KiB; nie drukujemy tresci.
            limit = 256 * 1024
            chunks = []
            size = 0
            for chunk in response.iter_content(chunk_size=16384):
                size += len(chunk)
                if size > limit:
                    print("WYNIK: HTTP 200, ale odpowiedz przekracza limit testu", flush=True)
                    return 7
                chunks.append(chunk)
            import json
            try:
                payload = json.loads(b"".join(chunks))
            except (ValueError, UnicodeDecodeError):
                print("WYNIK: HTTP 200, ale odpowiedz nie jest JSON", flush=True)
                return 8
            print(f"JSON: OK; typ={type(payload).__name__}", flush=True)
            print("WYNIK: SUKCES - GitHub Actions ma dostep do manifestu ETA", flush=True)
            return 0
    except requests.exceptions.SSLError:
        print("HTTPS: blad weryfikacji TLS/certyfikatu", flush=True)
        return 9
    except requests.exceptions.Timeout:
        print("HTTPS: timeout", flush=True)
        return 10
    except requests.exceptions.RequestException as exc:
        print(f"HTTPS: blad ({type(exc).__name__}); szczegoly ukryte", flush=True)
        return 11


if __name__ == "__main__":
    sys.exit(main())
