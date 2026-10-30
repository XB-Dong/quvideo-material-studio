"""Independent ZIP metadata/content checks, run with the existing Python test image.

Does not execute project files or extract unsafe entries. The later actual clean-room
Compose run is a separate mandatory gate; this checker cannot claim it passed.
"""
import argparse
import hashlib
import json
import re
import stat
import zipfile
from datetime import datetime, timezone
from pathlib import Path, PurePosixPath

parser = argparse.ArgumentParser()
parser.add_argument('--archive', required=True)
parser.add_argument('--source-sha', required=True)
parser.add_argument('--output', required=True)
args = parser.parse_args()
assert re.fullmatch(r'[a-f0-9]{40}', args.source_sha), 'Exact candidate source required'
archive = Path(args.archive)
checks, entries = [], []

def check(name, passed, details):
    checks.append({'name': name, 'pass': bool(passed), 'details': details})

check('attachment under100MB', archive.stat().st_size < 100_000_000, {'bytes': archive.stat().st_size})
with zipfile.ZipFile(archive) as z:
    names = [item.filename for item in z.infolist()]
    check('no duplicate or case-colliding paths', len(names) == len(set(n.casefold() for n in names)), {})
    unsafe, forbidden, secrets = [], [], []
    for info in z.infolist():
        path = PurePosixPath(info.filename)
        if path.is_absolute() or '..' in path.parts or '\\' in info.filename or re.match(r'^[A-Za-z]:', info.filename) or stat.S_ISLNK(info.external_attr >> 16):
            unsafe.append(info.filename)
        if any(p in {'.git', 'node_modules', '.next', 'target', 'runtime', 'mysql-data', '__pycache__'} for p in path.parts) or path.name == '.env' or 'storage-state' in path.name:
            forbidden.append(info.filename)
        if info.is_dir():
            continue
        data = z.read(info)
        entries.append({'path': info.filename, 'bytes': len(data), 'sha256': hashlib.sha256(data).hexdigest()})
        if path.suffix in {'.md', '.json', '.yaml', '.yml', '.env', '.ts', '.tsx', '.java', '.properties'}:
            if re.search(rb'-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|ghp_[A-Za-z0-9]{36}|github_pat_[A-Za-z0-9_]{60,}', data):
                secrets.append(info.filename)  # Never print matching secret text.
    check('safe archive paths, regular files', not unsafe, unsafe)
    check('no dependencies, credentials, cookie state or runtime volumes', not forbidden, forbidden)
    check('no recognized private keys or GitHub tokens', not secrets, secrets)
    required = ['README.md', 'compose.yaml', 'compose.test.yaml', '.env.example', '.github/workflows/ci.yml', 'frontend/package.json', 'frontend/package-lock.json', 'frontend/Dockerfile', 'backend/pom.xml', 'backend/Dockerfile', 'backend/src/main/resources/db/migration/V4__accounts.sql']
    missing = [name for name in required if name not in names]
    check('complete source/locks/CI/Compose/account migration entrypoints', not missing, missing)
    check('local demo resources and original migrations retained', any(n.startswith('backend/src/main/resources/demo/') for n in names) and all(any(n.startswith('backend/src/main/resources/db/migration/V'+str(v)+'__') for n in names) for v in [1, 2, 3]), {})

report = {'sourceCommit': args.source_sha, 'archive': archive.name, 'archiveBytes': archive.stat().st_size, 'archiveSha256': hashlib.sha256(archive.read_bytes()).hexdigest(), 'capturedAt': datetime.now(timezone.utc).isoformat(), 'scope': 'Independent ZIP structure/hash scan only; not a Compose/runtime/source-rights or full-history audit. Early candidate may omit final GIF/report; final seal checks equivalence separately.', 'checks': checks, 'entries': entries}
Path(args.output).write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf8')
print(json.dumps({'pass': all(c['pass'] for c in checks), 'files': len(entries), 'failed': [c['name'] for c in checks if not c['pass']]}))
raise SystemExit(0 if all(c['pass'] for c in checks) else 1)
