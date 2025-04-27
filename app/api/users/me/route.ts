import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const userProfile = await db.userProfile.findUnique({
      where: { userId },
    });
    if (!userProfile) {
      return new NextResponse("User not found", { status: 404 });
    }
    return NextResponse.json(userProfile);
  } catch (error) {
    console.error("[USER_ME_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
