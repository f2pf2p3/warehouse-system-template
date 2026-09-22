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

describe("Complete warehouse workflow", () => {
  const suffix = Date.now();
  let token = "";
  let categoryId = 0;
  let productId = 0;
  let warehouseId = 0;
  let destinationWarehouseId = 0;
  let zoneId = 0;
  let shelfId = 0;
  let locationId = 0;
  let destinationLocationId = 0;
  let supplierId = 0;
  let purchaseOrderId = 0;

  it("1. registers a test user", async () => {
    const { response } = await request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        email: `workflow-${suffix}@example.com`,
        password: "TestPassword123!",
        name: "Warehouse Workflow Tester",
      }),
    });
    assert.ok(response.status === 200 || response.status === 201);
  });

  it("2. logs in", async () => {
    const { response, body } = await request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: `workflow-${suffix}@example.com`,
        password: "TestPassword123!",
      }),
    });
    assert.equal(response.ok, true);
    token = body?.token ?? body?.accessToken ?? "";
    assert.ok(token);
  });

  it("3. creates a category", async () => {
    const { response, body } = await request("/api/categories", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: `Workflow Category ${suffix}` }),
    });
    assert.ok(response.status === 200 || response.status === 201);
    categoryId = body?.id ?? body?.category?.id;
    assert.ok(categoryId);
  });

  it("4. creates a product", async () => {
    const { response, body } = await request("/api/products", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        name: `Workflow Product ${suffix}`,
        sku: `WF-${suffix}`,
        categoryId,
        minimumStock: 10,
      }),
    });
    assert.ok(response.status === 200 || response.status === 201);
    productId = body?.id ?? body?.product?.id;
    assert.ok(productId);
  });

  it("5. creates source warehouse structure", async () => {
    let result = await request("/api/warehouses", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: `Source Warehouse ${suffix}`, code: `SRC-${suffix}` }),
    });
    assert.ok(result.response.status === 200 || result.response.status === 201);
    warehouseId = result.body?.id ?? result.body?.warehouse?.id;
    assert.ok(warehouseId);

    result = await request(`/api/warehouses/${warehouseId}/zones`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: "Zone A", code: `ZA-${suffix}` }),
    });
    zoneId = result.body?.id ?? result.body?.zone?.id;
    assert.ok(zoneId);

    result = await request(`/api/zones/${zoneId}/shelves`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: "Shelf A", code: `SA-${suffix}` }),
    });
    shelfId = result.body?.id ?? result.body?.shelf?.id;
    assert.ok(shelfId);

    result = await request(`/api/shelves/${shelfId}/locations`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: "Location A", code: `LA-${suffix}` }),
    });
    locationId = result.body?.id ?? result.body?.location?.id;
    assert.ok(locationId);
  });

  it("6. creates destination warehouse", async () => {
    let result = await request("/api/warehouses", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: `Destination Warehouse ${suffix}`, code: `DST-${suffix}` }),
    });
    destinationWarehouseId = result.body?.id ?? result.body?.warehouse?.id;
    assert.ok(destinationWarehouseId);

    result = await request(`/api/warehouses/${destinationWarehouseId}/zones`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: "Zone B", code: `ZB-${suffix}` }),
    });
    const destinationZoneId = result.body?.id ?? result.body?.zone?.id;
    assert.ok(destinationZoneId);

    result = await request(`/api/zones/${destinationZoneId}/shelves`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: "Shelf B", code: `SB-${suffix}` }),
    });
    const destinationShelfId = result.body?.id ?? result.body?.shelf?.id;
    assert.ok(destinationShelfId);

    result = await request(`/api/shelves/${destinationShelfId}/locations`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: "Location B", code: `LB-${suffix}` }),
    });
    destinationLocationId = result.body?.id ?? result.body?.location?.id;
    assert.ok(destinationLocationId);
  });

  it("7. creates a supplier and purchase order", async () => {
    let result = await request("/api/suppliers", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: `Supplier ${suffix}` }),
    });
    supplierId = result.body?.id ?? result.body?.supplier?.id;
    assert.ok(supplierId);

    result = await request("/api/purchase-orders", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        supplierId,
        items: [{ productId, quantity: 100, price: 10 }],
      }),
    });
    assert.ok(result.response.status === 200 || result.response.status === 201);
    purchaseOrderId = result.body?.id ?? result.body?.purchaseOrder?.id;
    assert.ok(purchaseOrderId);
  });

  it("8. receives 100 units", async () => {
    const { response } = await request("/api/inventory/receive", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        productId,
        warehouseId,
        locationId,
        quantity: 100,
        purchaseOrderId,
      }),
    });
    assert.equal(response.ok, true);
  });

  it("9. verifies inventory after receiving", async () => {
    const { response, body } = await request("/api/inventory", {
      headers: { Authorization: `Bearer ${token}` },
    });
    assert.equal(response.ok, true);
    const rows = Array.isArray(body) ? body : body?.data ?? body?.inventory ?? [];
    const row = rows.find((item: any) => item.productId === productId && item.locationId === locationId);
    assert.ok(row);
    assert.equal(Number(row.quantity), 100);
  });

  it("10. adjusts stock by +10", async () => {
    const { response } = await request("/api/inventory/adjust", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ productId, warehouseId, locationId, quantity: 10 }),
    });
    assert.equal(response.ok, true);
  });

  it("11. transfers 20 units", async () => {
    const { response } = await request("/api/inventory/transfer", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        productId,
        sourceWarehouseId: warehouseId,
        sourceLocationId: locationId,
        destinationWarehouseId,
        destinationLocationId,
        quantity: 20,
      }),
    });
    assert.equal(response.ok, true);
  });

  it("12. ships 15 units", async () => {
    const { response } = await request("/api/inventory/ship", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        productId,
        warehouseId: destinationWarehouseId,
        locationId: destinationLocationId,
        quantity: 15,
      }),
    });
    assert.equal(response.ok, true);
  });

  it("13. checks inventory transactions", async () => {
    const { response, body } = await request("/api/inventory/transactions", {
      headers: { Authorization: `Bearer ${token}` },
    });
    assert.equal(response.ok, true);
    assert.ok(body);
  });

  it("14. checks reports", async () => {
    for (const path of [
      "/api/reports/inventory",
      "/api/reports/stock-movement",
      "/api/reports/low-stock",
    ]) {
      const { response } = await request(path, {
        headers: { Authorization: `Bearer ${token}` },
      });
      assert.equal(response.ok, true);
    }
  });
});
