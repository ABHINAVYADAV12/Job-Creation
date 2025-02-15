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
    <div className="flex flex-col items-center justify-center p-6 md:p-10 bg-gray-50 min-h-screen">
      <Box className="w-full max-w-3xl">
        <CustomBreadCrumb breadCrumbPage="My Profile" />
      </Box>
      <Box className="flex flex-col items-center p-6 rounded-lg border shadow-sm mt-6 w-full max-w-3xl bg-white space-y-8">
        {user && user.hasImage && (
          <div className="relative w-24 h-24 rounded-full shadow-md">
            <Image
              fill
              className="object-cover w-full h-full rounded-full"
              alt="User Profile Pic"
              src={user.imageUrl}
            />
          </div>
        )}

        <div className="w-full space-y-6 text-black">
          <NameForm initialData={profile} userId={userId} />
          <EmailForm initialData={profile} userId={userId} />
          <ContactForm initialData={profile} userId={userId} />
          <ResumeForm initialData={profile} userId={userId} />
        </div>
      </Box>
    </div>
  );
};

export default ProfilePage;
