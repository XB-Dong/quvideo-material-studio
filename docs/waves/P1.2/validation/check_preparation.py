"""Data-only P1.2 preparation check. No product build/install/runtime."""
from pathlib import Path
import json,re,hashlib,subprocess,xml.etree.ElementTree as ET
from urllib.parse import unquote
ROOT=Path(__file__).resolve().parents[4]; WAVE=ROOT/"docs/waves/P1.2"
def read(p):return p.read_text(encoding="utf-8-sig")
def field(s,k):
 m=re.search(r"^- "+re.escape(k)+r": (.+)$",s,re.M);assert m,k;return m.group(1)
def main():
 s=json.loads(read(WAVE/"state.json"));assert s["waveId"]=="P1.2" and s["specVersion"]=="P1.2-1.0.0"
 assert s["executionAuthorized"] is False and s["executionStartedAt"] is None
 assert s["activeDevelopmentAgents"]==[]
 for k in ["productImplemented","dependenciesInstalledForP12","productRestartedForP12","developmentWorktreesCreatedForP12"]:assert s[k] is False,k
 assert s["aestheticGate"]==s["comfortGate"]=="not_run"
 assert s["p11CIPrerequisite"]=="passed_exact_verified_source"
 ci=json.loads(read(ROOT/"docs/waves/P1.1/evidence/remote-ci-a7cdcdf.json"));assert ci["headRevision"]==s["p11VerifiedCommit"] and ci["conclusion"]=="success" and len(ci["jobs"])==3 and all(j["conclusion"]=="success" for j in ci["jobs"])
 tasks={p.stem:read(p) for p in (WAVE/"tasks").glob("*.md")};state={t["taskId"]:t for t in s["tasks"]};assert len(tasks)==9 and tasks.keys()==state.keys()
 req=set(re.findall(r"P12-[A-Z0-9]+-\d{2}",read(ROOT/"specs/p1.2/requirements.md")));assert len(req)==11;covered=set();graph={}
 for tid,body in tasks.items():
  t=state[tid];assert field(body,"taskId")==field(body,"rootTaskId")==tid
  assert field(body,"status")==t["status"]=="prepared_not_dispatched"
  assert field(body,"baseCommit")==t["baseCommit"]==s["preparationBaseCommit"]
  assert field(body,"specVersion")==s["specVersion"] and field(body,"actualModel")=="null"
  ids=set(field(body,"requirementIds").split(", "));assert ids<=req;covered|=ids;graph[tid]=set()
  for key in ["dependencies","runtimeDependencies"]:
   v=field(body,key);deps=[] if v=="none" else v.split(", ");assert deps==t[key];graph[tid]|=set(deps)
 assert covered==req
 done=set()
 def visit(tid,path):
  assert tid not in path,("cycle",tid)
  if tid in done:return
  for dep in graph[tid]:assert dep in tasks;visit(dep,path|{tid})
  done.add(tid)
 for tid in graph:visit(tid,set())
 audit=json.loads(read(WAVE/"references/reactbits-audit.json"));assert len(audit["components"])==2 and sum(len(c["files"]) for c in audit["components"])==3
 assert not audit["installPerformed"] and not audit["productionCodeCopied"]
 raw=(ROOT/audit["existingLicenseReference"]).read_bytes().replace(b"\r\n",b"\n");assert hashlib.sha256(raw).hexdigest()==audit["licenseSha256"]
 dep=json.loads(read(WAVE/"references/dependency-plan.json"));assert dep["runtimeDependenciesAdded"]==[] and not dep["installPerformed"] and not dep["lockModified"]
 assert {x["version"] for x in dep["plannedDevTypes"]}=={"19.3.0"}
 ET.parse(WAVE/"references/motion-storyboard.svg");assert (WAVE/"references/motion-storyboard.png").read_bytes()[:8]==b"\x89PNG\r\n\x1a\n"
 links=0
 docs=list(WAVE.rglob("*.md"))+list((ROOT/"specs/p1.2").glob("*.md"))+[ROOT/p for p in ["README.md","AGENTS.md","CONSTITUTION.md","NEXT-WAVES.md","docs/README.md","docs/waves/README.md"]]
 for p in docs:
  for target in re.findall(r"\[[^\]]*\]\(([^)]+)\)",read(p)):
   target=target.strip("<>").split("#",1)[0]
   if not target or re.match(r"[a-zA-Z]+:",target):continue
   assert (p.parent/unquote(target)).exists(),(str(p),target);links+=1
 subprocess.run(["git","diff","--exit-code",s["preparationBaseCommit"],"--","frontend","backend","tests","assets",".github","compose.yaml","compose.test.yaml"],cwd=ROOT,check=True,capture_output=True)
 untracked=subprocess.check_output(["git","ls-files","--others","--exclude-standard"],cwd=ROOT,text=True);assert not any(p.startswith(("frontend/","backend/","tests/","assets/",".github/")) for p in untracked.splitlines())
 frozen=WAVE/"validation/preparation-files.json"
 if frozen.exists():
  for f in json.loads(read(frozen))["files"]:
   p=ROOT/f["path"];data=p.read_bytes()
   if p.suffix in [".md",".json",".svg",".py"]:data=data.replace(b"\r\n",b"\n")
   assert hashlib.sha256(data).hexdigest()==f["sha256"],f["path"]
 print(json.dumps({"result":"pass","phase":"P1.2_preparation_only","executionAuthorized":False,"requirements":len(req),"tasks":len(tasks),"graph":"acyclic","relativeLinks":links,"registryComponents":2,"candidateSourceFiles":3,"svgAndPng":"valid","p11CI":"passed_at_exact_source","productUnchangedFrom":s["preparationBaseCommit"],"p12Runtime":"not_run"},ensure_ascii=False,indent=2))
if __name__=="__main__":main()
