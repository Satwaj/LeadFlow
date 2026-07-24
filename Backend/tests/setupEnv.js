process.env.NODE_ENV = "test";
process.env.JWT_SECRET = process.env.JWT_SECRET || "test_jwt_secret_not_for_production";
process.env.JWT_EXPIRY = process.env.JWT_EXPIRY || "1d";
process.env.CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

if (typeof jest !== "undefined") {
  jest.setTimeout(30000);
}
