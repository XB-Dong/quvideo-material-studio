"""Synthetic data-only unit checks; no application, Git or browser execution."""
import importlib.util
import json
import tempfile
import unittest
import zipfile
from pathlib import Path

spec = importlib.util.spec_from_file_location('archive_check', Path(__file__).with_name('verify-archive.py'))
checker = importlib.util.module_from_spec(spec)
spec.loader.exec_module(checker)
SHA = '1' * 40


class ArchiveChecks(unittest.TestCase):
    def fixture(self):
        policy = {'format': 'git-archive-zip-flat-root', 'excludeRootDocs': ['AGENTS.md'],
                  'exactPrivateWaveDocumentExclusions': ['docs/waves/P2/handoffs/private.md'],
                  'historicalWaveInputAllowlist': ['docs/waves/P1/references/assets/source.jpg']}
        names = checker.ROOT_ENTRIES | {
            checker.POLICY_PATH, '.github/workflows/ci.yml', 'frontend/package.json',
            'frontend/package-lock.json', 'frontend/Dockerfile', 'backend/pom.xml', 'backend/Dockerfile',
            'frontend/src/components/react-bits/LICENSE.md', 'docs/assets/provenance.json',
            'backend/src/main/resources/db/migration/V4__accounts.sql',
            'backend/src/main/resources/db/migration/V1__schema.sql',
            'backend/src/main/resources/db/migration/V2__seed.sql',
            'backend/src/main/resources/db/migration/V3__photos.sql',
            'backend/src/main/resources/demo/example.jpg', 'frontend/public/ink/landscape.webp',
            'assets/p1.1/prepare_ink.py', 'tests/test_api.py',
            'docs/waves/P1/references/assets/source.jpg', 'AGENTS.md', 'docs/waves/P2/handoffs/private.md'}
        files = {name: b'synthetic metadata fixture' for name in names}
        files[checker.POLICY_PATH] = json.dumps(policy).encode()
        files['docs/assets/provenance.json'] = b'{"sourceUrl":"https://example.test/photo"}'
        return files, {n: data for n, data in files.items() if not checker.excluded(n, policy)}

    def run_data(self, source, exported, comment=SHA, index_sha=SHA):
        with tempfile.TemporaryDirectory() as folder:
            archive = Path(folder) / 'source.zip'
            with zipfile.ZipFile(archive, 'w') as z:
                z.comment = comment.encode()
                for name, data in exported.items():
                    z.writestr(name, data)
            index = Path(folder) / 'tree.json'
            index.write_text(json.dumps({'sourceCommit': index_sha, 'files': [
                {'path': name, 'blobOid': checker.blob_oid(data), 'type': 'blob', 'mode': '100644'}
                for name, data in source.items()]}))
            return checker.verify(archive, SHA, index)

    def test_exact_source_with_private_exclusions_and_https_provenance_passes(self):
        result = self.run_data(*self.fixture())
        self.assertTrue(all(c['pass'] for c in result['checks']))

    def test_modified_exported_byte_fails_blob_comparison(self):
        source, exported = self.fixture()
        exported['tests/test_api.py'] += b'modified'
        r = self.run_data(source, exported)
        self.assertFalse(next(c for c in r['checks'] if c['name'].startswith('every exported'))['pass'])

    def test_missing_asset_fails_exact_completeness(self):
        source, exported = self.fixture()
        del exported['assets/p1.1/prepare_ink.py']
        r = self.run_data(source, exported)
        self.assertFalse(next(c for c in r['checks'] if c['name'].startswith('all expected'))['pass'])

    def test_private_file_cannot_be_added(self):
        source, exported = self.fixture()
        exported['docs/waves/P2/handoffs/private.md'] = source['docs/waves/P2/handoffs/private.md']
        r = self.run_data(source, exported)
        self.assertFalse(next(c for c in r['checks'] if c['name'].startswith('no private'))['pass'])

    def test_wrong_commit_comment_and_index_fail(self):
        r = self.run_data(*self.fixture(), comment='2' * 40, index_sha='3' * 40)
        self.assertFalse(next(c for c in r['checks'] if c['name'].startswith('git ZIP'))['pass'])
        self.assertFalse(next(c for c in r['checks'] if c['name'].startswith('independent Git'))['pass'])

    def test_explicit_entries_oid_schema_is_supported(self):
        source, exported = self.fixture()
        with tempfile.TemporaryDirectory() as folder:
            archive = Path(folder) / 'source.zip'
            with zipfile.ZipFile(archive, 'w') as z:
                z.comment = SHA.encode()
                for name, data in exported.items():
                    z.writestr(name, data)
            index = Path(folder) / 'tree.json'
            index.write_text(json.dumps({'sourceCommit': SHA, 'objectFormat': 'sha1', 'entries': [
                {'path': n, 'oid': checker.blob_oid(d), 'type': 'blob', 'mode': '100644'} for n, d in source.items()]}))
            self.assertTrue(all(c['pass'] for c in checker.verify(archive, SHA, index)['checks']))

    def test_policy_cannot_justify_excluding_tests(self):
        source, exported = self.fixture()
        policy = json.loads(source[checker.POLICY_PATH])
        policy['excludeRootDocs'].append('tests/**')
        source[checker.POLICY_PATH] = exported[checker.POLICY_PATH] = json.dumps(policy).encode()
        del exported['tests/test_api.py']
        r = self.run_data(source, exported)
        self.assertFalse(next(c for c in r['checks'] if c['name'].startswith('policy never'))['pass'])

    def test_curated_cache_path_fails_without_printing_value(self):
        source, exported = self.fixture()
        source['docs/assets/provenance.json'] = exported['docs/assets/provenance.json'] = b'{"cachePath":"C:/Users/private/cache"}'
        r = self.run_data(source, exported)
        self.assertFalse(next(c for c in r['checks'] if c['name'].startswith('curated provenance'))['pass'])


if __name__ == '__main__':
    unittest.main(verbosity=2)
