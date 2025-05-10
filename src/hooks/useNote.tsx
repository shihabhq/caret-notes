"use client";

import { NoteProviderContext } from "@/providers/NoteProvider";
import { useContext } from "react";

const useNote = () => {
  const context = useContext(NoteProviderContext);

  if (!context) throw new Error("useNote Must be within a note Provider");

  return context;
};

export default useNote;
