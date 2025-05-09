// components/Navbar.tsx
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

interface NavbarProps {
  onEditProfile: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onEditProfile }) => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-10 border-b bg-white shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        <h1 className="text-2xl font-bold text-blue-600 p-3">StudentProfile</h1>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
            onClick={onEditProfile}
          >
            <User className="h-4 w-4" />
            <span>Edit Profile</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
