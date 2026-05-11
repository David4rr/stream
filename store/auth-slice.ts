/**
 * Auth Slice - Consolidated
 *
 * Menggabungkan slice dan thunks untuk mengurangi boilerplate.
 * Menggunakan createAsyncThunk untuk async operations.
 */

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { register as registerAction } from "@/app/actions/auth/register";
import { login as loginAction } from "@/app/actions/auth/login";
import { me as meAction } from "@/app/actions/auth/me";
import { logout as logoutAction } from "@/app/actions/auth/logout";
import { getGoogleUser } from "@/app/actions/auth/google-me";
import { updateProfile as updateProfileAction } from "@/app/actions/auth/update-profile";

// ============================================================================
// TYPES
// ============================================================================

export type AuthStatus = "idle" | "loading" | "success" | "error";

export interface User {
  id: string;
  username: string;
  email: string;
  displayName?: string;
  avatarUrl?: string;
  isActive?: number;
  isFree?: boolean;
  subscriptionType?: string | null;
  subscriptionStart?: string | null;
  subscriptionEnd?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthState {
  user: User | null;
  status: AuthStatus;
  error: string | null;
  fieldErrors: Record<string, string>;
  /** True once the initial fetchUser check has completed (success or failure). */
  hydrated: boolean;
  /** Separate loading state for fetchUser to avoid hydration mismatch with form submission */
  isFetching: boolean;
}

interface LoginCredentials {
  username: string;
  password: string;
}

interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

interface UpdateProfileCredentials {
  userId: string;
  username: string;
  email: string;
  displayName: string;
}

// ============================================================================
// ASYNC THUNKS
// ============================================================================

export const logout = createAsyncThunk(
  "auth/logout",
  async () => {
    try {
      await logoutAction();
      return null;
    } catch (error) {
      return null;
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async ({ username, password }: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await loginAction({ username, password });

      if (!response.success) {
        return rejectWithValue({
          error: response.error,
          fields: response.fields || {},
        });
      }

      return {
        user: response.data.user,
      };
    } catch (error) {
      return rejectWithValue({
        error: error instanceof Error ? error.message : "Login gagal",
        fields: {},
      });
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async ({ name, email, password }: RegisterCredentials, { rejectWithValue }) => {
    try {
      const response = await registerAction({ name, email, password });

      if (!response.success) {
        return rejectWithValue({
          error: response.error,
          fields: response.fields || {},
        });
      }

      return {
        user: response.data.user,
      };
    } catch (error) {
      return rejectWithValue({
        error: error instanceof Error ? error.message : "Registrasi gagal",
        fields: {},
      });
    }
  }
);

export const fetchUser = createAsyncThunk(
  "auth/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await meAction();

      if (!response.success) {
        return rejectWithValue({
          error: response.error,
        });
      }

      return {
        user: response.user,
      };
    } catch (error) {
      return rejectWithValue({
        error: error instanceof Error ? error.message : "Failed to fetch user",
      });
    }
  }
);

export const fetchGoogleUser = createAsyncThunk(
  "auth/fetchGoogleUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getGoogleUser();

      if (!response.success) {
        return rejectWithValue({
          error: response.error,
        });
      }

      return {
        user: response.user,
      };
    } catch (error) {
      return rejectWithValue({
        error: error instanceof Error ? error.message : "Failed to fetch Google user",
      });
    }
  }
);

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (data: UpdateProfileCredentials, { rejectWithValue }) => {
    try {
      const response = await updateProfileAction(data);

      if (!response.success) {
        return rejectWithValue({
          error: response.error,
          fields: response.fields || {},
        });
      }

      return {
        user: response.data,
      };
    } catch (error) {
      return rejectWithValue({
        error: error instanceof Error ? error.message : "Update profil gagal",
        fields: {},
      });
    }
  }
);

// ============================================================================
// SLICE
// ============================================================================

const initialState: AuthState = {
  user: null,
  status: "idle",
  error: null,
  fieldErrors: {},
  hydrated: false,
  isFetching: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetStatus: (state) => {
      state.status = "idle";
      state.error = null;
      state.fieldErrors = {};
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "success";
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "error";
        const errorPayload = action.payload as { error?: string; fields?: Record<string, string> } | string;
        if (typeof errorPayload === "string") {
          state.error = errorPayload;
        } else {
          state.error = errorPayload.error || "Login gagal";
          state.fieldErrors = errorPayload.fields || {};
        }
        state.user = null;
      });

    // Register
    builder
      .addCase(register.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.fieldErrors = {};
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = "success";
        state.user = action.payload.user;
        state.error = null;
        state.fieldErrors = {};
      })
      .addCase(register.rejected, (state, action) => {
        state.status = "error";
        const errorPayload = action.payload as { error?: string; fields?: Record<string, string> } | string;
        if (typeof errorPayload === "string") {
          state.error = errorPayload;
          state.fieldErrors = {};
        } else {
          state.error = errorPayload.error || "Registrasi gagal";
          state.fieldErrors = errorPayload.fields || {};
        }
        state.user = null;
      });

    // Fetch User (uses separate isFetching state to avoid hydration mismatch)
    builder
      .addCase(fetchUser.pending, (state) => {
        state.isFetching = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.isFetching = false;
        state.status = "success";
        state.user = action.payload.user;
        state.error = null;
        state.hydrated = true;
      })
      .addCase(fetchUser.rejected, (state) => {
        state.isFetching = false;
        // "No session" is a normal unauthenticated state, not a user-facing error.
        // Use "idle" (not "error") so auth pages don't display an error message.
        state.status = "idle";
        state.error = null;
        // Hanya set user ke null jika memang belum ada user (bukan setelah login)
        // Jangan override user yang sudah ada dari login/register
        if (!state.user) {
          state.user = null;
        }
        state.hydrated = true;
      });

    // Fetch Google User
    builder
      .addCase(fetchGoogleUser.pending, (state) => {
        state.isFetching = true;
        state.error = null;
      })
      .addCase(fetchGoogleUser.fulfilled, (state, action) => {
        state.isFetching = false;
        state.status = "success";
        state.user = action.payload.user;
        state.error = null;
        state.hydrated = true;
      })
      .addCase(fetchGoogleUser.rejected, (state) => {
        state.isFetching = false;
        // "No session" is a normal unauthenticated state
        state.status = "idle";
        state.error = null;
        state.user = null;
        state.hydrated = true;
      });

    // Logout
    builder
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.status = "idle";
        state.error = null;
        state.fieldErrors = {};
      });

    // Update Profile
    builder
      .addCase(updateProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.fieldErrors = {};
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.status = "success";
        state.user = action.payload.user;
        state.error = null;
        state.fieldErrors = {};
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.status = "error";
        const errorPayload = action.payload as { error?: string; fields?: Record<string, string> } | string;
        if (typeof errorPayload === "string") {
          state.error = errorPayload;
        } else {
          state.error = errorPayload.error || "Update profil gagal";
          state.fieldErrors = errorPayload.fields || {};
        }
      });
  },
});

// ============================================================================
// EXPORTS
// ============================================================================

export const { resetStatus, updateUser } = authSlice.actions;
export default authSlice.reducer;

// ============================================================================
// SELECTORS
// ============================================================================

export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectAuthStatus = (state: { auth: AuthState }) => state.auth.status;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;
export const selectFieldErrors = (state: { auth: AuthState }) => state.auth.fieldErrors;
export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  state.auth.user !== null;
export const selectIsLoading = (state: { auth: AuthState }) =>
  state.auth.status === "loading";
export const selectIsFetching = (state: { auth: AuthState }) =>
  state.auth.isFetching;
export const selectIsHydrated = (state: { auth: AuthState }) =>
  state.auth.hydrated;
