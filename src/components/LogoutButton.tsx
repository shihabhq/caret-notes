"use client";
import { useState } from "react";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { SignOutAction } from "@/actions/users";

const LogoutButton = () => {
  const [loading, setLoading] = useState(false);
  const handleLogout = async () => {
    setLoading(true);
    const { error } = await SignOutAction();
    setLoading(false);
    const errorMsg = error;
    if (!errorMsg) {
      toast.success("Logged out successfully");
    } else {
      toast.error("Unexpected error occured");
    
    }
  };
  return (
    <Button
      className="w-24 cursor-pointer"
      disabled={loading}
      variant={"outline"}
      onClick={handleLogout}
    >
      {loading ? <Loader2 className="animate-spin" /> : "Log out"}
    </Button>
  );
};

export default LogoutButton;
