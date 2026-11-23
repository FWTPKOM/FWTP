#!/usr/bin/env python3
"""WTP LIVE: prefetch future ETA timetable ZIPs, activate today's validated SQLite.
Existing ETA_API_KEY, ETA_USER, ETA_PASSWORD, ETA_BASE_URL supported.
Keeps only 4 nearest future ZIPs, imports only active date to save VPS space.
"""
import datetime as dt
import json
import os
from pathlib import Path
import re
import subprocess
import sys
import tempfile
from urllib.parse import quote
from zoneinfo import ZoneInfo
import requests

BASE = os.getenv('ETA_BASE_URL', 'https://eta.ztm.waw.pl').rstrip('/')
ROOT = Path('/opt/wtp-live')
DB = Path(os.getenv('ETA_DB_PATH', str(ROOT / 'data/eta_v2.db')))
CACHE = Path(os.getenv('ETA_ARCHIVE_CACHE', str(ROOT / 'data/eta_archives')))
TODAY = dt.datetime.now(ZoneInfo('Europe/Warsaw')).date()
KEEP_FUTURE = int(os.getenv('ETA_PREFETCH_DAYS', '4'))


def entries(obj):
    if isinstance(obj, list):
        return [v for v in obj if isinstance(v, dict)]
    if isinstance(obj, dict):
        for key in ('result', 'data', 'files', 'timetables', 'items'):
            if key in obj:
                found = entries(obj[key])
                if found:
                    return found
    return []


def archive_day(name):
    # Name: Rozklady_2026-11-21_2026-11-18_18-50-06.json.zip
    m = re.match(r'^Rozklady_(\d{4}-\d{2}-\d{2})_', name, re.I)
    if not m:
        return None
    try:
        return dt.date.fromisoformat(m.group(1))
    except ValueError:
        return None


def existing_day():
    if not DB.is_file():
        return None
    import sqlite3
    try:
        con = sqlite3.connect('file:' + str(DB) + '?mode=ro', uri=True)
        try:
            row = con.execute("SELECT value FROM metadata WHERE key='date'").fetchone()
            return row[0] if row else None
        finally:
            con.close()
    except sqlite3.Error:
        return None


def download(session, name, item, dest):
    url = item.get('url') or item.get('downloadUrl') or BASE + '/timetable1/' + quote(name)
    if not str(url).startswith(BASE + '/timetable1/'):
        raise RuntimeError('Nieoczekiwany URL archiwum')
    with tempfile.NamedTemporaryFile(dir=CACHE, prefix='.eta-', suffix='.zip', delete=False) as f:
        temp = Path(f.name)
    try:
        with session.get(url, stream=True, timeout=(15, 180)) as r:
            r.raise_for_status()
            with temp.open('wb') as out:
                for chunk in r.iter_content(1024 * 1024):
                    if chunk:
                        out.write(chunk)
        import zipfile
        if not zipfile.is_zipfile(temp):
            raise RuntimeError('Pobrany plik nie jest ZIP')
        temp.replace(dest)
    finally:
        temp.unlink(missing_ok=True)


def main():
    key = os.getenv('ETA_API_KEY', '').strip()
    if not key:
        sys.exit('BRAK ETA_API_KEY: niczego nie zmieniono')
    CACHE.mkdir(parents=True, exist_ok=True)
    DB.parent.mkdir(parents=True, exist_ok=True)
    session = requests.Session()
    session.trust_env = False
    session.headers['X-api-key'] = key
    if os.getenv('ETA_USER') and os.getenv('ETA_PASSWORD'):
        session.auth = (os.environ['ETA_USER'], os.environ['ETA_PASSWORD'])
    r = session.get(BASE + '/timetable1', timeout=(15, 90))
    r.raise_for_status()
    found = entries(r.json())
    selected = {}
    for item in found:
        name = str(item.get('name') or item.get('fileName') or item.get('filename') or '')
        day = archive_day(name)
        if not day or not (TODAY <= day <= TODAY + dt.timedelta(days=KEEP_FUTURE)):
            continue
        if 'zmienione' in name.lower() or not name.lower().endswith('.json.zip'):
            continue
        if day not in selected or name > selected[day][0]:
            selected[day] = (name, item)
    # v261: słowniki aktualizowane niezależnie od daty rozkładu.
    try:
        subprocess.run([sys.executable, '-u', str(ROOT / 'eta_slowniki.py')], check=True)
    except Exception as exc:
        print('UWAGA: słowniki ETA nie zostały zaktualizowane:', exc, file=sys.stderr, flush=True)
    if not selected:
        sys.exit(f'Brak pełnych archiwów ETA dla {TODAY} i kolejnych {KEEP_FUTURE} dni; baza bez zmian')
    cached = {}
    for day in sorted(selected):
        name, item = selected[day]
        dest = CACHE / name
        if not dest.is_file():
            print('Pobieranie:', name, flush=True)
            download(session, name, item, dest)
        cached[day] = dest
    # Prune only managed ZIPs; preserve unrelated user files.
    keep = set(cached.values())
    for file in CACHE.glob('Rozklady_*.json.zip'):
        if file not in keep:
            file.unlink(missing_ok=True)
    if TODAY not in cached:
        print(json.dumps({'ok': True, 'active': existing_day(), 'today_archive': False,
                          'prefetched': [str(x) for x in sorted(cached)]}, ensure_ascii=False))
        return
    if existing_day() == TODAY.isoformat():
        print(json.dumps({'ok': True, 'active': TODAY.isoformat(), 'unchanged': True,
                          'prefetched': [str(x) for x in sorted(cached)]}, ensure_ascii=False))
        return
    print('Import aktualnego rozkladu:', cached[TODAY].name, flush=True)
    # Importer creates .tmp and atomically replaces DB only after validation.
    subprocess.run([sys.executable, '-u', str(ROOT / 'eta_import_v2.py'),
                    str(cached[TODAY]), str(DB)], check=True)
    if existing_day() != TODAY.isoformat():
        raise RuntimeError('Import zakończony, ale data bazy nie zgadza się z dzisiaj')
    print(json.dumps({'ok': True, 'active': TODAY.isoformat(),
                      'prefetched': [str(x) for x in sorted(cached)]}, ensure_ascii=False))


if __name__ == '__main__':
    main()
