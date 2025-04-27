import { CustomBreadCrumb } from "@/components/custom-bread-crumb";
import Box from "../search/_components/box";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import NameForm from "./_components/name-form";
import { db } from "@/lib/db";
import EmailForm from "./_components/email-form";
import ContactForm from "./_components/contact-form";
import ResumeForm from "./_components/resume";

const ProfilePage = async () => {
  const { userId } = auth();
  const user = await currentUser();

  if (!userId) {
    redirect("/sign-in");
  }

  const profile = await db.userProfile.findUnique({
    where: {
      userId,
    },
    include: {
      resumes: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  return (
    <div className="flex flex-col items-center justify-center p-0 md:p-10 bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen">
      <Box className="w-full max-w-3xl bg-opacity-70 shadow-none border-none">
        <CustomBreadCrumb breadCrumbPage="My Profile" />
      </Box>
      <Box className="flex flex-col md:flex-row items-center md:items-start gap-8 p-8 rounded-2xl border-0 shadow-xl mt-6 w-full max-w-4xl bg-white/90 backdrop-blur-md">
        {user && user.hasImage && (
          <div className="relative w-36 h-36 rounded-full shadow-lg ring-4 ring-blue-200 flex-shrink-0">
            <Image
              fill
              className="object-cover w-full h-full rounded-full"
              alt="User Profile Pic"
              src={user.imageUrl}
            />
          </div>
        )}
        <div className="w-full space-y-8 text-black flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <NameForm initialData={profile} userId={userId} />
            <EmailForm initialData={profile} userId={userId} />
            <ContactForm initialData={profile} userId={userId} />
          </div>
          <ResumeForm initialData={profile} userId={userId} />
        </div>
      </Box>
    </div>
  );
};

export default ProfilePage;
