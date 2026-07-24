import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { leadApi } from "../../api/leadApi.js";
import { getApiError } from "../../utils/getApiError.js";

export const fetchLeads = createAsyncThunk("leads/fetchLeads", async (params, { rejectWithValue }) => {
  try {
    const response = await leadApi.getLeads(params);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(getApiError(error, "We couldn't load the leads."));
  }
});

export const fetchLeadById = createAsyncThunk("leads/fetchLeadById", async (id, { rejectWithValue }) => {
  try {
    const response = await leadApi.getLeadById(id);
    return response.data.data.lead;
  } catch (error) {
    return rejectWithValue(getApiError(error, "We couldn't load this lead."));
  }
});

export const fetchLeadActivity = createAsyncThunk("leads/fetchLeadActivity", async (id, { rejectWithValue }) => {
  try {
    const response = await leadApi.getLeadActivity(id);
    return response.data.data.activities;
  } catch (error) {
    return rejectWithValue(getApiError(error, "We couldn't load activity."));
  }
});

export const changeLeadStatus = createAsyncThunk("leads/changeStatus", async ({ id, status }, { rejectWithValue }) => {
  try {
    const response = await leadApi.updateLeadStatus(id, status);
    return response.data.data.lead;
  } catch (error) {
    return rejectWithValue(getApiError(error, "Could not update status."));
  }
});

export const assignLeadToUser = createAsyncThunk("leads/assignLead", async ({ id, assignedTo }, { rejectWithValue }) => {
  try {
    const response = await leadApi.assignLead(id, assignedTo);
    return response.data.data.lead;
  } catch (error) {
    return rejectWithValue(getApiError(error, "Could not assign lead."));
  }
});

export const addNoteToLead = createAsyncThunk("leads/addNote", async ({ id, text }, { rejectWithValue }) => {
  try {
    const response = await leadApi.addLeadNote(id, text);
    return response.data.data.lead;
  } catch (error) {
    return rejectWithValue(getApiError(error, "Could not add note."));
  }
});

const leadSlice = createSlice({
  name: "leads",
  initialState: {
    items: [],
    selectedLead: null,
    activity: [],
    pagination: null,
    filters: { status: "", assignedTo: "" },
    status: "idle",
    detailStatus: "idle",
    activityStatus: "idle",
    mutationStatus: "idle",
    error: null,
    detailError: null,
    activityError: null,
    mutationError: null,
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearSelectedLead: (state) => {
      state.selectedLead = null;
      state.activity = [];
      state.detailError = null;
      state.activityError = null;
    },
    clearMutationError: (state) => {
      state.mutationError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeads.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchLeads.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.leads;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchLeads.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchLeadById.pending, (state) => {
        state.detailStatus = "loading";
        state.detailError = null;
      })
      .addCase(fetchLeadById.fulfilled, (state, action) => {
        state.detailStatus = "succeeded";
        state.selectedLead = action.payload;
      })
      .addCase(fetchLeadById.rejected, (state, action) => {
        state.detailStatus = "failed";
        state.detailError = action.payload;
      })
      .addCase(fetchLeadActivity.pending, (state) => {
        state.activityStatus = "loading";
        state.activityError = null;
      })
      .addCase(fetchLeadActivity.fulfilled, (state, action) => {
        state.activityStatus = "succeeded";
        state.activity = action.payload;
      })
      .addCase(fetchLeadActivity.rejected, (state, action) => {
        state.activityStatus = "failed";
        state.activityError = action.payload;
      })
      .addCase(changeLeadStatus.pending, (state) => {
        state.mutationStatus = "loading";
        state.mutationError = null;
      })
      .addCase(changeLeadStatus.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
        state.selectedLead = action.payload;
      })
      .addCase(changeLeadStatus.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.mutationError = action.payload;
      })
      .addCase(assignLeadToUser.pending, (state) => {
        state.mutationStatus = "loading";
        state.mutationError = null;
      })
      .addCase(assignLeadToUser.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
        state.selectedLead = action.payload;
      })
      .addCase(assignLeadToUser.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.mutationError = action.payload;
      })
      .addCase(addNoteToLead.pending, (state) => {
        state.mutationStatus = "loading";
        state.mutationError = null;
      })
      .addCase(addNoteToLead.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
        state.selectedLead = action.payload;
      })
      .addCase(addNoteToLead.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.mutationError = action.payload;
      });
  },
});

export const { clearMutationError, clearSelectedLead, setFilters } = leadSlice.actions;
export default leadSlice.reducer;
