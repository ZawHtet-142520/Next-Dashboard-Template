/**
 * React Query Hooks
 *
 * This module exports all React Query hooks for data fetching and mutations.
 * Organized by category for easy imports.
 */

// Authentication Mutations
export { useLogin } from "./auth/useLogin";
export { useForgetPassword } from "./auth/useForgetPassword";
export { useVerifyOtp } from "./auth/useVerifyOtp";
export { useResetPassword } from "./auth/useResetPassword";

// Data Fetching Queries
export { useUserProfile } from "./user/useUserProfile";
export { useDashboardStats } from "./dashboard/useDashboardStats";
export { useRoles } from "./role/useRoles";
export { usePermissionNames } from "./role/usePermissionNames";
export { useAdmins } from "./admin/useAdmins";

// Role Mutations
export { useCreateRole } from "./role/useCreateRole";
export { useUpdateRole } from "./role/useUpdateRole";
export { useDeleteRole } from "./role/useDeleteRole";

// Admin Mutations
export { useCreateAdmin } from "./admin/useCreateAdmin";
export { useUpdateAdmin } from "./admin/useUpdateAdmin";
export { useDeleteAdmin } from "./admin/useDeleteAdmin";
