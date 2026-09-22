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

describe("Product API", () => {
  const suffix = Date.now();
  let token = "";
  let categoryId = 0;
  let productId = 0;

  it("logs in with the test account", async () => {
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

  it("creates a category", async () => {
    const { response, body } = await request("/api/categories", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        name: `Test Category ${suffix}`,
        description: "Created by automated API tests",
      }),
    });

    assert.ok(response.status === 200 || response.status === 201);
    categoryId = body?.id ?? body?.category?.id;
    assert.ok(categoryId);
  });

  it("creates a product", async () => {
    const { response, body } = await request("/api/products", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        name: `Test Product ${suffix}`,
        sku: `TEST-${suffix}`,
        barcode: `BAR-${suffix}`,
        minimumStock: 10,
        categoryId,
      }),
    });

    assert.ok(response.status === 200 || response.status === 201);
    productId = body?.id ?? body?.product?.id;
    assert.ok(productId);
  });

  it("lists products", async () => {
    const { response, body } = await request("/api/products", {
      headers: { Authorization: `Bearer ${token}` },
    });

    assert.equal(response.ok, true);
    assert.ok(body);
  });

  it("gets the created product", async () => {
    const { response, body } = await request(`/api/products/${productId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    assert.equal(response.ok, true);
    assert.ok(body);
  });

  it("updates the product", async () => {
    const { response } = await request(`/api/products/${productId}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ minimumStock: 20 }),
    });

    assert.equal(response.ok, true);
  });
});
