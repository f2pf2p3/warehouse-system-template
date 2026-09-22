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

describe("Shipment API", () => {
  let token = "";

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

  it("lists shipments", async () => {
    const { response, body } = await request("/api/shipments", {
      headers: { Authorization: `Bearer ${token}` },
    });
    assert.equal(response.ok, true);
    assert.ok(body);
  });

  it("creates a shipment", async () => {
    const productId = Number(process.env.TEST_PRODUCT_ID ?? 0);
    const warehouseId = Number(process.env.TEST_WAREHOUSE_ID ?? 0);
    const locationId = Number(process.env.TEST_LOCATION_ID ?? 0);

    assert.ok(productId > 0, "Set TEST_PRODUCT_ID before running shipment tests.");
    assert.ok(warehouseId > 0, "Set TEST_WAREHOUSE_ID before running shipment tests.");
    assert.ok(locationId > 0, "Set TEST_LOCATION_ID before running shipment tests.");

    const { response } = await request("/api/shipments", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        warehouseId,
        items: [{ productId, locationId, quantity: 15 }],
      }),
    });

    assert.ok(response.status === 200 || response.status === 201);
  });
});
