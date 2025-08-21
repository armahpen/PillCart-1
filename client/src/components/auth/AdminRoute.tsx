import { useEffect } from "react";
import { useLocation } from "wouter";

interface AdminRouteProps {
  children: React.ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
  const [, setLocation] = useLocation();

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    
    if (userRole !== "admin") {
      setLocation("/admin/login");
    }
  }, [setLocation]);

  const userRole = localStorage.getItem("role");
  
  if (userRole !== "admin") {
    return null;
  }

  return <>{children}</>;
}