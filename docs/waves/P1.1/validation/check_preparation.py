"""Read-only preparation data checks. Never builds, installs or executes the product."""
from pathlib import Path
import hashlib,json,re,subprocess,xml.etree.ElementTree as ET
from urllib.parse import unquote
ROOT=Path(__file__).resolve().parents[4]
WAVE=ROOT/"docs/waves/P1.1"
BASE="e485792839d6c3af1a6587a8964f983250366b39"
def text(p):return p.read_text(encoding="utf-8-sig")
def field(s,k):
 m=re.search(r"^- "+re.escape(k)+r": (.+)$",s,re.M);assert m,k;return m.group(1)
def main():
 s=json.loads(text(WAVE/"state.json"))
 assert s["waveId"]=="P1.1" and s["specVersion"]=="P1.1-1.0.0"
 assert s["executionAuthorized"] is False and s["activeDevelopmentAgents"]==[]
 for k in ["productionAssetsChanged","dependenciesInstalled","workflowModified","accountSettingsChanged","mailRulesApplied","applicationRestarted"]:assert s[k] is False,k
 assert s["aestheticGate"]==s["comfortGate"]=="not_run"
 assert s["userConfirmedMailScope"]=="repository_only_optional_mailbox_rule"
 tasks={p.stem:text(p) for p in (WAVE/"tasks").glob("*.md")}
 assert len(tasks)==9 and set(tasks)=={t["taskId"] for t in s["tasks"]}
 req=set(re.findall(r"P11-[A-Z]+-\d{2}",text(ROOT/"specs/p1.1/requirements.md")));assert len(req)==9
 graph={}
 state_tasks={t["taskId"]:t for t in s["tasks"]}
 for tid,body in tasks.items():
  assert field(body,"taskId")==field(body,"rootTaskId")==tid
  assert field(body,"status")=="prepared_not_dispatched"
  assert field(body,"baseCommit")==BASE and field(body,"specVersion")==s["specVersion"]
  assert field(body,"actualModel")=="null" and field(body,"requestedModel")=="inherit_current_session"
  assert set(re.findall(r"P11-[A-Z]+-\d{2}",field(body,"requirementIds")))<=req
  deps=[]
  for key in ["dependencies","runtimeDependencies"]:
   value=field(body,key);parsed=[] if value=="none" else value.split(", ")
   assert parsed==state_tasks[tid][key],(tid,key)
   deps+=parsed
  graph[tid]=set(deps);assert graph[tid]<=tasks.keys()
 seen=set()
 def visit(tid,pending):
  assert tid not in pending,("cycle",tid)
  if tid in seen:return
  for dep in graph[tid]:visit(dep,pending|{tid})
  seen.add(tid)
 for tid in graph:visit(tid,set())
 manifest=json.loads(text(WAVE/"references/manifest.json"))
 for a in manifest["assets"]:
  data=(WAVE/"references"/a["file"]).read_bytes()
  assert len(data)==a["bytes"] and hashlib.sha256(data).hexdigest()==a["sha256"]
  assert a["productionDerivativeStatus"]=="not_created"
 assert manifest["assets"][0]["metadataPublicDomain"] is True
 audit=json.loads(text(WAVE/"references/reactbits-audit.json"))
 assert len(audit["components"])==3 and audit["installPerformed"] is False
 assert sum(len(c["files"]) for c in audit["components"])==6
 license=(ROOT/audit["existingLicenseReference"]).read_bytes().replace(b"\r\n",b"\n")
 assert hashlib.sha256(license).hexdigest()==audit["licenseSha256"]
 assert (WAVE/"references/direction-board.png").read_bytes()[:8]==b"\x89PNG\r\n\x1a\n"
 ET.parse(WAVE/"references/direction-board.svg")
 docs=list(WAVE.rglob("*.md"))+list((ROOT/"specs/p1.1").glob("*.md"))+[ROOT/p for p in ["AGENTS.md","CONSTITUTION.md","README.md","NEXT-WAVES.md","docs/README.md","docs/waves/README.md","docs/agents/README.md","docs/decisions/0010-p11-preparation.md"]]
 links=0
 for doc in docs:
  for target in re.findall(r"\[[^\]]*\]\(([^)]+)\)",text(doc)):
   target=target.strip("<>").split("#",1)[0]
   if not target or re.match(r"[a-zA-Z]+:",target):continue
   assert (doc.parent/unquote(target)).exists(),(doc,target);links+=1
 product=["frontend","backend","tests","assets",".github","compose.yaml","compose.test.yaml","specs/api.yaml","specs/frontend-state.md","docs/waves/P0","docs/waves/P1"]
 subprocess.run(["git","diff","--exit-code",BASE,"--",*product],cwd=ROOT,check=True,capture_output=True)
 untracked=subprocess.check_output(["git","ls-files","--others","--exclude-standard"],cwd=ROOT,text=True)
 assert not any(p.startswith(("frontend/","backend/","tests/","assets/",".github/")) for p in untracked.splitlines())
 frozen=WAVE/"validation/preparation-files.json"
 if frozen.exists():
  for f in json.loads(text(frozen))["files"]:
   p=ROOT/f["path"];data=p.read_bytes()
   if p.suffix in [".md",".json",".svg",".py"]:data=data.replace(b"\r\n",b"\n")
   assert hashlib.sha256(data).hexdigest()==f["sha256"],f["path"]
 print(json.dumps({"result":"pass","phase":"preparation_only","executionAuthorized":False,"tasks":len(tasks),"requirements":len(req),"taskGraph":"acyclic","references":len(manifest["assets"]),"candidateSourceFiles":6,"relativeLinks":links,"svgAndPng":"valid","productUnchangedFrom":BASE,"runtimeChecks":"not_run_for_P1.1","mailChangesApplied":False},ensure_ascii=False,indent=2))
if __name__=="__main__":main()
