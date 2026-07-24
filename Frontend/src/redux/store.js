import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice.js";
import leadReducer from "./slices/leadSlice.js";
import leadRequestReducer from "./slices/leadRequestSlice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    leads: leadReducer,
    leadRequests: leadRequestReducer,
  },
});
