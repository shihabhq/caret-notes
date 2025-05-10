import { getUser } from "@/auth/server";
import AskAiButton from "@/components/AskAiButtons";
import NewNoteButton from "@/components/NewNoteButton";
import NoteTextInput from "@/components/NoteTextInput";
import { prisma } from "@/db/prisma";
import { User } from "@prisma/client";

const Homepage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const user = (await getUser()) as User | null;
  const noteIdParam = (await searchParams).noteId;
  const noteId = Array.isArray(noteIdParam)
    ? noteIdParam[0]
    : noteIdParam === undefined
      ? ""
      : noteIdParam;
  const note = await prisma.note.findUnique({
    where: {
      id: noteId,
    },
  });

  return (
    <div className="flex h-full flex-col items-center gap-4">
      <div className="flex w-full max-w-4xl justify-end gap-2">
        <AskAiButton user={user} />
        <NewNoteButton user={user} />
      </div>
      <NoteTextInput startingNoteText={note?.text || ""} noteId={noteId} />
    </div>
  );
};

export default Homepage;
