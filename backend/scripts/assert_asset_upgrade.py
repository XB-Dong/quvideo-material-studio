"""Container-only synthetic upgrade checks; state with test cookies stays under ignored runtime/."""

import sys, os, json, time, hashlib, http.cookiejar
from pathlib import Path

sys.dont_write_bytecode = True
sys.path.insert(0, "/workspace/tests")
from test_api import Client, sample_png

state_path = Path("/workspace/runtime/p1-assets-state.json")
report_path = Path("/workspace/docs/waves/P1/evidence/assets/upgrade-observations.json")
mode = sys.argv[1]


def upload(c):
    boundary = "p1assetboundary"
    image = sample_png()
    data = (
        f'--{boundary}\r\nContent-Disposition: form-data; name="templateId"\r\n\r\ndemo-pet\r\n--{boundary}\r\nContent-Disposition: form-data; name="file"; filename="pet.png"\r\nContent-Type: image/png\r\n\r\n'.encode()
        + image
        + f"\r\n--{boundary}--\r\n".encode()
    )
    code, a, _ = c.request(
        "POST", "/api/assets", data, "multipart/form-data; boundary=" + boundary
    )
    assert code == 201, (code, a)
    return a["id"]


def make(c):
    asset = upload(c)
    code, t, _ = c.request(
        "POST",
        "/api/tasks",
        dict(
            templateId="demo-pet",
            assetIds=[asset],
            simulation={"delayMs": {"assetCheck": 0, "generate": 0, "finalize": 0}},
        ),
    )
    assert code == 202, (code, t)
    for _ in range(150):
        _, task, _ = c.request("GET", "/api/tasks/" + t["id"])
        if task["status"] == "SUCCEEDED":
            break
        assert task["status"] != "FAILED", task
        time.sleep(0.1)
    assert task["status"] == "SUCCEEDED", task
    _, data, h = c.request("GET", task["resultUrl"])
    assert h["Content-Type"].startswith("image/png")
    return {
        "taskId": task["id"],
        "resultUrl": task["resultUrl"],
        "sha256": hashlib.sha256(data).hexdigest(),
    }


c = Client()
if mode == "p0":
    c.session()
    state = make(c)
    state["cookies"] = [
        {"name": x.name, "value": x.value, "domain": x.domain, "path": x.path}
        for x in c.cookies
    ]
    state_path.parent.mkdir(parents=True, exist_ok=True)
    state_path.write_text(json.dumps(state))
else:
    state = json.loads(state_path.read_text())
    for x in state["cookies"]:
        c.cookies.set_cookie(
            http.cookiejar.Cookie(
                0,
                x["name"],
                x["value"],
                None,
                False,
                x["domain"],
                False,
                False,
                x["path"],
                True,
                False,
                None,
                True,
                None,
                None,
                {},
            )
        )
    code, t, _ = c.request("GET", "/api/tasks/" + state["taskId"])
    assert code == 200 and t["status"] == "SUCCEEDED", (code, t)
    _, data, _ = c.request("GET", state["resultUrl"])
    assert hashlib.sha256(data).hexdigest() == state["sha256"]
    stranger = Client()
    stranger.session()
    assert stranger.request("GET", state["resultUrl"])[0] == 404
code, templates, _ = c.request("GET", "/api/templates")
assert code == 200
p1 = mode in ["p1", "p1-again"]
for template in templates:
    url = template["coverUrl"]
    assert ("-p1-cover.jpg" in url) == p1, url
    code, data, h = c.request("GET", url)
    assert code == 200
    assert h["Content-Type"].startswith("image/jpeg" if p1 else "image/png")
if p1:
    new = make(c)
    assert new["sha256"] != state["sha256"]
    expected = hashlib.sha256(
        Path(
            "/workspace/backend/src/main/resources/demo/pet-p1-result.png"
        ).read_bytes()
    ).hexdigest()
    assert new["sha256"] == expected
report = json.loads(report_path.read_text()) if report_path.exists() else []
report.append(
    {
        "phase": mode,
        "historicalTaskId": state["taskId"],
        "historicalResultSha256": state["sha256"],
        "historicalOwnerPreserved": True,
        "foreignResultDenied": True if mode != "p0" else None,
        "templateCovers": [t["coverUrl"] for t in templates],
        "newResultMatchesP1Resource": p1,
        "checkedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    }
)
report_path.write_text(json.dumps(report, indent=2) + "\n")
print(json.dumps(report[-1]))
