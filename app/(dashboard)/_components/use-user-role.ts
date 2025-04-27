import { useEffect, useState } from "react";

export function useUserRole() {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRole() {
      try {
        const res = await fetch("/api/users/me");
        if (!res.ok) throw new Error("Failed to fetch user role");
        const user = await res.json();
        setRole(user.role);
      } catch {
        setRole(null);
      } finally {
        setLoading(false);
      }
    }
    fetchRole();
  }, []);

  return { role, loading };
}
