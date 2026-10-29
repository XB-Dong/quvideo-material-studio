"""Independent, synthetic black-box acceptance against the deployed Java API.

Run inside the test container. No implementation imports, third-party dependencies,
real user data, credentials, or randomized failure modes are used.
"""

import hashlib
import http.cookiejar
import json
import os
import struct
import time
import unittest
import urllib.error
import urllib.parse
import urllib.request
import uuid
import zlib


BASE_URL = os.environ.get("BASE_URL", "http://frontend:3000").rstrip("/")
ORIGIN = os.environ.get("APP_PUBLIC_ORIGIN", "http://localhost:3000")
STAGES = ["ASSET_CHECK", "GENERATE", "FINALIZE"]
TERMINAL = {"SUCCEEDED", "FAILED"}


def sample_png():
    """Construct an actual RGB PNG, not a browser-only or magic-byte fake."""
    def chunk(kind, content):
        return (struct.pack(">I", len(content)) + kind + content
                + struct.pack(">I", zlib.crc32(kind + content) & 0xFFFFFFFF))
    rows = b"".join(b"\x00" + bytes([40 + y * 4, 140, 200]) * 24
                    for y in range(24))
    return (b"\x89PNG\r\n\x1a\n"
            + chunk(b"IHDR", struct.pack(">IIBBBBB", 24, 24, 8, 2, 0, 0, 0))
            + chunk(b"IDAT", zlib.compress(rows)) + chunk(b"IEND", b""))


class Client:
    def __init__(self):
        self.cookies = http.cookiejar.CookieJar()
        self.opener = urllib.request.build_opener(
            urllib.request.HTTPCookieProcessor(self.cookies))

    def request(self, method, path, body=None, content_type=None, origin=ORIGIN):
        headers = {"Accept": "application/json"}
        if method != "GET" and origin is not None:
            headers["Origin"] = origin
        if isinstance(body, dict):
            body = json.dumps(body).encode()
            content_type = "application/json"
        if content_type:
            headers["Content-Type"] = content_type
        request = urllib.request.Request(BASE_URL + path, data=body,
                                         headers=headers, method=method)
        try:
            response = self.opener.open(request, timeout=15)
        except urllib.error.HTTPError as error:
            response = error
        with response:
            data = response.read()
            if "application/json" in response.headers.get("Content-Type", ""):
                data = json.loads(data)
            return response.status, data, response.headers

    def session(self):
        status, data, headers = self.request("POST", "/api/session")
        if status != 200:
            raise AssertionError(f"session returned {status}: {data}")
        return data, headers

    def upload(self, template_id, image=None, mime="image/png", filename="sample.png"):
        image = sample_png() if image is None else image
        boundary = "acceptance-" + uuid.uuid4().hex
        body = (f"--{boundary}\r\nContent-Disposition: form-data; name=\"templateId\"\r\n\r\n"
                f"{template_id}\r\n--{boundary}\r\n"
                f"Content-Disposition: form-data; name=\"file\"; filename=\"{filename}\"\r\n"
                f"Content-Type: {mime}\r\n\r\n").encode()
        body += image + f"\r\n--{boundary}--\r\n".encode()
        return self.request("POST", "/api/assets", body,
                            f"multipart/form-data; boundary={boundary}")


class ApiAcceptance(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        print(json.dumps({"baseUrl": BASE_URL,
                          "testedCommit": os.environ.get("TESTED_COMMIT", "unknown"),
                          "startedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())}))
        public = Client()
        status, templates, _ = public.request("GET", "/api/templates")
        if status != 200 or not isinstance(templates, list) or not templates:
            raise AssertionError(f"Live template API unavailable: {status} {templates}")
        cls.templates = templates
        cls.template = min(templates, key=lambda item: item["requiredImageCount"])

    def setUp(self):
        self.client = Client()
        self.identity, _ = self.client.session()

    def assets(self, template=None):
        template = template or self.template
        ids = []
        for _ in range(template["requiredImageCount"]):
            status, asset, _ = self.client.upload(template["id"])
            self.assertEqual(201, status, asset)
            self.assertEqual(24, asset["width"])
            self.assertEqual(24, asset["height"])
            ids.append(asset["id"])
        return ids

    def submit(self, asset_ids, fail_at=None, delay=0, template=None):
        body = {"templateId": (template or self.template)["id"],
                "assetIds": asset_ids,
                "simulation": {"failAt": fail_at,
                               "delayMs": {"assetCheck": 0,
                                           "generate": delay, "finalize": 0}}}
        status, task, _ = self.client.request("POST", "/api/tasks", body)
        self.assertEqual(202, status, task)
        self.assertTrue(task["id"])
        self.assertGreaterEqual(task["version"], 1)
        return task

    def finished(self, task_id, timeout=35):
        deadline = time.monotonic() + timeout
        previous_version = 0
        while time.monotonic() < deadline:
            status, task, _ = self.client.request("GET", "/api/tasks/" + task_id)
            self.assertEqual(200, status, task)
            self.assertGreaterEqual(task["version"], previous_version)
            previous_version = task["version"]
            if task["status"] in TERMINAL:
                return task
            time.sleep(0.15)
        self.fail(f"Task {task_id} did not reach a terminal state within {timeout}s")

    def assert_error(self, response, statuses):
        status, body, _ = response
        self.assertIn(status, statuses, body)
        self.assertIsInstance(body, dict)
        for field in ["code", "message", "requestId"]:
            self.assertTrue(body.get(field), body)

    def test_01_public_catalog_categories_and_local_images(self):
        public = Client()
        status, categories, _ = public.request("GET", "/api/categories")
        self.assertEqual(200, status)
        self.assertGreaterEqual(len(categories), 2)
        self.assertGreaterEqual(len({t["requiredImageCount"] for t in self.templates}), 2)
        for template in self.templates:
            with self.subTest(template=template["id"]):
                self.assertTrue(template["coverUrl"].startswith("/media/"))
                status, image, headers = public.request("GET", template["coverUrl"])
                self.assertEqual(200, status)
                self.assertTrue(headers["Content-Type"].startswith("image/"))
                self.assertGreater(len(image), 30)
                category = urllib.parse.quote(template["categoryId"])
                status, filtered, _ = public.request("GET", "/api/templates?categoryId=" + category)
                self.assertEqual(200, status)
                self.assertTrue(all(t["categoryId"] == template["categoryId"] for t in filtered))
        self.assert_error(public.request("GET", "/api/templates/not-a-template"), {404})

    def test_02_identity_is_backend_cookie_and_reused(self):
        status, current, headers = self.client.request("GET", "/api/session")
        self.assertEqual(200, status)
        self.assertEqual(self.identity["userId"], current["userId"])
        self.assertIn("no-store", headers.get("Cache-Control", ""))
        again, _ = self.client.session()
        self.assertEqual(current["userId"], again["userId"])
        other = Client()
        self.assert_error(other.request("GET", "/api/session"), {401})
        identity, headers = other.session()
        self.assertNotEqual(current["userId"], identity["userId"])
        cookie = headers.get("Set-Cookie", "").lower()
        self.assertIn("httponly", cookie)
        self.assertIn("samesite=lax", cookie)

    def test_03_upload_actual_file_validation_and_private_read(self):
        status, asset, _ = self.client.upload(self.template["id"])
        self.assertEqual(201, status, asset)
        status, image, headers = self.client.request("GET", asset["url"])
        self.assertEqual(200, status)
        self.assertEqual(hashlib.sha256(sample_png()).hexdigest(),
                         hashlib.sha256(image).hexdigest())
        self.assertIn("no-store", headers.get("Cache-Control", ""))
        self.assert_error(self.client.upload(self.template["id"], b"not an image"), {400, 415})
        self.assert_error(self.client.upload(self.template["id"], mime="text/plain"), {400, 415})
        oversized = b"x" * (self.template["maxFileSizeBytes"] + 1)
        self.assert_error(self.client.upload(self.template["id"], oversized), {413})
        self.assert_error(self.client.upload("not-a-template"), {404})

    def test_04_submit_parameter_validation_and_origin(self):
        self.assert_error(self.client.request("POST", "/api/tasks", {
            "templateId": self.template["id"], "assetIds": []}), {400})
        ids = self.assets()
        self.assert_error(self.client.request("POST", "/api/tasks", {
            "templateId": self.template["id"], "assetIds": ids,
            "simulation": {"delayMs": {"generate": -1}}}), {400})
        self.assert_error(self.client.request("POST", "/api/tasks", {
            "templateId": self.template["id"], "assetIds": ids,
            "simulation": {"failAt": "NOT_A_STAGE"}}), {400})
        self.assert_error(self.client.request("POST", "/api/tasks", {
            "templateId": self.template["id"], "assetIds": ids},
            origin="https://untrusted.invalid"), {403})
        multi = next(t for t in self.templates if t["requiredImageCount"] > 1)
        self.assert_error(self.client.request("POST", "/api/tasks", {
            "templateId": multi["id"],
            "assetIds": [ids[0]] * multi["requiredImageCount"]}), {400})

    def test_05_accepts_before_generation_and_executes_without_queries(self):
        ids = self.assets()
        task = self.submit(ids, delay=4000)
        self.assertIn(task["status"], {"QUEUED", "RUNNING"},
                      "202 must return while the controlled long generation is unfinished")
        time.sleep(4.8)  # Deliberately no GET request drives these background steps.
        status, result, _ = self.client.request("GET", "/api/tasks/" + task["id"])
        self.assertEqual(200, status)
        self.assertEqual("SUCCEEDED", result["status"], result)
        self.assertEqual(STAGES, [s["stage"] for s in result["steps"]])
        self.assertEqual(["SUCCEEDED"] * 3, [s["status"] for s in result["steps"]])
        previous_end = None
        for step in result["steps"]:
            self.assertTrue(step["startedAt"])
            self.assertGreaterEqual(step["completedAt"], step["startedAt"])
            if previous_end:
                self.assertGreaterEqual(step["startedAt"], previous_end)
            previous_end = step["completedAt"]
        self.assertTrue(result["resultUrl"])
        status, image, _ = self.client.request("GET", result["resultUrl"])
        self.assertEqual(200, status)
        self.assertGreater(len(image), 30)
        for _ in range(3):
            status, repeat, _ = self.client.request("GET", "/api/tasks/" + task["id"])
            self.assertEqual(200, status)
            self.assertEqual(result, repeat, "terminal GET must be a read-only stable snapshot")

    def test_06_each_failure_stops_subsequent_steps(self):
        ids = self.assets()
        for index, stage in enumerate(STAGES):
            with self.subTest(stage=stage):
                result = self.finished(self.submit(ids, fail_at=stage)["id"])
                self.assertEqual("FAILED", result["status"])
                self.assertEqual(stage, result["failedStage"])
                self.assertEqual("SIMULATED_FAILURE", result["failureCode"])
                self.assertTrue(result["failureReason"])
                self.assertIsNone(result["resultUrl"])
                for position, step in enumerate(result["steps"]):
                    expected = "SUCCEEDED" if position < index else (
                        "FAILED" if position == index else "NOT_STARTED")
                    self.assertEqual(expected, step["status"])
                    if position > index:
                        self.assertIsNone(step["startedAt"])

    def test_07_multiple_tasks_active_pagination_and_history_refresh(self):
        ids = self.assets()
        tasks = [self.submit(ids, delay=1800),
                 self.submit(ids, fail_at="GENERATE", delay=1800),
                 self.submit(ids, delay=1800)]
        seen, cursor = set(), None
        while True:
            query = "/api/tasks?activeOnly=true&limit=1"
            if cursor:
                query += "&cursor=" + urllib.parse.quote(cursor)
            status, page, _ = self.client.request("GET", query)
            self.assertEqual(200, status)
            for task in page["items"]:
                self.assertIn(task["status"], {"QUEUED", "RUNNING"})
                self.assertNotIn(task["id"], seen)
                seen.add(task["id"])
            cursor = page["nextCursor"]
            if cursor is None:
                break
        self.assertEqual({t["id"] for t in tasks}, seen)
        final = [self.finished(task["id"]) for task in tasks]
        self.assertEqual(["SUCCEEDED", "FAILED", "SUCCEEDED"], [t["status"] for t in final])
        status, history, _ = self.client.request("GET", "/api/tasks")
        self.assertEqual(200, status)
        self.assertEqual({t["id"] for t in tasks}, {t["id"] for t in history["items"]})
        status, active, _ = self.client.request("GET", "/api/tasks?activeOnly=true")
        self.assertEqual(200, status)
        self.assertEqual([], active["items"])

    def test_08_foreign_tasks_assets_results_are_private(self):
        ids = self.assets()
        task = self.finished(self.submit(ids)["id"])
        other = Client()
        other.session()
        for path in ["/api/tasks/" + task["id"], "/media/assets/" + ids[0], task["resultUrl"]]:
            with self.subTest(path=path):
                self.assert_error(other.request("GET", path), {404})
                self.assert_error(Client().request("GET", path), {401})
        self.assert_error(other.request("POST", "/api/tasks", {
            "templateId": self.template["id"], "assetIds": ids}), {404})
        status, empty, _ = other.request("GET", "/api/tasks")
        self.assertEqual(200, status)
        self.assertEqual([], empty["items"])
        self.assert_error(self.client.request("GET", "/api/tasks/" + str(uuid.uuid4())), {404})


if __name__ == "__main__":
    unittest.main(verbosity=2)
