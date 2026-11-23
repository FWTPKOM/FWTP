#!/usr/bin/env python3
"""WTP LIVE ETA importer v2.1: streaming JSON ZIP -> SQLite.
Usage: python3 -u eta_import_v2.py /root/eta_2026-10-25.zip /opt/wtp-live/data/eta.db
Requires: python3-ijson.
"""
import argparse
import datetime as dt
import json
import os
import sqlite3
import sys
import time
import unicodedata
import zipfile
import re

import ijson

SECTIONS = ('rozkłady_jazdy', 'kursy_przejazdy', 'zadania', 'tabliczki',
            'warianty', 'odcinki', 'praca_eksploatacyjna', 'kształt_trasy_GPS',
            'standard_tabliczki', 'pary_zadan', 'dopiski_kursow')


def norm(value):
    s = unicodedata.normalize('NFKD', str(value))
    return ''.join(c for c in s if not unicodedata.combining(c)).lower().replace('ł', 'l')


def field(row, *names):
    normalized = {norm(k): v for k, v in row.items()}
    for name in names:
        value = normalized.get(norm(name))
        if value is not None:
            return str(value)
    return ''


def section_keys(z, member):
    keys, metadata = [], {}
    with z.open(member) as stream:
        for prefix, event, value in ijson.parse(stream):
            if prefix == '' and event == 'map_key':
                keys.append(value)
            elif prefix in ('version', 'date') and event in ('string', 'number'):
                metadata[prefix] = str(value)
    return keys, metadata


def clock_seconds(value):
    if not value:
        return None
    m = re.fullmatch(r"\s*(\d{1,3}):(\d{2})(?::(\d{2}))?\s*", str(value))
    if not m or int(m[2]) > 59 or int(m[3] or 0) > 59:
        return None
    return int(m[1])*3600 + int(m[2])*60 + int(m[3] or 0)


def reorder_course_stops(conn):
    """Sort within each course by timetable time; preserve input order for ties.
    No inferred route geometry or invented stop ordering.
    """
    departures = dict(conn.execute('SELECT course_id,departure FROM courses'))
    conn.execute('CREATE INDEX IF NOT EXISTS ix_course_stops_course ON course_stops(course_id,seq)')
    course_ids = [r[0] for r in conn.execute('SELECT DISTINCT course_id FROM course_stops')]
    previous_cid, group, fixed, uncertain = None, [], 0, 0

    def flush(cid, group):
        nonlocal fixed, uncertain
        if not group:
            return
        base = clock_seconds(departures.get(cid))
        parsed = []
        for seq, arr, dep in group:
            t = clock_seconds(arr) if clock_seconds(arr) is not None else clock_seconds(dep)
            if t is None:
                uncertain += 1
                return  # No reliable chronology: preserve source sequence.
            if base is not None and t < base:
                t += ((base - t + 86399) // 86400) * 86400
            parsed.append((t, seq))
        ordered = [seq for _, seq in sorted(parsed)]
        if ordered == [seq for seq, _, _ in group]:
            return
        # Two-phase update avoids PRIMARY KEY(course_id,seq) collisions.
        conn.executemany('UPDATE course_stops SET seq=? WHERE course_id=? AND seq=?',
                         [(-i, cid, seq) for i, seq in enumerate(ordered, 1)])
        conn.executemany('UPDATE course_stops SET seq=? WHERE course_id=? AND seq=?',
                         [(i, cid, -i) for i in range(1, len(ordered)+1)])
        fixed += 1

    for cid in course_ids:
        group = conn.execute('SELECT seq,arrival,departure FROM course_stops WHERE course_id=? ORDER BY seq', (cid,)).fetchall()
        flush(cid, group)
    conn.execute('INSERT OR REPLACE INTO metadata VALUES (?,?)', ('stop_order_method','time_sorted_v56'))
    conn.execute('INSERT OR REPLACE INTO metadata VALUES (?,?)', ('stop_order_reordered_courses',str(fixed)))
    conn.execute('INSERT OR REPLACE INTO metadata VALUES (?,?)', ('stop_order_uncertain_courses',str(uncertain)))
    print(f'Stop ordering: reordered={fixed}, uncertain={uncertain}', flush=True)


def run(zip_path, target):
    if not zipfile.is_zipfile(zip_path):
        sys.exit('ERROR: invalid ZIP file')
    os.makedirs(os.path.dirname(os.path.abspath(target)), exist_ok=True)
    temp = target + '.tmp'
    if os.path.exists(temp):
        os.unlink(temp)
    started = time.monotonic()
    conn = sqlite3.connect(temp)
    try:
        conn.executescript('''
            PRAGMA journal_mode=DELETE;
            PRAGMA synchronous=NORMAL;
            CREATE TABLE metadata (key TEXT PRIMARY KEY, value TEXT);
            CREATE TABLE eta_rows (section TEXT NOT NULL, rowid_section INTEGER NOT NULL,
                payload TEXT NOT NULL, PRIMARY KEY(section,rowid_section));
            CREATE TABLE course_stops (course_id TEXT NOT NULL, seq INTEGER NOT NULL,
                stop_id TEXT, arrival TEXT, departure TEXT, payload TEXT,
                PRIMARY KEY(course_id,seq));
            CREATE TABLE courses (course_id TEXT PRIMARY KEY, task_id TEXT,
                schedule_id TEXT, brigade TEXT, departure TEXT, payload TEXT);
            CREATE TABLE tasks (task_id TEXT PRIMARY KEY, line_id TEXT, payload TEXT);
            CREATE TABLE boards (schedule_id TEXT PRIMARY KEY, line_name TEXT,
                valid_from TEXT, valid_to TEXT, payload TEXT);
            CREATE INDEX ix_course_stops_stop ON course_stops(stop_id);
            CREATE INDEX ix_courses_task ON courses(task_id);
            CREATE INDEX ix_courses_brigade ON courses(brigade);
            CREATE INDEX ix_boards_line ON boards(line_name);
        ''')
        with zipfile.ZipFile(zip_path) as archive:
            members = [name for name in archive.namelist() if name.lower().endswith('.json')]
            if len(members) != 1:
                raise ValueError('Expected exactly one JSON member')
            member = members[0]
            keys, meta = section_keys(archive, member)
            print('JSON sections:', ', '.join(keys), flush=True)
            available = {norm(k): k for k in keys}
            for k, v in meta.items():
                conn.execute('INSERT INTO metadata VALUES (?,?)', (k, v))
            conn.commit()
            counts = {}
            for section in SECTIONS:
                real_key = available.get(norm(section))
                if real_key is None:
                    print(f'{section}: NOT PRESENT', flush=True)
                    counts[section] = 0
                    continue
                count = 0
                seq_by_course = {}
                with archive.open(member) as stream:
                    for item in ijson.items(stream, real_key + '.item', use_float=True):
                        if not isinstance(item, dict):
                            continue
                        count += 1
                        raw = json.dumps(item, ensure_ascii=False, separators=(',', ':'))
                        conn.execute('INSERT INTO eta_rows VALUES (?,?,?)', (section, count, raw))
                        if section == 'rozkłady_jazdy':
                            cid = field(item, 'id_kursu')
                            if cid:
                                conn.execute('INSERT OR REPLACE INTO courses VALUES (?,?,?,?,?,?)',
                                    (cid, field(item, 'id_zadania'), field(item, 'id_rozkładu'),
                                     field(item, 'brygada_kursu'),
                                     field(item, 'czas_odjazdu_z_pętli', 'czas_odjazdu_z_petli'), raw))
                        elif section == 'kursy_przejazdy':
                            cid = field(item, 'id_kursu')
                            if cid:
                                seq = seq_by_course.get(cid, 0) + 1
                                seq_by_course[cid] = seq
                                conn.execute('INSERT INTO course_stops VALUES (?,?,?,?,?,?)',
                                    (cid, seq, field(item, 'id_slupka'),
                                     field(item, 'czas_przyjazdu_na_slupek'),
                                     field(item, 'czas_odjazdu_ze_slupka'), raw))
                        elif section == 'zadania':
                            tid = field(item, 'id_zadania')
                            if tid:
                                conn.execute('INSERT OR REPLACE INTO tasks VALUES (?,?,?)',
                                    (tid, field(item, 'id_linii_zadania'), raw))
                        elif section == 'tabliczki':
                            sid = field(item, 'id_rozkładu')
                            if sid:
                                conn.execute('INSERT OR REPLACE INTO boards VALUES (?,?,?,?,?)',
                                    (sid, field(item, 'nazwa_linii'),
                                     field(item, 'rozkład_ważny_od'), field(item, 'rozkład_ważny_do'), raw))
                        if count % 5000 == 0:
                            conn.commit()
                conn.execute('INSERT OR REPLACE INTO metadata VALUES (?,?)', ('count_' + norm(section), str(count)))
                conn.commit()
                counts[section] = count
                print(f'{section}: {count}', flush=True)
        reorder_course_stops(conn)
        course_count = conn.execute('SELECT COUNT(*) FROM courses').fetchone()[0]
        if not counts.get('rozkłady_jazdy') or not course_count:
            raise RuntimeError('No courses imported: existing database NOT replaced')
        conn.execute('INSERT OR REPLACE INTO metadata VALUES (?,?)',
                     ('imported_utc', dt.datetime.now(dt.timezone.utc).isoformat()))
        conn.commit()
        if conn.execute('PRAGMA quick_check').fetchone()[0] != 'ok':
            raise RuntimeError('SQLite quick_check failed')
        conn.close()
        os.replace(temp, target)
        print(f'OK: courses={course_count}, database={target}, '
              f'{os.path.getsize(target)/1048576:.1f} MiB, {time.monotonic()-started:.0f}s', flush=True)
    except Exception:
        conn.close()
        if os.path.exists(temp):
            os.unlink(temp)
        raise


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('zip_file')
    parser.add_argument('database')
    args = parser.parse_args()
    run(args.zip_file, args.database)
