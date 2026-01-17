# Queries Folder

This folder contains all React Query hooks for data fetching (queries) and data mutations.

## Purpose

The `queries/` folder is dedicated to React Query hooks (`useQuery` and `useMutation`), separating them from other custom hooks in the `hooks/` folder. This provides better organization and makes it clear which hooks interact with the API.

## Structure

```
queries/
├── index.ts                    # Barrel exports for easy imports
├── useLogin.ts                 # Login mutation
├── useForgetPassword.ts        # Forget password mutation
├── useVerifyOtp.ts            # OTP verification mutation
├── useResetPassword.ts        # Password reset mutation
├── useUserProfile.ts          # User profile query
└── useDashboardStats.ts       # Dashboard statistics query
```

## Naming Conventions

- **Mutations** (POST, PUT, DELETE): `use<Action>.ts`
  - Examples: `useLogin.ts`, `useCreateUser.ts`, `useUpdateProfile.ts`
- **Queries** (GET): `use<Resource>.ts` or `use<Resource>List.ts`
  - Examples: `useUserProfile.ts`, `useUsers.ts`, `useDashboardStats.ts`

## Usage

### Import Individual Hooks

```typescript
import { useLogin } from "@/queries/useLogin";
import { useUserProfile } from "@/queries/useUserProfile";
```

### Import Multiple Hooks (via index)

```typescript
import { useLogin, useUserProfile, useDashboardStats } from "@/queries";
```

## Examples

### Mutation Hook (useLogin.ts)

```typescript
import { useMutation } from "@tanstack/react-query";
import { login } from "@/services/authService";

export const useLogin = () => {
  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      // Handle success
    },
    onError: (error) => {
      // Handle error
    },
  });
};
```

### Query Hook (useUserProfile.ts)

```typescript
import { useQuery } from "@tanstack/react-query";
import { fetchUserProfile } from "@/services/userService";

export const useUserProfile = () => {
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: fetchUserProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
```

## When to Add a New Query Hook

Create a new query hook when:
1. You need to fetch data from an API endpoint (GET request)
2. You need to perform a mutation (POST, PUT, DELETE request)
3. The operation requires caching, loading states, or error handling
4. The operation is used in multiple components

## Related Files

- **`src/services/`** - API service functions that queries call
- **`src/providers/theme-provider.tsx`** - QueryClient configuration
- **`src/hooks/`** - Non-query custom React hooks (like `useAuthGuard`)
- **`REACT_QUERY_GUIDE.md`** - Comprehensive guide on using React Query

## Best Practices

1. **Keep hooks thin** - Business logic should be in services, not in query hooks
2. **Use proper query keys** - Unique, descriptive keys for each query
3. **Configure appropriately** - Set staleTime, retry, and other options based on data requirements
4. **Handle errors gracefully** - Use onError callbacks for user-friendly error messages
5. **Leverage caching** - Use React Query's caching to reduce API calls
6. **Document complex hooks** - Add JSDoc comments for hooks with special behavior

## Current Implementations

### Mutations ✅
- `useLogin` - User authentication
- `useForgetPassword` - Request password reset
- `useVerifyOtp` - Verify OTP code
- `useResetPassword` - Reset password with token

### Queries ✅
- `useUserProfile` - Fetch current user profile
- `useDashboardStats` - Fetch dashboard statistics

### Planned
- `useUsers` - Fetch user list with pagination
- `useUpdateProfile` - Update user profile
- `useNotifications` - Fetch notifications
- Add more as needed for your application
