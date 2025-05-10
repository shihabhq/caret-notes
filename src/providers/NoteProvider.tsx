"use client";

import { useState } from "react";
import { createContext } from "react";

type NoteProviderContextType = {
  noteText: string;
  setNoteText: (noteText: string) => void;
};

export const NoteProviderContext = createContext<NoteProviderContextType>({
  noteText: "",
  setNoteText: () => {},
});

const NoteProvider = ({ children }: { children: React.ReactNode }) => {
  const [noteText, setNoteText] = useState("");

  return (
    <NoteProviderContext value={{ noteText, setNoteText }}>
      {children}
    </NoteProviderContext>
  );
};

export default NoteProvider;
