import api from "./axiosInstance.js";

export const leadApi = {
  createLead: (payload) => api.post("/leads", payload),
  getLeads: (params) => api.get("/leads", { params }),
  getLeadById: (id) => api.get(`/leads/${id}`),
  updateLeadStatus: (id, status) => api.patch(`/leads/${id}/status`, { status }),
  assignLead: (id, assignedTo) => api.patch(`/leads/${id}/assign`, { assignedTo }),
  addLeadNote: (id, text) => api.post(`/leads/${id}/notes`, { text }),
  getLeadActivity: (id) => api.get(`/leads/${id}/activity`),
};
