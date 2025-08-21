import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const { data: authData, isLoading } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  // Set user role when authenticated
  if (authData?.user && !localStorage.getItem('role')) {
    localStorage.setItem('role', 'user');
  }

  return {
    user: authData?.user || null,
    isAuthenticated: !!authData?.user,
    isLoading,
  };
}
