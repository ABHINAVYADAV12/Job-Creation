import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { userId: string } }) {
  try {
    const { userId: adminId } = auth();
    if (!adminId) return new NextResponse("Unauthorized", { status: 401 });
    const adminProfile = await db.userProfile.findUnique({ where: { userId: adminId } });
    if (!adminProfile || adminProfile.role !== "admin") {
      return new NextResponse("Forbidden", { status: 403 });
    }
    const { role } = await req.json();
    if (!role || !["admin", "user"].includes(role)) {
      return new NextResponse("Invalid role", { status: 400 });
    }
    const updated = await db.userProfile.update({
      where: { userId: params.userId },
      data: { role },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("[USER_ROLE_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
