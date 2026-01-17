/**
 * React Query Hooks
 * 
 * This module exports all React Query hooks for data fetching and mutations.
 * Organized by category for easy imports.
 */

// Authentication Mutations
export { useLogin } from "./useLogin";
export { useForgetPassword } from "./useForgetPassword";
export { useVerifyOtp } from "./useVerifyOtp";
export { useResetPassword } from "./useResetPassword";

// Data Fetching Queries
export { useUserProfile } from "./useUserProfile";
export { useDashboardStats } from "./useDashboardStats";
