import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { leadRequestApi } from "../../api/leadRequestApi.js";
import { getApiError } from "../../utils/getApiError.js";

export const requestLead = createAsyncThunk(
  "leadRequests/requestLead",
  async (leadId, { rejectWithValue }) => {
    try {
      return await leadRequestApi.requestLead(leadId);
    } catch (error) {
      return rejectWithValue(getApiError(error, "Failed to send lead request."));
    }
  }
);

export const fetchLeadRequests = createAsyncThunk(
  "leadRequests/fetchLeadRequests",
  async (_, { rejectWithValue }) => {
    try {
      return await leadRequestApi.getLeadRequests();
    } catch (error) {
      return rejectWithValue(getApiError(error, "Failed to load lead requests."));
    }
  }
);

export const fetchMyLeadRequests = createAsyncThunk(
  "leadRequests/fetchMyLeadRequests",
  async (_, { rejectWithValue }) => {
    try {
      return await leadRequestApi.getMyLeadRequests();
    } catch (error) {
      return rejectWithValue(getApiError(error, "Failed to load your lead requests."));
    }
  }
);

export const approveLeadRequest = createAsyncThunk(
  "leadRequests/approveLeadRequest",
  async (requestId, { rejectWithValue }) => {
    try {
      return await leadRequestApi.approveLeadRequest(requestId);
    } catch (error) {
      return rejectWithValue(getApiError(error, "Failed to approve lead request."));
    }
  }
);

export const rejectLeadRequest = createAsyncThunk(
  "leadRequests/rejectLeadRequest",
  async (requestId, { rejectWithValue }) => {
    try {
      return await leadRequestApi.rejectLeadRequest(requestId);
    } catch (error) {
      return rejectWithValue(getApiError(error, "Failed to reject lead request."));
    }
  }
);

const leadRequestSlice = createSlice({
  name: "leadRequests",
  initialState: {
    items: [],
    myRequests: [],
    status: "idle",
    error: null,
    actionStatus: "idle",
    actionError: null,
  },
  reducers: {
    clearLeadRequestError: (state) => {
      state.error = null;
      state.actionError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // requestLead
      .addCase(requestLead.pending, (state) => {
        state.actionStatus = "loading";
        state.actionError = null;
      })
      .addCase(requestLead.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        state.myRequests.unshift(action.payload);
      })
      .addCase(requestLead.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.actionError = action.payload;
      })
      // fetchLeadRequests
      .addCase(fetchLeadRequests.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchLeadRequests.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchLeadRequests.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // fetchMyLeadRequests
      .addCase(fetchMyLeadRequests.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMyLeadRequests.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.myRequests = action.payload;
      })
      .addCase(fetchMyLeadRequests.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // approveLeadRequest
      .addCase(approveLeadRequest.fulfilled, (state, action) => {
        state.items = state.items.map((item) =>
          item._id === action.payload._id ? action.payload : item
        );
      })
      // rejectLeadRequest
      .addCase(rejectLeadRequest.fulfilled, (state, action) => {
        state.items = state.items.map((item) =>
          item._id === action.payload._id ? action.payload : item
        );
      });
  },
});

export const { clearLeadRequestError } = leadRequestSlice.actions;
export default leadRequestSlice.reducer;
