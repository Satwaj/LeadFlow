import request from "supertest";
import app from "../src/app.js";
import Activity from "../src/models/activity.model.js";
import Lead from "../src/models/lead.model.js";
import LeadRequest from "../src/models/leadRequest.model.js";
import User from "../src/models/user.model.js";
import {
  clearTestDB,
  connectTestDB,
  createLead,
  createUser,
  disconnectTestDB,
  loginAs,
} from "./testUtils.js";

beforeAll(connectTestDB);
beforeEach(clearTestDB);
afterAll(disconnectTestDB);

describe("Lead Request Workflow API", () => {
  let adminUser, member1, member2;
  let adminCookie, member1Cookie, member2Cookie;
  let activeLead, assignedLead;

  beforeEach(async () => {
    adminUser = await createUser({ name: "Admin Lead", email: "admin@test.com", role: "admin" });
    member1 = await createUser({ name: "Member One", email: "member1@test.com", role: "member" });
    member2 = await createUser({ name: "Member Two", email: "member2@test.com", role: "member" });

    adminCookie = await loginAs("admin@test.com", "password123");
    member1Cookie = await loginAs("member1@test.com", "password123");
    member2Cookie = await loginAs("member2@test.com", "password123");

    activeLead = await createLead({
      name: "Acme Enterprise",
      email: "contact@acme.com",
      service: "Web Development",
      source: "website",
      status: "New",
      assignedTo: null,
    });

    assignedLead = await createLead({
      name: "Beta Corp",
      email: "info@beta.com",
      service: "Software & SaaS",
      source: "website",
      status: "Qualified",
      assignedTo: member2._id,
    });
  });

  test("Member can request an unassigned active lead", async () => {
    const res = await request(app)
      .post(`/api/leads/${activeLead._id}/request`)
      .set("Cookie", member1Cookie)
      .send();

    expect(res.status).toBe(201);
    expect(res.body.status).toBe("pending");
    expect(res.body.lead._id.toString()).toBe(activeLead._id.toString());
    expect(res.body.requestedBy._id.toString()).toBe(member1._id.toString());
  });

  test("Prevents duplicate pending request by the same Member for the same Lead", async () => {
    await request(app)
      .post(`/api/leads/${activeLead._id}/request`)
      .set("Cookie", member1Cookie);

    const duplicateRes = await request(app)
      .post(`/api/leads/${activeLead._id}/request`)
      .set("Cookie", member1Cookie);

    expect(duplicateRes.status).toBe(400);
    expect(duplicateRes.body.message).toContain("already have a pending request");
  });

  test("Prevents Member from requesting an already assigned Lead", async () => {
    const res = await request(app)
      .post(`/api/leads/${assignedLead._id}/request`)
      .set("Cookie", member1Cookie);

    expect(res.status).toBe(400);
    expect(res.body.message).toContain("already assigned");
  });

  test("Member cannot approve or reject a Lead Request (RBAC enforced)", async () => {
    const reqRes = await request(app)
      .post(`/api/leads/${activeLead._id}/request`)
      .set("Cookie", member1Cookie);

    const requestId = reqRes.body._id;

    const approveRes = await request(app)
      .patch(`/api/lead-requests/${requestId}/approve`)
      .set("Cookie", member1Cookie);

    expect(approveRes.status).toBe(403);
  });

  test("Admin can approve request, assigning lead to Member and auto-rejecting conflicting requests", async () => {
    const req1 = await request(app)
      .post(`/api/leads/${activeLead._id}/request`)
      .set("Cookie", member1Cookie);
    const requestId1 = req1.body._id;

    const req2 = await request(app)
      .post(`/api/leads/${activeLead._id}/request`)
      .set("Cookie", member2Cookie);
    const requestId2 = req2.body._id;

    const approveRes = await request(app)
      .patch(`/api/lead-requests/${requestId1}/approve`)
      .set("Cookie", adminCookie);

    expect(approveRes.status).toBe(200);
    expect(approveRes.body.status).toBe("approved");

    const updatedLead = await Lead.findById(activeLead._id);
    expect(updatedLead.assignedTo.toString()).toBe(member1._id.toString());

    const member2Req = await LeadRequest.findById(requestId2);
    expect(member2Req.status).toBe("rejected");

    const activity = await Activity.findOne({ lead: activeLead._id, action: "lead_assigned" });
    expect(activity).not.toBeNull();
  });

  test("Admin can reject request, keeping lead unassigned", async () => {
    const reqRes = await request(app)
      .post(`/api/leads/${activeLead._id}/request`)
      .set("Cookie", member1Cookie);

    const requestId = reqRes.body._id;

    const rejectRes = await request(app)
      .patch(`/api/lead-requests/${requestId}/reject`)
      .set("Cookie", adminCookie);

    expect(rejectRes.status).toBe(200);
    expect(rejectRes.body.status).toBe("rejected");

    const updatedLead = await Lead.findById(activeLead._id);
    expect(updatedLead.assignedTo).toBeNull();
  });
});
