"use client";
import { useState } from "react";
import { User2, ShieldCheck, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const colorMap: Record<string, string> = {
  admin: "bg-blue-100 text-black border-blue-400",
  user: "bg-gray-100 text-black border-gray-400",
};

interface UserManagementTableProps {
  users: Array<{
    userId: string;
    fullName: string;
    email: string;
    role: string;
  }>;
}

export function UserManagementTable({ users }: UserManagementTableProps) {
  const [search, setSearch] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [filtered, setFiltered] = useState(users);

  // Dynamic search filter
  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setSearch(value);
    setFiltered(
      users.filter(
        (u) =>
          u.fullName.toLowerCase().includes(value.toLowerCase()) ||
          u.email.toLowerCase().includes(value.toLowerCase())
      )
    );
  }

  async function handleRoleChange(userId: string, role: string) {
    setLoadingId(userId);
    await fetch(`/api/users/${userId}/role`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    window.location.reload();
  }

  return (
    <div className="rounded-lg shadow border border-gray-200 bg-white p-6">
      <div className="flex items-center gap-2 mb-6">
        <Search className="w-5 h-5 text-gray-400" />
        <input
          type="text"
          className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-200 text-black"
          placeholder="Search by name or email..."
          value={search}
          onChange={handleSearch}
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-black">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-black uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100 text-black">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-400">No users found.</td>
              </tr>
            ) : (
              filtered.map((u) => (
                <tr key={u.userId} className="hover:bg-blue-50 transition text-black">
                  <td className="px-6 py-4 whitespace-nowrap font-medium flex items-center gap-2 text-black">
                    <User2 className="w-5 h-5 text-gray-400" /> {u.fullName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-black">{u.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-black">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold border ${colorMap[u.role] || colorMap['user']}`}> 
                      {u.role === "admin" ? <ShieldCheck className="w-4 h-4 text-blue-500" /> : <User2 className="w-4 h-4 text-gray-500" />} 
                      {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-black">
                    <Button
                      type="button"
                      variant={u.role === 'admin' ? 'destructive' : 'default'}
                      size="sm"
                      className="rounded-full px-4 flex items-center justify-center"
                      disabled={loadingId === u.userId}
                      onClick={() => handleRoleChange(u.userId, u.role === 'admin' ? 'user' : 'admin')}
                    >
                      {loadingId === u.userId ? (
                        <Loader2 className="animate-spin w-4 h-4 mr-2" />
                      ) : null}
                      {u.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
