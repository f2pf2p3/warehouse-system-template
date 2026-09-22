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

describe("Inventory API", () => {
  const suffix = Date.now();
  let token = "";
  let productId = 0;
  let warehouseId = 0;
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

  it("loads inventory", async () => {
    const { response, body } = await request("/api/inventory", {
      headers: { Authorization: `Bearer ${token}` },
    });
    assert.equal(response.ok, true);
    assert.ok(body);
  });

  it("receives stock", async () => {
    assert.ok(productId > 0 || process.env.TEST_PRODUCT_ID);
    assert.ok(warehouseId > 0 || process.env.TEST_WAREHOUSE_ID);
    assert.ok(locationId > 0 || process.env.TEST_LOCATION_ID);

    const { response } = await request("/api/inventory/receive", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        productId: Number(process.env.TEST_PRODUCT_ID ?? productId),
        warehouseId: Number(process.env.TEST_WAREHOUSE_ID ?? warehouseId),
        locationId: Number(process.env.TEST_LOCATION_ID ?? locationId),
        quantity: 100,
        note: `Automated test ${suffix}`,
      }),
    });

    assert.equal(response.ok, true);
  });

  it("adjusts stock", async () => {
    const { response } = await request("/api/inventory/adjust", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        productId: Number(process.env.TEST_PRODUCT_ID ?? productId),
        warehouseId: Number(process.env.TEST_WAREHOUSE_ID ?? warehouseId),
        locationId: Number(process.env.TEST_LOCATION_ID ?? locationId),
        quantity: 10,
        note: "Automated adjustment test",
      }),
    });

    assert.equal(response.ok, true);
  });

  it("loads transaction history", async () => {
    const { response } = await request("/api/inventory/transactions", {
      headers: { Authorization: `Bearer ${token}` },
    });
    assert.equal(response.ok, true);
  });
});
