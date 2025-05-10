"use client";

import AcademicTrendsPage from "@/components/academic-trends-page";
import EditProfileModal from "@/components/edit-profile-modal";
import Navbar from "@/components/navbar";
import { useState } from "react";

interface ProfileFormValues {
  name: string;
  email: string;
  phone: string;
  branch: string;
  semester: string;
  section: string;
}

export default function Home() {
  const [profile, setProfile] = useState<ProfileFormValues>({
    name: "Student Name",
    email: "example@example.com",
    phone: "+91 9123456789",
    branch: "Computer Science",
    semester: "4th",
    section: "CS-B",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEditProfile = () => {
    setIsModalOpen(true);
  };

  const handleSaveProfile = (updatedProfile: ProfileFormValues) => {
    setProfile(updatedProfile);
    setIsModalOpen(false);
  };

  return (
    <>
      <Navbar onEditProfile={handleEditProfile} />
      <EditProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialProfile={profile}
        onSave={handleSaveProfile}
      />
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <AcademicTrendsPage  />
      </main>
    </>
  );
}
