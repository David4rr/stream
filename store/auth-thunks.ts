/**
 * Auth Thunks - Re-exports from auth-slice
 *
 * This file re-exports the async thunks from auth-slice for backward compatibility.
 * The actual implementation is in auth-slice.ts.
 */

export { login, register, fetchUser, logout } from "./auth-slice";
export type { User } from "./auth-slice";
