import request from "supertest";
import app from "../src/app.js";
import Activity from "../src/models/activity.model.js";
import Lead from "../src/models/lead.model.js";
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

describe("Lead API", () => {
  test("public lead creation works without authentication and creates activity", async () => {
    const response = await request(app).post("/api/leads").send({
      name: "Rahul Sharma",
      email: "rahul@example.com",
      phone: "9999999999",
      company: "ABC Technologies",
      service: "Web Development",
      source: "website",
      message: "We need a new company website.",
    });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.lead.status).toBe("New");

    const lead = await Lead.findOne({ email: "rahul@example.com" });
    const activity = await Activity.findOne({ lead: lead._id, action: "lead_created" });

    expect(lead.assignedTo).toBeNull();
    expect(activity).toBeTruthy();
    expect(activity.performedBy).toBeNull();
  });

  test("member cannot use the Admin assignment endpoint and receives 403", async () => {
    const member = await createUser({ email: "member@example.com", role: "member" });
    const lead = await createLead();
    const memberCookie = await loginAs(member.email);

    const response = await request(app)
      .patch(`/api/leads/${lead._id}/assign`)
      .set("Cookie", memberCookie)
      .send({ assignedTo: member._id.toString() });

    expect(response.status).toBe(403);
    expect(response.body.success).toBe(false);
  });

  test("member cannot access another member's lead", async () => {
    const member = await createUser({ email: "member@example.com", role: "member" });
    const otherMember = await createUser({ email: "other@example.com", role: "member" });
    const otherLead = await createLead({ assignedTo: otherMember._id });
    const memberCookie = await loginAs(member.email);

    const response = await request(app).get(`/api/leads/${otherLead._id}`).set("Cookie", memberCookie);

    expect(response.status).toBe(403);
  });

  test("member cannot update status for another member's lead", async () => {
    const member = await createUser({ email: "member@example.com", role: "member" });
    const otherMember = await createUser({ email: "other@example.com", role: "member" });
    const otherLead = await createLead({ assignedTo: otherMember._id });
    const memberCookie = await loginAs(member.email);

    const response = await request(app)
      .patch(`/api/leads/${otherLead._id}/status`)
      .set("Cookie", memberCookie)
      .send({ status: "Contacted" });

    expect(response.status).toBe(403);
  });

  test("admin assigns lead and activity is created", async () => {
    const admin = await createUser({ email: "admin@example.com", role: "admin" });
    const member = await createUser({ email: "member@example.com", role: "member" });
    const lead = await createLead();
    const adminCookie = await loginAs(admin.email);

    const response = await request(app)
      .patch(`/api/leads/${lead._id}/assign`)
      .set("Cookie", adminCookie)
      .send({ assignedTo: member._id.toString() });

    expect(response.status).toBe(200);
    expect(response.body.data.lead.assignedTo.email).toBe("member@example.com");

    const activity = await Activity.findOne({ lead: lead._id, action: "lead_assigned" });
    expect(activity.meta.to).toBe(member._id.toString());
  });

  test("assigned member status update flow works and logs activity", async () => {
    const member = await createUser({ email: "member@example.com", role: "member" });
    const lead = await createLead({ assignedTo: member._id });
    const memberCookie = await loginAs(member.email);

    const response = await request(app)
      .patch(`/api/leads/${lead._id}/status`)
      .set("Cookie", memberCookie)
      .send({ status: "Contacted" });

    expect(response.status).toBe(200);
    expect(response.body.data.lead.status).toBe("Contacted");

    const activity = await Activity.findOne({ lead: lead._id, action: "status_changed" });
    expect(activity.meta.from).toBe("New");
    expect(activity.meta.to).toBe("Contacted");
  });

  test("assigned member adds note and activity is created", async () => {
    const member = await createUser({ email: "member@example.com", role: "member" });
    const lead = await createLead({ assignedTo: member._id });
    const memberCookie = await loginAs(member.email);

    const response = await request(app)
      .post(`/api/leads/${lead._id}/notes`)
      .set("Cookie", memberCookie)
      .send({ text: "Customer requested a proposal by Friday." });

    expect(response.status).toBe(200);
    expect(response.body.data.lead.notes).toHaveLength(1);
    expect(response.body.data.lead.notes[0].author.email).toBe("member@example.com");
    expect(response.body.data.lead.notes[0].createdAt).toBeTruthy();

    const activity = await Activity.findOne({ lead: lead._id, action: "note_added" });
    expect(activity).toBeTruthy();
  });
});
