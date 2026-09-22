import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

const API = process.env.API_URL ?? "http://localhost:5000";

async function request(path: string, options: RequestInit = {}) {
  const response = await fetch(`${API}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers ?? {}) },
    ...options,
  });
  let body: unknown = null;
  try { body = await response.json(); } catch {}
  return { response, body };
}

describe("Authentication API", () => {
  const email = `test-${Date.now()}@example.com`;
  const password = "TestPassword123!";
  let token = "";

  it("registers a user", async () => {
    const { response, body } = await request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, name: "Test User" }),
    });

    assert.ok(response.status === 200 || response.status === 201);
    assert.ok(body);
  });

  it("logs in and returns a token", async () => {
    const { response, body } = await request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    assert.equal(response.ok, true);
    assert.ok(body && typeof body === "object");
    token = String((body as any).token ?? (body as any).accessToken ?? "");
    assert.ok(token.length > 0);
  });

  it("can authenticate a protected request", async () => {
    assert.ok(token.length > 0);
    const { response } = await request("/api/users", {
      headers: { Authorization: `Bearer ${token}` },
    });

    assert.equal(response.ok, true);
  });
});
