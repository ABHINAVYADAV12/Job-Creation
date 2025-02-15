import { storage } from "@/config/firebase.config";
import { db } from "@/lib/db";
import { deleteObject, ref } from "firebase/storage";
import { NextResponse } from "next/server";


export const DELETE = async (request: Request) => {
  try {
    const { userId, resumeId } = await request.json();

    // Check for unauthorized access
    if (!userId) {
      return new NextResponse("Un-Authorized", { status: 401 });
    }

    // Find the resume in the database
    const resume = await db.resumes.findUnique({
      where: {
        id: resumeId,
      },
    });

    // Check if the resume exists
    if (!resume || resume.id !== resumeId) {
      return new NextResponse("Resume not found", { status: 404 });
    }

    // Delete the resume from Firebase storage
    const storageRef = ref(storage, resume.url);
    await deleteObject(storageRef);

    // Delete the resume from the database
    await db.resumes.delete({
      where: {
        id: resumeId,
      },
    });

    return NextResponse.json({ message: "Resume deleted successfully" });
  } catch (error) {
    console.error(`[DELETE_ERROR]: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
