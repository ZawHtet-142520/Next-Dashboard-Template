# React Query Usage Guide

This project uses [@tanstack/react-query](https://tanstack.com/query) for efficient data fetching and state management.

## Overview

React Query provides two main hooks:
- **`useQuery`** - For fetching/reading data (GET requests)
- **`useMutation`** - For creating/updating/deleting data (POST, PUT, DELETE requests)

## When to Use Query

Use `useQuery` when you need to:
- Fetch data from an API (GET requests)
- Display user profiles, lists, statistics, etc.
- Benefit from automatic caching and background refetching
- Show loading and error states automatically

### Example: User Profile

```typescript
// hooks/useUserProfile.ts
import { useQuery } from "@tanstack/react-query";
import { fetchUserProfile } from "@/services/userService";

export const useUserProfile = () => {
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: fetchUserProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// In your component
function ProfilePage() {
  const { data, isLoading, error } = useUserProfile();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>Hello, {data?.data.user.name}!</div>;
}
```

## When to Use Mutation

Use `useMutation` when you need to:
- Submit forms (login, registration, etc.)
- Create, update, or delete data
- Perform actions that change server state

### Example: Login (Already Implemented)

```typescript
// hooks/useLogin.ts
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

// In your component
function LoginForm() {
  const { mutate, isPending } = useLogin();

  const handleSubmit = (data) => {
    mutate(data);
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

## Query Configuration

### Global Defaults

The QueryClient is configured in `src/providers/theme-provider.tsx` with these defaults:

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: true,
      retry: 1,
    },
  },
});
```

### Per-Query Configuration

You can override defaults for specific queries:

```typescript
useQuery({
  queryKey: ["dashboardStats"],
  queryFn: fetchDashboardStats,
  staleTime: 2 * 60 * 1000, // 2 minutes
  refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  retry: 2,
});
```

## Best Practices

### 1. Query Keys

Use descriptive, unique query keys:

```typescript
// Good
queryKey: ["userProfile"]
queryKey: ["dashboardStats"]
queryKey: ["posts", { page: 1, limit: 10 }]

// Bad
queryKey: ["data"]
queryKey: ["fetch"]
```

### 2. Service Layer

Keep API calls in the `services/` directory:

```typescript
// services/userService.ts
export const fetchUserProfile = async () => {
  const response = await readClient.get("/v1/dashboard/user/profile");
  return response.data;
};
```

### 3. Custom Hooks

Wrap queries in custom hooks for reusability:

```typescript
// hooks/useUserProfile.ts
export const useUserProfile = () => {
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: fetchUserProfile,
  });
};
```

### 4. Error Handling

React Query automatically handles errors from the API:

```typescript
const { data, error, isLoading } = useQuery(...);

if (error) {
  // Error is automatically caught
  return <div>Error: {error.message}</div>;
}
```

### 5. Loading States

Use the built-in loading states:

```typescript
const { data, isLoading, isFetching } = useQuery(...);

// isLoading: First time loading
// isFetching: Any time data is being fetched (including background refetch)
```

## Example Implementations

### Example 1: Dashboard Statistics

```typescript
// services/dashboardService.ts
export const fetchDashboardStats = async () => {
  const response = await readClient.get("/v1/dashboard/stats");
  return response.data;
};

// hooks/useDashboardStats.ts
export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["dashboardStats"],
    queryFn: fetchDashboardStats,
    staleTime: 2 * 60 * 1000,
  });
};

// pages/dashboard/page.tsx
function Dashboard() {
  const { data, isLoading } = useDashboardStats();

  if (isLoading) return <Spinner />;

  return (
    <div>
      <StatCard title="Users" value={data?.data.totalUsers} />
      <StatCard title="Revenue" value={data?.data.totalRevenue} />
    </div>
  );
}
```

### Example 2: User List with Pagination

```typescript
// services/userService.ts
export const fetchUsers = async (page: number) => {
  const response = await readClient.get(`/v1/dashboard/users?page=${page}`);
  return response.data;
};

// hooks/useUsers.ts
export const useUsers = (page: number) => {
  return useQuery({
    queryKey: ["users", page],
    queryFn: () => fetchUsers(page),
  });
};

// pages/users/page.tsx
function UsersPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useUsers(page);

  return (
    <div>
      {isLoading ? <Spinner /> : <UserList users={data?.data} />}
      <Pagination page={page} onPageChange={setPage} />
    </div>
  );
}
```

## Advanced Features

### Invalidating Queries

After a mutation, you may want to refetch related queries:

```typescript
import { useQueryClient } from "@tanstack/react-query";

const queryClient = useQueryClient();

const mutation = useMutation({
  mutationFn: updateUser,
  onSuccess: () => {
    // Invalidate and refetch user profile
    queryClient.invalidateQueries({ queryKey: ["userProfile"] });
  },
});
```

### Dependent Queries

Fetch data that depends on other data:

```typescript
const { data: user } = useQuery({
  queryKey: ["user"],
  queryFn: fetchUser,
});

const { data: posts } = useQuery({
  queryKey: ["posts", user?.id],
  queryFn: () => fetchUserPosts(user?.id),
  enabled: !!user?.id, // Only run when user.id exists
});
```

### Optimistic Updates

Update UI immediately, before server responds:

```typescript
const mutation = useMutation({
  mutationFn: updateUser,
  onMutate: async (newUser) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: ["userProfile"] });

    // Snapshot previous value
    const previousUser = queryClient.getQueryData(["userProfile"]);

    // Optimistically update
    queryClient.setQueryData(["userProfile"], newUser);

    return { previousUser };
  },
  onError: (err, newUser, context) => {
    // Rollback on error
    queryClient.setQueryData(["userProfile"], context?.previousUser);
  },
});
```

## Resources

- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [Query Keys Guide](https://tanstack.com/query/latest/docs/framework/react/guides/query-keys)
- [Mutations Guide](https://tanstack.com/query/latest/docs/framework/react/guides/mutations)

## Current Implementation Status

✅ **Implemented:**
- QueryClient setup in theme provider
- Mutation hooks: `useLogin`, `useForgetPassword`, `useVerifyOtp`, `useResetPassword`

✅ **Example Implementations (Ready to Use):**
- `useUserProfile` - Fetch user profile data
- `useDashboardStats` - Fetch dashboard statistics

⚠️ **To Implement:**
- Connect hooks to actual API endpoints
- Add more query hooks as needed for your data fetching requirements
- Consider adding React Query DevTools for development
