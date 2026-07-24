import api from "./axiosInstance.js";

export const leadRequestApi = {
  requestLead: async (leadId) => {
    const response = await api.post(`/leads/${leadId}/request`);
    return response.data;
  },

  getLeadRequests: async () => {
    const response = await api.get("/lead-requests");
    return response.data;
  },

  getMyLeadRequests: async () => {
    const response = await api.get("/lead-requests/me");
    return response.data;
  },

  approveLeadRequest: async (requestId) => {
    const response = await api.patch(`/lead-requests/${requestId}/approve`);
    return response.data;
  },

  rejectLeadRequest: async (requestId) => {
    const response = await api.patch(`/lead-requests/${requestId}/reject`);
    return response.data;
  },
};
