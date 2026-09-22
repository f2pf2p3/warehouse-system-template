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

describe("Purchasing API", () => {
  const suffix = Date.now();
  let token = "";
  let supplierId = 0;
  let purchaseOrderId = 0;
  let productId = Number(process.env.TEST_PRODUCT_ID ?? 0);

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

  it("creates a supplier", async () => {
    const { response, body } = await request("/api/suppliers", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        name: `Test Supplier ${suffix}`,
        contact: "Test Contact",
        email: `supplier-${suffix}@example.com`,
        phone: "0000000000",
      }),
    });

    assert.ok(response.status === 200 || response.status === 201);
    supplierId = body?.id ?? body?.supplier?.id;
    assert.ok(supplierId);
  });

  it("lists suppliers", async () => {
    const { response } = await request("/api/suppliers", {
      headers: { Authorization: `Bearer ${token}` },
    });
    assert.equal(response.ok, true);
  });

  it("creates a purchase order", async () => {
    assert.ok(productId > 0, "Set TEST_PRODUCT_ID before running purchasing tests.");

    const { response, body } = await request("/api/purchase-orders", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        supplierId,
        items: [{ productId, quantity: 100, price: 10.0 }],
      }),
    });

    assert.ok(response.status === 200 || response.status === 201);
    purchaseOrderId = body?.id ?? body?.purchaseOrder?.id;
    assert.ok(purchaseOrderId);
  });

  it("lists purchase orders", async () => {
    const { response } = await request("/api/purchase-orders", {
      headers: { Authorization: `Bearer ${token}` },
    });
    assert.equal(response.ok, true);
  });
});
