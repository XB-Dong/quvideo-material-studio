"""Read-only P1 preparation checks; Python standard library + Git, no product execution."""
from pathlib import Path
import hashlib
import json
import re
import subprocess
import xml.etree.ElementTree as ET
from urllib.parse import unquote

ROOT = Path(__file__).resolve().parents[4]
WAVE = ROOT / "docs/waves/P1"
BASE = "07300db74eefe5d8d1ecf979de314450bf5f2a78"

def field(text, name):
    match = re.search(r"^- " + re.escape(name) + r": (.+)$", text, re.M)
    assert match, name
    return match.group(1)

def main():
    state = json.loads((WAVE / "state.json").read_text(encoding="utf-8"))
    assert state["specVersion"] == "P1-1.2.0"
    assert state["executionAuthorized"] is False
    assert state["activeDevelopmentAgents"] == []
    assert state["motionInstalled"] is False and state["productionAssetsChanged"] is False
    assert state["aestheticGate"] == state["comfortGate"] == "not_run"
    tasks = {p.stem: p.read_text(encoding="utf-8") for p in (WAVE / "tasks").glob("*.md")}
    assert len(tasks) == 9 and set(tasks) == {t["taskId"] for t in state["tasks"]}
    requirements = set(re.findall(r"P1-[A-Z]+-\d{2}", (ROOT / "specs/p1/requirements.md").read_text(encoding="utf-8")))
    graph = {}
    for name, text in tasks.items():
        assert field(text, "taskId") == field(text, "rootTaskId") == name
        assert field(text, "specVersion") == "P1-1.2.0"
        assert field(text, "baseCommit") == BASE
        assert field(text, "status") == "prepared_not_dispatched"
        assert field(text, "requestedModel") == "inherit_current_session"
        assert field(text, "actualModel") == "null"
        assert set(re.findall(r"P1-[A-Z]+-\d{2}", field(text, "requirementIds"))) <= requirements
        graph[name] = set(re.findall(r"P1-[A-Z]+", field(text, "dependencies")))
        if "runtimeDependencies" in text:
            graph[name] |= set(re.findall(r"P1-[A-Z]+", field(text, "runtimeDependencies")))
        assert graph[name] <= tasks.keys(), (name, graph[name])
        assert "specs/p1/react-bits.md" in text
    seen = set()
    def walk(name, pending):
        assert name not in pending, ("dependency cycle", name)
        if name in seen:
            return
        for dep in graph[name]: walk(dep, pending | {name})
        seen.add(name)
    for name in tasks: walk(name, set())
    manifest = json.loads((WAVE / "references/manifest.json").read_text(encoding="utf-8"))
    assert len(manifest["assets"]) == 4
    for item in manifest["assets"]:
        data = (WAVE / "references" / item["file"]).read_bytes()
        assert len(data) == item["bytes"]
        assert hashlib.sha256(data).hexdigest() == item["sha256"]
        assert data[:2] == b"\xff\xd8" and data[-2:] == b"\xff\xd9"
        assert item["author"] and item["sourceUrl"].startswith("https://unsplash.com/photos/")
        assert item["productionDerivativeStatus"] == "not_created"
    audit = json.loads((WAVE / "references/reactbits-audit.json").read_text(encoding="utf-8"))
    assert len(audit["components"]) == 7
    assert sum(len(c["files"]) for c in audit["components"]) == 14
    assert audit["oglCandidate"]["license"] == "Unlicense"
    contrast = json.loads((WAVE / "references/contrast-check.json").read_text(encoding="utf-8"))
    def luminance(color):
        srgb = [int(color[i:i+2], 16) / 255 for i in (1, 3, 5)]
        linear = [c / 12.92 if c <= .04045 else ((c + .055) / 1.055) ** 2.4 for c in srgb]
        return sum(c * w for c, w in zip(linear, [.2126, .7152, .0722]))
    for pair in contrast["checks"]:
        low, high = sorted([luminance(pair["foreground"]), luminance(pair["background"])])
        ratio = (high + .05) / (low + .05)
        assert abs(ratio - pair["ratio"]) < 1e-8 and ratio >= pair["threshold"]
    assert (WAVE / "references/direction-board.png").read_bytes()[:8] == b"\x89PNG\r\n\x1a\n"
    for svg in (WAVE / "references").glob("*.svg"): ET.parse(svg)
    docs = list(WAVE.rglob("*.md")) + list((ROOT / "specs/p1").glob("*.md"))
    docs += [ROOT / n for n in ["README.md", "NEXT-WAVES.md", "THIRD-PARTY-NOTICES.md", "docs/decisions/0006-p1-preparation.md", "docs/decisions/0007-p1-react-bits.md", "docs/README.md", "docs/waves/README.md", "docs/agents/README.md"]]
    for doc in docs:
        text = re.sub(r"```.*?```", "", doc.read_text(encoding="utf-8"), flags=re.S)
        for target in re.findall(r"\[[^\]]*\]\(([^)]+)\)", text):
            target = target.strip("<>").split("#", 1)[0]
            if not target or re.match(r"[a-z]+:", target): continue
            assert (doc.parent / unquote(target)).exists(), (doc.relative_to(ROOT), target)
    frozen = json.loads((WAVE / "validation/preparation-files.json").read_text(encoding="utf-8"))
    for item in frozen["files"]:
        path = ROOT / item["path"]
        data = path.read_bytes()
        if path.suffix in {".md", ".json", ".svg"}: data = data.replace(b"\r\n", b"\n")
        assert hashlib.sha256(data).hexdigest() == item["sha256"], item["path"]
    product_paths = ["frontend", "backend", "tests", "compose.yaml", "compose.test.yaml", ".github/workflows/ci.yml", "specs/api.yaml", "specs/frontend-state.md", "docs/waves/P0"]
    subprocess.run(["git", "diff", "--exit-code", BASE, "--", *product_paths], cwd=ROOT, check=True, capture_output=True)
    untracked = subprocess.check_output(["git", "ls-files", "--others", "--exclude-standard"], cwd=ROOT, text=True)
    assert not any(p.startswith(("frontend/", "backend/", "tests/", ".github/")) for p in untracked.splitlines())
    print(json.dumps({"result":"pass","specVersion":"P1-1.2.0","preparedTasks":len(tasks),"requirements":len(requirements),"candidateAssets":4,"reactBitsComponents":7,"registryFiles":14,"contrastPairs":len(contrast["checks"]),"dependencyGraph":"acyclic","relativeLinks":"valid","svgXML":"valid","productUnchangedFrom":BASE,"runtimeChecks":"not_run_for_P1","executionAuthorized":False}, ensure_ascii=False, indent=2))

if __name__ == "__main__": main()
