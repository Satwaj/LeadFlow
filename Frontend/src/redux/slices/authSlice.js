import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authApi } from "../../api/authApi.js";
import { getApiError } from "../../utils/getApiError.js";

export const login = createAsyncThunk("auth/login", async (payload, { rejectWithValue }) => {
  try {
    const response = await authApi.login(payload);
    return response.data.data.user;
  } catch (error) {
    return rejectWithValue(getApiError(error, "Invalid email or password."));
  }
});

export const restoreSession = createAsyncThunk("auth/restoreSession", async (_, { rejectWithValue }) => {
  try {
    const response = await authApi.getCurrentUser();
    return response.data.data.user;
  } catch (error) {
    return rejectWithValue(getApiError(error));
  }
});

export const logout = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
  try {
    await authApi.logout();
    return true;
  } catch (error) {
    return rejectWithValue(getApiError(error, "Logout failed."));
  }
});

export const fetchUsers = createAsyncThunk("auth/fetchUsers", async (_, { rejectWithValue }) => {
  try {
    const response = await authApi.getUsers();
    return response.data.data.users;
  } catch (error) {
    return rejectWithValue(getApiError(error, "Could not load users."));
  }
});

export const registerPublicMember = createAsyncThunk("auth/registerPublicMember", async (payload, { rejectWithValue }) => {
  try {
    const response = await authApi.registerPublicMember(payload);
    return response.data.data.user;
  } catch (error) {
    return rejectWithValue(getApiError(error, "Registration failed. Please try again."));
  }
});

export const createUserByAdmin = createAsyncThunk("auth/createUserByAdmin", async (payload, { rejectWithValue }) => {
  try {
    const response = await authApi.createUserByAdmin(payload);
    return response.data.data.user;
  } catch (error) {
    return rejectWithValue(getApiError(error, "Failed to create user account."));
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    users: [],
    isAuthenticated: false,
    status: "idle",
    sessionChecked: false,
    error: null,
    usersStatus: "idle",
    usersError: null,
    registerStatus: "idle",
    registerError: null,
    createUserStatus: "idle",
    createUserError: null,
  },
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
      state.registerError = null;
      state.createUserError = null;
    },
    clearRegisterState: (state) => {
      state.registerStatus = "idle";
      state.registerError = null;
    },
    clearCreateUserState: (state) => {
      state.createUserStatus = "idle";
      state.createUserError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.isAuthenticated = true;
        state.sessionChecked = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.isAuthenticated = false;
        state.sessionChecked = true;
      })
      .addCase(registerPublicMember.pending, (state) => {
        state.registerStatus = "loading";
        state.registerError = null;
      })
      .addCase(registerPublicMember.fulfilled, (state) => {
        state.registerStatus = "succeeded";
        state.registerError = null;
      })
      .addCase(registerPublicMember.rejected, (state, action) => {
        state.registerStatus = "failed";
        state.registerError = action.payload;
      })
      .addCase(createUserByAdmin.pending, (state) => {
        state.createUserStatus = "loading";
        state.createUserError = null;
      })
      .addCase(createUserByAdmin.fulfilled, (state, action) => {
        state.createUserStatus = "succeeded";
        state.createUserError = null;
        if (action.payload) {
          state.users.push(action.payload);
        }
      })
      .addCase(createUserByAdmin.rejected, (state, action) => {
        state.createUserStatus = "failed";
        state.createUserError = action.payload;
      })
      .addCase(restoreSession.pending, (state) => {
        state.status = "loading";
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.isAuthenticated = true;
        state.sessionChecked = true;
      })
      .addCase(restoreSession.rejected, (state) => {
        state.status = "idle";
        state.user = null;
        state.isAuthenticated = false;
        state.sessionChecked = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.users = [];
        state.isAuthenticated = false;
        state.status = "idle";
        state.sessionChecked = true;
      })
      .addCase(fetchUsers.pending, (state) => {
        state.usersStatus = "loading";
        state.usersError = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.usersStatus = "succeeded";
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.usersStatus = "failed";
        state.usersError = action.payload;
      });
  },
});

export const { clearAuthError, clearRegisterState, clearCreateUserState } = authSlice.actions;
export default authSlice.reducer;
