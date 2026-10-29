"""Restore only the mounted /data/materials snapshot in an isolated test container.

The caller must stop the backend and restore the matching MySQL/Flyway dump first.
Run with material-files mounted at /data/materials, snapshot volume at /snapshot.
"""
import os
import shutil
import tarfile
from pathlib import Path


def main():
    target = Path("/data/materials")
    archive_path = Path("/snapshot/files.tar.gz")
    if target.resolve() != target or not target.is_dir() or not archive_path.is_file():
        raise RuntimeError("Expected explicit mounted snapshot and material directory")
    # These are synthetic test files in the explicitly mounted test data directory.
    for child in target.iterdir():
        if child.is_dir() and not child.is_symlink():
            shutil.rmtree(child)
        else:
            child.unlink()
    with tarfile.open(archive_path) as archive:
        archive.extractall(target, filter="data")
    # The safe tar data filter strips owner IDs; Java runs as UID/GID10001.
    # Without this ownership restoration mode0600 results cannot be read by Java.
    for path in target.rglob("*"):
        if path.is_symlink():
            raise RuntimeError("Unexpected symlink in material snapshot")
        os.chown(path, 10001, 10001)
    os.chown(target, 10001, 10001)
    print("Material snapshot restored with backend ownership 10001:10001")


if __name__ == "__main__":
    main()
