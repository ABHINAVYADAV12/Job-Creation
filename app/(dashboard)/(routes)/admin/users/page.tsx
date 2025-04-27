import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { UserCog } from "lucide-react";
import { UserManagementTable } from "@/app/(dashboard)/_components/user-management-table";

const UserManagementPage = async () => {
  const { userId } = auth();
  if (!userId) return redirect("/");
  const userProfile = await db.userProfile.findUnique({ where: { userId } });
  if (!userProfile || userProfile.role !== "admin") return redirect("/");

  const users = await db.userProfile.findMany({});

  // Map null fields to empty string for table props
  const safeUsers = users.map(u => ({
    userId: u.userId,
    fullName: u.fullName || "",
    email: u.email || "",
    role: u.role || "user"
  }));

  return (
    <div className="p-8 max-w-3xl mx-auto text-black">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2 text-black">
        <UserCog className="w-7 h-7 text-blue-600" /> User Management
      </h1>
      <UserManagementTable users={safeUsers} />
    </div>
  );
};

export default UserManagementPage;
