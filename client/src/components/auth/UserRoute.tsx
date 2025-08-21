import { useEffect } from "react";
import { useLocation } from "wouter";

interface UserRouteProps {
  children: React.ReactNode;
}

export function UserRoute({ children }: UserRouteProps) {
  const [, setLocation] = useLocation();

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    
    if (userRole !== "user") {
      setLocation("/login");
    }
  }, [setLocation]);

  const userRole = localStorage.getItem("role");
  
  if (userRole !== "user") {
    return null;
  }

  return <>{children}</>;
}