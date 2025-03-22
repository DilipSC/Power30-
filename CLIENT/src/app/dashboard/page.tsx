"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  BarChart3,BookOpen,Calendar,LogOut,MessageSquare,Pencil,Settings,Target,Trophy,User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

// Custom Avatar component to replace the imported one
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
}

const Index = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // User profile state
  const [profile, setProfile] = useState({
    name: "Student Name",
    email: "example123@gmail.com",
    phone: "(+91) 912345678",
    branch: "Computer Science",
    semester: "4th (Sophomore Year)",
    section: "CS-B",
    studentId: "1DS23CS000",
    gpa: "3.86",
  });

  // Setup form with react-hook-form
  const form = useForm<ProfileFormValues>({
    defaultValues: {
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      branch: profile.branch,
      semester: profile.semester,
      section: profile.section,
    },
  });

  // Handle form submission
  const onSubmit = (data: ProfileFormValues) => {
    // Update profile state with form data
    setProfile({
      ...profile,
      name: data.name,
      email: data.email,
      phone: data.phone,
      branch: data.branch,
      semester: data.semester,
      section: data.section,
    });

    // Close dialog
    setIsSettingsOpen(false);

    // Show success message
    toast.success("Profile updated successfully");
  };
  const router = useRouter();
  const handleLogout = () => {
   
    localStorage.removeItem("token"); 
    router.push("/login");
  };
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-10 border-b bg-white shadow-sm">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-blue-600 p-3">StudentProfile</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2"
              onClick={() => setIsSettingsOpen(true)}
            >
              <User className="h-4 w-4" />
              <span>Edit Profile</span>
            </Button>
            <Button variant="ghost" size="sm" className="gap-2" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8 space-y-8 ">
        {/* Student Profile Container */}
        <section className="rounded-xl border bg-white p-8 shadow-sm">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="relative">
              <CustomAvatar className="h-32 w-32 rounded-full border-4 border-white shadow-md">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOeeP4wu4e3tpqA9I7hsR7hguzKBICqnk0Iw&s"
                  alt="Student Image"
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
                  <p className="text-gray-500">
                    Student ID: {profile.studentId}
                  </p>
                </div>
                <div className="mt-4 md:mt-0 bg-blue-50 rounded-xl p-4 text-center">
                  <p className="text-sm text-blue-600 font-medium">
                    Current GPA
                  </p>
                  <p className="text-4xl font-bold text-blue-600">
                    {profile.gpa}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 mt-6">
                <div>
                  <p className="text-sm text-gray-500">Branch</p>
                  <p className="font-medium">{profile.branch}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Semester</p>
                  <p className="font-medium">{profile.semester}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Section</p>
                  <p className="font-medium">{profile.section}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{profile.phone}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{profile.email}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AI-Powered Learning Badge */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1 text-sm text-blue-600">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
            </span>
            AI-Powered Learning
          </div>
        </div>

        {/* Introduction Section */}
        <section className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">
            Your Personalized Academic Hub
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Welcome to your student dashboard, where artificial intelligence
            meets academic excellence. This platform analyzes your learning
            patterns and performance to provide personalized insights and
            recommendations, helping you achieve your full potential.
          </p>
        </section>

        {/* Key Features Section */}
        <section className="space-y-6 mx-5 my-5" >
          <h2 className="text-2xl font-bold text-center">Key Features</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature Cards */}
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

      {/* Profile Edit Dialog */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Edit Your Profile
            </DialogTitle>
            <DialogDescription>
              Update your personal information below. Click save when you're
              done.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Your email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="Your phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="branch"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Branch</FormLabel>
                      <FormControl>
                        <Input placeholder="Your branch" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="semester"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Semester</FormLabel>
                      <FormControl>
                        <Input placeholder="Your semester" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="section"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Section</FormLabel>
                    <FormControl>
                      <Input placeholder="Your section" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsSettingsOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="gap-2">
                  <Pencil className="h-4 w-4" /> Save Changes
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Feature Card Component
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
