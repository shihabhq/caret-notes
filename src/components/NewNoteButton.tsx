"use client";

import { User } from "@prisma/client";
import { Button } from "./ui/button";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { createNoteAction } from "@/actions/notes";

const NewNoteButton = ({ user }: { user: User | null }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const handleClickNewNote = async () => {
    if (!user) {
      return router.push("/login");
    }
    setLoading(true);

    const uuid = uuidv4();
    await createNoteAction(uuid);
    router.push(`/?noteId=${uuid}`);
    toast.success("Note Created successfully");
    setLoading(false);
  };
  return (
    <Button
      onClick={handleClickNewNote}
      variant="secondary"
      className="w-24"
      disabled={loading}
    >
      {loading ? <Loader2 className="animate-spin" /> : "New Note"}
    </Button>
  );
};

export default NewNoteButton;
