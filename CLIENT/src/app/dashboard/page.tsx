"use client";

import React, { useState} from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  BarChart3,
  BookOpen,
  Calendar,
  MessageSquare,
  Target,
  Trophy,
} from "lucide-react";
import Navbar from "@/components/navbar";
import EditProfileModal from "@/components/edit-profile-modal";


  
// Custom Avatar component
const CustomAvatar = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={`relative inline-block ${className}`}>{children}</div>;
};

interface ProfileFormValues {
  name: string;
  email: string;
  phone: string;
  branch: string;
  semester: string;
  section: string;
  studentId?: string;
  gpa?: string;
}

const Index = () => {

  const [isOnline, setIsOnline] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [profile, setProfile] = useState<ProfileFormValues>({
    name: "Student Name",
    email: "example@example.com",
    phone: "+91 9123456789",
    branch: "Computer Science",
    semester: "4th",
    section: "CS-B",
    studentId: "1DS23CS000",
    gpa: "3.86",
  });

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar onEditProfile={() => setIsModalOpen(true)} />

      <EditProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialProfile={profile}
        onSave={(updatedProfile) =>
          setProfile((prev) => ({ ...prev, ...updatedProfile }))
        }
      />

      <main className="container py-8 space-y-8">
        <section className="rounded-xl border bg-white p-8 shadow-sm">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="relative">
              <CustomAvatar className="h-32 w-32 rounded-full border-4 border-white shadow-md">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOeeP4wu4e3tpqA9I7hsR7hguzKBICqnk0Iw&s"
                  alt="Student"
                  className="w-full h-full rounded-full object-cover"
                />
              </CustomAvatar>
              <div
                className={`absolute bottom-1 right-1 h-4 w-4 rounded-full ${
                  isOnline ? "bg-green-500" : "bg-gray-400"
                } ring-2 ring-white`}
              ></div>
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex flex-col md:flex-row justify-between items-center md:items-start">
                <div>
                  <h1 className="text-3xl font-bold">{profile.name}</h1>
                  <p className="text-gray-500">Student ID: {profile.studentId}</p>
                </div>
                <div className="mt-4 md:mt-0 bg-blue-50 rounded-xl p-4 text-center">
                  <p className="text-sm text-blue-600 font-medium">Current GPA</p>
                  <p className="text-4xl font-bold text-blue-600">{profile.gpa}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 mt-6">
                <Info label="Branch" value={profile.branch} />
                <Info label="Semester" value={profile.semester} />
                <Info label="Section" value={profile.section} />
                <Info label="Phone" value={profile.phone} />
                <Info label="Email" value={profile.email} wide />
              </div>
            </div>
          </div>
        </section>

        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1 text-sm text-blue-600">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
            </span>
            AI-Powered Learning
          </div>
        </div>

        <section className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Your Personalized Academic Hub</h2>
          <p className="text-gray-600 leading-relaxed">
            Welcome to your student dashboard, where artificial intelligence
            meets academic excellence. This platform analyzes your learning
            patterns and performance to provide personalized insights and
            recommendations, helping you achieve your full potential.
          </p>
        </section>

        <section className="space-y-6 mx-5 my-5">
          <h2 className="text-2xl font-bold text-center">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              icon={<MessageSquare className="h-6 w-6 text-blue-500" />}
              iconBg="bg-blue-50"
              title="Personalized Feedback"
              titleColor="text-blue-600"
              description="Receive AI-driven feedback based on your academic performance and learning patterns."
            />
            <FeatureCard
              icon={<Target className="h-6 w-6 text-green-500" />}
              iconBg="bg-green-50"
              title="Goal Setting"
              titleColor="text-green-600"
              description="Set and track your academic goals with AI-powered recommendations for achievement."
            />
            <FeatureCard
              icon={<BarChart3 className="h-6 w-6 text-purple-500" />}
              iconBg="bg-purple-50"
              title="Academic Trends"
              titleColor="text-purple-600"
              description="Visualize your performance trends and identify areas for improvement."
            />
            <FeatureCard
              icon={<Calendar className="h-6 w-6 text-orange-500" />}
              iconBg="bg-orange-50"
              title="Course Calendar"
              titleColor="text-orange-600"
              description="Stay organized with an intelligent calendar that prioritizes your academic schedule."
            />
            <FeatureCard
              icon={<BookOpen className="h-6 w-6 text-pink-500" />}
              iconBg="bg-pink-50"
              title="Learning Resources"
              titleColor="text-pink-600"
              description="Access curated study materials tailored to your learning style and course needs."
            />
            <FeatureCard
              icon={<Trophy className="h-6 w-6 text-amber-500" />}
              iconBg="bg-amber-50"
              title="Achievements"
              titleColor="text-amber-600"
              description="Track your accomplishments and unlock new milestones as you progress."
            />
          </div>
        </section>
      </main>

      <footer className="border-t bg-white py-6">
        <div className="container text-center text-sm text-gray-500">
          <p>© 2025 StudySync. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

const Info = ({
  label,
  value,
  wide = false,
}: {
  label: string;
  value: string;
  wide?: boolean;
}) => (
  <div className={wide ? "sm:col-span-2" : ""}>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="font-medium">{value}</p>
  </div>
);

function FeatureCard({
  icon,
  iconBg,
  title,
  titleColor,
  description,
}: {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  titleColor: string;
  description: string;
}) {
  return (
    <Card className="overflow-hidden border rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex flex-col items-start gap-4">
          <div className={`rounded-full ${iconBg} p-3`}>{icon}</div>
          <div className="space-y-2">
            <h3 className={`text-lg font-semibold ${titleColor}`}>{title}</h3>
            <p className="text-gray-600 text-sm">{description}</p>
            <a
              href="#"
              className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              Learn more
              <svg
                className="ml-1 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default Index;
