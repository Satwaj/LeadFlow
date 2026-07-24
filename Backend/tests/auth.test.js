import request from "supertest";
import app from "../src/app.js";
import { connectTestDB, clearTestDB, createUser, disconnectTestDB } from "./testUtils.js";

beforeAll(connectTestDB);
beforeEach(clearTestDB);
afterAll(disconnectTestDB);

describe("Authentication API", () => {
  test("login with correct credentials returns 200 and sets cookie", async () => {
    await createUser({
      name: "Admin User",
      email: "admin@example.com",
      password: "password123",
      role: "admin",
    });

    const response = await request(app)
      .post("/api/auth/login")
      .send({ email: "admin@example.com", password: "password123" });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.headers["set-cookie"]?.join(";")).toContain("token=");
    expect(response.body.data.user.email).toBe("admin@example.com");
    expect(response.body.data.user.password).toBeUndefined();
  });

  test("login fails with an incorrect password", async () => {
    await createUser({
      email: "member@example.com",
      password: "password123",
      role: "member",
    });

    const response = await request(app)
      .post("/api/auth/login")
      .send({ email: "member@example.com", password: "wrong-password" });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  test("unauthenticated lead listing returns 401", async () => {
    const response = await request(app).get("/api/leads");

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  test("admin can fetch safe users and member receives 403", async () => {
    await createUser({
      name: "Admin User",
      email: "admin@example.com",
      password: "password123",
      role: "admin",
    });
    await createUser({
      name: "Member User",
      email: "member@example.com",
      password: "password123",
      role: "member",
    });

    const adminLogin = await request(app)
      .post("/api/auth/login")
      .send({ email: "admin@example.com", password: "password123" });
    const memberLogin = await request(app)
      .post("/api/auth/login")
      .send({ email: "member@example.com", password: "password123" });

    const adminResponse = await request(app).get("/api/auth/users").set("Cookie", adminLogin.headers["set-cookie"]);
    const memberResponse = await request(app).get("/api/auth/users").set("Cookie", memberLogin.headers["set-cookie"]);

    expect(adminResponse.status).toBe(200);
    expect(adminResponse.body.data.users).toHaveLength(2);
    expect(adminResponse.body.data.users[0].password).toBeUndefined();
    expect(memberResponse.status).toBe(403);
  });

  test("public member registration creates member and ignores role: admin payload", async () => {
    const response = await request(app).post("/api/auth/register").send({
      name: "Public Registrant",
      email: "publicreg@example.com",
      password: "password123",
      role: "admin", // Malicious attempt to self-promote to admin
    });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.user.email).toBe("publicreg@example.com");
    // HARDCODED SERVER OVERRIDE: Must be member, not admin
    expect(response.body.data.user.role).toBe("member");
    expect(response.body.data.user.password).toBeUndefined();
  });

  test("unauthenticated user cannot call admin create user endpoint (returns 401)", async () => {
    const response = await request(app).post("/api/auth/users").send({
      name: "New Admin",
      email: "newadmin@example.com",
      password: "password123",
      role: "admin",
    });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  test("member user cannot call admin create user endpoint (returns 403)", async () => {
    await createUser({
      name: "Member User",
      email: "member@example.com",
      password: "password123",
      role: "member",
    });

    const memberLogin = await request(app)
      .post("/api/auth/login")
      .send({ email: "member@example.com", password: "password123" });

    const response = await request(app)
      .post("/api/auth/users")
      .set("Cookie", memberLogin.headers["set-cookie"])
      .send({
        name: "New Admin",
        email: "newadmin@example.com",
        password: "password123",
        role: "admin",
      });

    expect(response.status).toBe(403);
    expect(response.body.success).toBe(false);
  });

  test("admin user can create new member and admin accounts via /api/auth/users", async () => {
    await createUser({
      name: "Admin User",
      email: "admin@example.com",
      password: "password123",
      role: "admin",
    });

    const adminLogin = await request(app)
      .post("/api/auth/login")
      .send({ email: "admin@example.com", password: "password123" });

    const createMemberResponse = await request(app)
      .post("/api/auth/users")
      .set("Cookie", adminLogin.headers["set-cookie"])
      .send({
        name: "Sub Member",
        email: "submember@example.com",
        password: "password123",
        role: "member",
      });

    expect(createMemberResponse.status).toBe(201);
    expect(createMemberResponse.body.success).toBe(true);
    expect(createMemberResponse.body.data.user.email).toBe("submember@example.com");
    expect(createMemberResponse.body.data.user.role).toBe("member");

    const createAdminResponse = await request(app)
      .post("/api/auth/users")
      .set("Cookie", adminLogin.headers["set-cookie"])
      .send({
        name: "Sub Admin",
        email: "subadmin@example.com",
        password: "password123",
        role: "admin",
      });

    expect(createAdminResponse.status).toBe(201);
    expect(createAdminResponse.body.data.user.role).toBe("admin");
  });

  test("register fails with validation error if password is less than 8 characters", async () => {
    const response = await request(app).post("/api/auth/register").send({
      name: "Short Pass User",
      email: "shortpass@example.com",
      password: "short",
    });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  test("register fails with 409 if email already exists", async () => {
    await createUser({
      name: "Existing User",
      email: "existing@example.com",
      password: "password123",
      role: "member",
    });

    const response = await request(app).post("/api/auth/register").send({
      name: "Duplicate User",
      email: "existing@example.com",
      password: "password123",
    });

    expect(response.status).toBe(409);
    expect(response.body.success).toBe(false);
  });
});
