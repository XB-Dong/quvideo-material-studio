"""ZIP structure and optional exact Git-blob verification, without executing source."""
import argparse
import fnmatch
import hashlib
import json
import re
import stat
import zipfile
from datetime import datetime, timezone
from pathlib import Path, PurePosixPath

PROTECTED_PREFIXES = ('frontend/', 'backend/', 'tests/', '.github/', 'assets/')
ROOT_ENTRIES = {'README.md', 'compose.yaml', 'compose.test.yaml', '.env.example',
                '.gitattributes', '.gitignore', 'LICENSE', 'THIRD-PARTY-NOTICES.md'}
POLICY_PATH = 'docs/submission/package-policy.json'


def blob_oid(data):
    return hashlib.sha1(b'blob ' + str(len(data)).encode() + b'\0' + data).hexdigest()


def private_document(name):
    p = PurePosixPath(name)
    if name in {'AGENTS.md', 'CONSTITUTION.md', 'NEXT-WAVES.md'}:
        return True
    if name.startswith(('docs/agents/', 'docs/requirements/', 'docs/reports/')):
        return True
    if name.startswith('docs/waves/'):
        return (bool(set(p.parts) & {'handoffs', 'reviews', 'tasks', 'validation'})
                or p.name in {'PLAN.md', 'ROLES.md', 'CONTEXT-MAP.md', 'state.json'}
                or p.name.startswith('user-') and p.suffix.lower() in {'.png', '.jpg', '.jpeg'})
    return False


def excluded(name, policy):
    return (name in policy.get('exactPrivateWaveDocumentExclusions', [])
            or any(fnmatch.fnmatchcase(name, pattern)
                   for pattern in policy.get('excludeRootDocs', [])))


def verify(archive, source_sha, source_index=None):
    archive = Path(archive)
    assert re.fullmatch(r'[a-f0-9]{40}', source_sha), 'Exact candidate source required'
    checks, entries = [], []

    def check(name, passed, details):
        checks.append({'name': name, 'pass': bool(passed), 'details': details})

    check('attachment under100MB', archive.stat().st_size < 100_000_000,
          {'bytes': archive.stat().st_size})
    with zipfile.ZipFile(archive) as z:
        names = [i.filename for i in z.infolist()]
        check('git ZIP comment equals declared source commit', z.comment == source_sha.encode(),
              {'commentBytes': len(z.comment), 'matchesSource': z.comment == source_sha.encode()})
        check('no duplicate or case-colliding paths', len(names) == len(set(n.casefold() for n in names)), {})
        unsafe, forbidden, secrets, private = [], [], [], []
        contents = {}
        for info in z.infolist():
            p = PurePosixPath(info.filename)
            if (p.is_absolute() or '..' in p.parts or '\\' in info.filename
                    or re.match(r'^[A-Za-z]:', info.filename)
                    or stat.S_ISLNK(info.external_attr >> 16)):
                unsafe.append(info.filename)
            if (set(p.parts) & {'.git', 'node_modules', '.next', 'target', 'runtime', 'mysql-data', '__pycache__'}
                    or p.name == '.env' or 'storage-state' in p.name):
                forbidden.append(info.filename)
            if info.is_dir():
                continue
            data = z.read(info)
            contents[info.filename] = data
            entries.append({'path': info.filename, 'bytes': len(data),
                            'sha256': hashlib.sha256(data).hexdigest(), 'gitBlobOid': blob_oid(data)})
            if private_document(info.filename):
                private.append(info.filename)
            if p.suffix in {'.md', '.json', '.yaml', '.yml', '.env', '.ts', '.tsx', '.java', '.properties'}:
                if re.search(rb'-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|ghp_[A-Za-z0-9]{36}|github_pat_[A-Za-z0-9_]{60,}', data):
                    secrets.append(info.filename)  # No matched secret text in output.
        check('safe archive paths, regular files', not unsafe, unsafe)
        check('no dependencies, credentials, cookie state or runtime volumes', not forbidden, forbidden)
        check('no recognized private keys or GitHub tokens', not secrets, secrets)
        check('no private coordination, official reference or user report files', not private, private)
        policy = json.loads(contents.get(POLICY_PATH, b'{}'))
        check('declared flat-root package policy included', policy.get('format') == 'git-archive-zip-flat-root', {})
        check('policy exclusions absent from ZIP', not any(excluded(n, policy) for n in contents),
              sorted(n for n in contents if excluded(n, policy)))
        required = ROOT_ENTRIES | {POLICY_PATH, '.github/workflows/ci.yml', 'frontend/package.json',
                    'frontend/package-lock.json', 'frontend/Dockerfile', 'backend/pom.xml', 'backend/Dockerfile',
                    'frontend/src/components/react-bits/LICENSE.md', 'docs/assets/provenance.json',
                    'backend/src/main/resources/db/migration/V4__accounts.sql'}
        missing = sorted(required - set(contents))
        check('complete runtime, lock, CI, license and provenance entrypoints', not missing, missing)
        check('local demo, ink and original migrations retained',
              any(n.startswith('backend/src/main/resources/demo/') for n in contents)
              and any(n.startswith('frontend/public/ink/') for n in contents)
              and all(any(n.startswith('backend/src/main/resources/db/migration/V' + str(v) + '__')
                          for n in contents) for v in [1, 2, 3]), {})
        reproduction = policy.get('historicalWaveInputAllowlist', [])
        check('declared asset reproduction inputs retained', not(set(reproduction) - set(contents)),
              sorted(set(reproduction) - set(contents)))
        provenance = json.loads(contents.get('docs/assets/provenance.json', b'{}'))
        check('curated provenance has no cachePath or local Windows path',
              not re.search(r'"cachePath"|(?<![A-Za-z0-9])[A-Za-z]:[\\/]', json.dumps(provenance)), {})

        if source_index is not None:
            index = json.loads(Path(source_index).read_text(encoding='utf8'))
            check('independent Git tree index is bound to declared commit',
                  index.get('sourceCommit') == source_sha and index.get('objectFormat', 'sha1') == 'sha1', {})
            files = [{**f, 'blobOid': f.get('blobOid', f.get('oid'))}
                     for f in index.get('files', index.get('entries', []))]
            check('tree index has unique regular blobs', bool(files)
                  and len(files) == len({f['path'] for f in files})
                  and all(f.get('type', 'blob') == 'blob' and f.get('mode', '100644') in {'100644', '100755'}
                          and re.fullmatch(r'[a-f0-9]{40}', f['blobOid']) for f in files), {})
            source = {f['path']: f['blobOid'] for f in files}
            protected = {n for n in source if n.startswith(PROTECTED_PREFIXES) or n in ROOT_ENTRIES
                         or n in reproduction}
            check('policy never excludes product, tests, assets or root entrypoints',
                  not any(excluded(n, policy) for n in protected),
                  sorted(n for n in protected if excluded(n, policy)))
            expected = {n for n in source if not excluded(n, policy)}
            check('all expected source files exported, no untracked additions',
                  expected == set(contents), {'missing': sorted(expected - set(contents)),
                                              'unexpected': sorted(set(contents) - expected)})
            mismatches = [e['path'] for e in entries if e['path'] in source and e['gitBlobOid'] != source[e['path']]]
            check('every exported byte matches exact committed Git blob', not mismatches, mismatches)
    return {'sourceCommit': source_sha, 'archive': archive.name, 'archiveBytes': archive.stat().st_size,
            'archiveSha256': hashlib.sha256(archive.read_bytes()).hexdigest(),
            'verifierSha256': hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),
            'capturedAt': datetime.now(timezone.utc).isoformat(),
            'completeSourceComparedToGit': source_index is not None,
            'scope': 'ZIP structure and optional exact committed blob comparison only. No Compose/runtime, full-history or legal audit claim. Early candidate may omit final GIF/report; final executable equivalence separate.',
            'checks': checks, 'entries': entries}


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--archive', required=True)
    parser.add_argument('--source-sha', required=True)
    parser.add_argument('--source-tree-index')
    parser.add_argument('--output', required=True)
    args = parser.parse_args()
    report = verify(args.archive, args.source_sha, args.source_tree_index)
    Path(args.output).write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf8')
    passed = all(c['pass'] for c in report['checks'])
    print(json.dumps({'pass': passed, 'files': len(report['entries']),
                      'failed': [c['name'] for c in report['checks'] if not c['pass']]}))
    raise SystemExit(0 if passed else 1)
