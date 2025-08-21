import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const { data: authData, isLoading } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  // Cast authData to the expected type
  const userData = authData as { user?: any } | undefined;

  // Set user role when authenticated (only if no role is already set)
  if (userData?.user && !localStorage.getItem('role')) {
    // Only set 'user' role if this isn't an admin session
    const adminRole = localStorage.getItem('adminUsername');
    if (!adminRole) {
      localStorage.setItem('role', 'user');
    }
  }

  return {
    user: userData?.user || null,
    isAuthenticated: !!userData?.user,
    isLoading,
  };
}
