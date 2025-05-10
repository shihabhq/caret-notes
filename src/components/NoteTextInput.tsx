"use client";
import { useSearchParams } from "next/navigation";
import { Textarea } from "./ui/textarea";
import { ChangeEvent, useEffect, useRef } from "react";
import { debounceTimout } from "@/lib/constants";
import useNote from "@/hooks/useNote";
import { updateNoteAction } from "@/actions/notes";

const NoteTextInput = ({
  startingNoteText,
  noteId,
}: {
  startingNoteText: string;
  noteId: string;
}) => {
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const noteIdParam = useSearchParams().get("noteId") || "";
  const { noteText, setNoteText } = useNote();

  useEffect(() => {
    if (noteIdParam === noteId) {
      setNoteText(startingNoteText);
    }
  }, [startingNoteText, noteId, noteIdParam, setNoteText]);

  const handleUpdateNote = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setNoteText(text);
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }

    updateTimeoutRef.current = setTimeout(() => {
      updateNoteAction(noteId, text);
    }, debounceTimout);
  };

  return (
    <Textarea
      value={noteText}
      onChange={(e) => handleUpdateNote(e)}
      placeholder="Type your notes here"
      className="custom-scrollbar placeholder:text-muted-foreground mb-4 h-full max-w-4xl resize-none border-1 p-4 focus-visible:ring-0 focus-visible:ring-offset-0"
    />
  );
};

export default NoteTextInput;
