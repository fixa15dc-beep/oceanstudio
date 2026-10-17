"""Ocean Studio backend tests: site content, chunked uploads, auth/role checks and regressions."""
import os
import io
import copy
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://roupas-carros-fivem.preview.emergentagent.com").rstrip("/")
ORIGIN = BASE_URL  # mutation routes require Origin == CORS_ORIGINS

ADMIN_EMAIL = "admin@oceanstudio.com"
ADMIN_PASSWORD = "ocean-admin-2025"
STUDENT_EMAIL = "aluno@teste.com"
STUDENT_PASSWORD = "teste123"

CHUNK_SIZE = 4 * 1024 * 1024


def _session():
    s = requests.Session()
    s.headers.update({"Origin": ORIGIN})
    return s


@pytest.fixture(scope="module")
def anon():
    return _session()


@pytest.fixture(scope="module")
def admin():
    s = _session()
    r = s.post(f"{BASE_URL}/api/auth/login",
               json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD},
               headers={"Content-Type": "application/json", "Origin": ORIGIN})
    assert r.status_code == 200, f"admin login failed: {r.status_code} {r.text}"
    return s


@pytest.fixture(scope="module")
def student():
    s = _session()
    r = s.post(f"{BASE_URL}/api/auth/login",
               json={"email": STUDENT_EMAIL, "password": STUDENT_PASSWORD},
               headers={"Content-Type": "application/json", "Origin": ORIGIN})
    if r.status_code != 200:
        pytest.skip(f"student login failed: {r.status_code} {r.text}")
    return s


# ---------------- Site content ----------------

class TestSite:
    def test_get_site_default_keys(self, anon):
        r = anon.get(f"{BASE_URL}/api/site")
        assert r.status_code == 200
        d = r.json()
        for k in ["brand", "nav", "hero", "marquee", "catalog", "cars", "hl", "facs", "footer"]:
            assert k in d, f"missing key: {k}"
        assert isinstance(d["nav"], list)
        assert "title" in d["hero"]

    def test_admin_site_update_and_merge(self, admin, anon):
        # First, read original
        orig = anon.get(f"{BASE_URL}/api/site").json()
        new_body = copy.deepcopy(orig)
        new_body["hero"]["title"] = "Teste\nLinha 2"
        new_body["hl"]["videos"] = [{"title": "HL 1", "url": "/api/uploads/x.mp4", "poster": ""}]
        r = admin.put(f"{BASE_URL}/api/admin/site", json=new_body,
                      headers={"Content-Type": "application/json", "Origin": ORIGIN})
        assert r.status_code == 200, r.text
        got = anon.get(f"{BASE_URL}/api/site").json()
        assert got["hero"]["title"] == "Teste\nLinha 2"
        assert got["hl"]["videos"] == [{"title": "HL 1", "url": "/api/uploads/x.mp4", "poster": ""}]
        # unchanged defaults preserved
        assert "label" in got["catalog"]

    def test_admin_site_reset(self, admin, anon):
        r = admin.post(f"{BASE_URL}/api/admin/site/reset", headers={"Origin": ORIGIN})
        assert r.status_code == 200
        got = anon.get(f"{BASE_URL}/api/site").json()
        assert got["hero"]["title"] == "Identidade para\nsua fac."
        assert got["hl"]["videos"] == []

    def test_student_cannot_put_site(self, student):
        r = student.put(f"{BASE_URL}/api/admin/site", json={"hero": {"title": "x"}},
                        headers={"Content-Type": "application/json", "Origin": ORIGIN})
        assert r.status_code == 403, r.text

    def test_anon_cannot_put_site(self, anon):
        r = requests.put(f"{BASE_URL}/api/admin/site",
                         json={"hero": {"title": "x"}},
                         headers={"Content-Type": "application/json", "Origin": ORIGIN})
        assert r.status_code == 401, r.text


# ---------------- Chunked uploads ----------------

class TestUploads:
    created_file_id = None

    def test_upload_flow(self, admin):
        total_size = 9 * 1024 * 1024 + 123  # ~9MB -> 3 chunks
        payload = os.urandom(total_size)
        r = admin.post(f"{BASE_URL}/api/admin/uploads/init",
                       json={"filename": "teste.mp4", "size": total_size, "content_type": "video/mp4"},
                       headers={"Content-Type": "application/json", "Origin": ORIGIN})
        assert r.status_code == 200, r.text
        info = r.json()
        assert info["chunk_size"] == CHUNK_SIZE
        assert info["total_chunks"] == 3
        upload_id = info["upload_id"]

        for i in range(3):
            start = i * CHUNK_SIZE
            end = min(start + CHUNK_SIZE, total_size)
            chunk = payload[start:end]
            r = admin.put(f"{BASE_URL}/api/admin/uploads/{upload_id}/chunk/{i}",
                          data=chunk,
                          headers={"Content-Type": "application/octet-stream", "Origin": ORIGIN})
            assert r.status_code == 200, f"chunk {i} failed: {r.status_code} {r.text}"

        r = admin.post(f"{BASE_URL}/api/admin/uploads/{upload_id}/complete",
                       headers={"Origin": ORIGIN})
        assert r.status_code == 200, r.text
        meta = r.json()
        assert meta["kind"] == "video"
        assert meta["size"] == total_size
        assert meta["url"].endswith(".mp4")
        TestUploads.created_file_id = meta["id"]
        TestUploads.created_url = meta["url"]
        TestUploads.total_size = total_size

    def test_get_file_full(self):
        url = f"{BASE_URL}{TestUploads.created_url}"
        r = requests.get(url)
        assert r.status_code == 200
        assert len(r.content) == TestUploads.total_size

    def test_get_file_range(self):
        url = f"{BASE_URL}{TestUploads.created_url}"
        r = requests.get(url, headers={"Range": "bytes=0-999"})
        assert r.status_code == 206
        assert r.headers.get("Content-Range", "").startswith("bytes 0-999/")
        assert len(r.content) == 1000

    def test_list_uploads_contains_file(self, admin):
        r = admin.get(f"{BASE_URL}/api/admin/uploads")
        assert r.status_code == 200
        ids = [f["id"] for f in r.json()]
        assert TestUploads.created_file_id in ids

    def test_delete_upload(self, admin):
        r = admin.delete(f"{BASE_URL}/api/admin/uploads/{TestUploads.created_file_id}",
                         headers={"Origin": ORIGIN})
        assert r.status_code == 200
        url = f"{BASE_URL}{TestUploads.created_url}"
        r2 = requests.get(url)
        assert r2.status_code == 404

    def test_bad_extension(self, admin):
        r = admin.post(f"{BASE_URL}/api/admin/uploads/init",
                       json={"filename": "evil.exe", "size": 100, "content_type": "application/octet-stream"},
                       headers={"Content-Type": "application/json", "Origin": ORIGIN})
        assert r.status_code == 400

    def test_oversized(self, admin):
        r = admin.post(f"{BASE_URL}/api/admin/uploads/init",
                       json={"filename": "big.mp4", "size": 3 * 1024 * 1024 * 1024, "content_type": "video/mp4"},
                       headers={"Content-Type": "application/json", "Origin": ORIGIN})
        assert r.status_code == 400

    def test_complete_missing_chunks(self, admin):
        size = 2 * CHUNK_SIZE + 100
        r = admin.post(f"{BASE_URL}/api/admin/uploads/init",
                       json={"filename": "part.mp4", "size": size, "content_type": "video/mp4"},
                       headers={"Content-Type": "application/json", "Origin": ORIGIN})
        assert r.status_code == 200
        up_id = r.json()["upload_id"]
        # upload only chunk 0
        r = admin.put(f"{BASE_URL}/api/admin/uploads/{up_id}/chunk/0",
                      data=os.urandom(CHUNK_SIZE),
                      headers={"Content-Type": "application/octet-stream", "Origin": ORIGIN})
        assert r.status_code == 200
        r = admin.post(f"{BASE_URL}/api/admin/uploads/{up_id}/complete",
                       headers={"Origin": ORIGIN})
        assert r.status_code == 400


# ---------------- Regression ----------------

class TestRegression:
    def test_products_public(self, anon):
        r = anon.get(f"{BASE_URL}/api/products")
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert len(data) >= 1
        assert "name" in data[0]
        assert "_id" not in data[0]

    def test_facs_public(self, anon):
        r = anon.get(f"{BASE_URL}/api/facs")
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_admin_create_fac_with_images(self, admin):
        r = admin.post(f"{BASE_URL}/api/admin/facs",
                       json={"name": "TEST_Fac", "description": "desc",
                             "images": ["/api/uploads/a.png", "/api/uploads/b.png"]},
                       headers={"Content-Type": "application/json", "Origin": ORIGIN})
        assert r.status_code == 200, r.text
        fac = r.json()
        assert fac["name"] == "TEST_Fac"
        assert fac["images"] == ["/api/uploads/a.png", "/api/uploads/b.png"]
        # cleanup
        admin.delete(f"{BASE_URL}/api/admin/facs/{fac['id']}", headers={"Origin": ORIGIN})

    def test_student_access(self, student):
        r = student.get(f"{BASE_URL}/api/me/access")
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        # Expected to have "Curso de HL" per credentials file
        names = [p.get("name") for p in data]
        assert any("HL" in n for n in names), f"no HL course in access: {names}"
