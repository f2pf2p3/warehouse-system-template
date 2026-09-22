import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

const API = process.env.API_URL ?? "http://localhost:5000";

async function request(path: string, options: RequestInit = {}) {
  const response = await fetch(`${API}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers ?? {}) },
    ...options,
  });
  let body: any = null;
  try { body = await response.json(); } catch {}
  return { response, body };
}

describe("Warehouse structure API", () => {
  const suffix = Date.now();
  let token = "";
  let warehouseId = 0;
  let zoneId = 0;
  let shelfId = 0;
  let locationId = 0;

  it("logs in", async () => {
    const { response, body } = await request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: process.env.TEST_EMAIL ?? "admin@example.com",
        password: process.env.TEST_PASSWORD ?? "TestPassword123!",
      }),
    });

    assert.equal(response.ok, true);
    token = body?.token ?? body?.accessToken ?? "";
    assert.ok(token);
  });

  it("creates a warehouse", async () => {
    const { response, body } = await request("/api/warehouses", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        name: `Test Warehouse ${suffix}`,
        code: `WH-${suffix}`,
        description: "Automated test warehouse",
      }),
    });

    assert.ok(response.status === 200 || response.status === 201);
    warehouseId = body?.id ?? body?.warehouse?.id;
    assert.ok(warehouseId);
  });

  it("lists warehouses", async () => {
    const { response } = await request("/api/warehouses", {
      headers: { Authorization: `Bearer ${token}` },
    });
    assert.equal(response.ok, true);
  });

  it("creates a zone", async () => {
    const { response, body } = await request(`/api/warehouses/${warehouseId}/zones`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: `Zone ${suffix}`, code: `Z-${suffix}` }),
    });

    assert.ok(response.status === 200 || response.status === 201);
    zoneId = body?.id ?? body?.zone?.id;
    assert.ok(zoneId);
  });

  it("creates a shelf", async () => {
    const { response, body } = await request(`/api/zones/${zoneId}/shelves`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: `Shelf ${suffix}`, code: `S-${suffix}` }),
    });

    assert.ok(response.status === 200 || response.status === 201);
    shelfId = body?.id ?? body?.shelf?.id;
    assert.ok(shelfId);
  });

  it("creates a location", async () => {
    const { response, body } = await request(`/api/shelves/${shelfId}/locations`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: `Location ${suffix}`, code: `L-${suffix}` }),
    });

    assert.ok(response.status === 200 || response.status === 201);
    locationId = body?.id ?? body?.location?.id;
    assert.ok(locationId);
  });

  it("lists locations", async () => {
    const { response } = await request("/api/locations", {
      headers: { Authorization: `Bearer ${token}` },
    });
    assert.equal(response.ok, true);
  });
});
