"use server";

import { getUser } from "@/auth/server";
import { prisma } from "@/db/prisma";
import handleError from "@/lib/utils";
import { openai } from "@/openai";

export const updateNoteAction = async (noteId: string, text: string) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Must be loggedIn to update the note");

    await prisma.note.update({
      where: { id: noteId },
      data: { text },
    });
    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};

export const createNoteAction = async (uuid: string) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Must be loggedIn to update the note");

    await prisma.note.create({
      data: {
        id: uuid,
        text: "",
        authorId: user.id,
      },
    });
  } catch (error) {
    return handleError(error);
  }
};

export const deleteNoteAction = async (noteId: string) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Must be loggedIn to delete the note");

    await prisma.note.delete({
      where: { id: noteId },
    });
    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};

type ChatMessage = {
  role: "system" | "user" | "assistant" | "developer"; // include 'developer' if your model supports it
  content: string;
};

export const AskAIAboutNotesAction = async (
  newQuestions: string[],
  responses: string[],
) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Must be loggedIn to Ask Ai questions");

    const notes = await prisma.note.findMany({
      where: { authorId: user.id },
      orderBy: { createdAt: "desc" },
      select: { text: true, createdAt: true, updatedAt: true },
    });

    if (notes.length === 0) {
      return "Dont have any notes yet";
    }
    const formattedNotes = notes
      .map((note) => {
        return `
      Text:${note.text}
      createdAt:${note.createdAt}
      updatedAt:${note.updatedAt}
      `.trim();
      })
      .join("\n");

    const messages: ChatMessage[] = [
      {
        role: "system",
        content: `
          You are a helpful assistant that answers questions about a user's notes. 
          Assume all questions are related to the user's notes. 
          Make sure that your answers are not too verbose and you speak succinctly. 
          Your responses MUST be formatted in clean, valid HTML with proper structure. 
          Use tags like <p>, <strong>, <em>, <ul>, <ol>, <li>, <h1> to <h6>, and <br> when appropriate. 
          Do NOT wrap the entire response in a single <p> tag unless it's a single paragraph. 
          Avoid inline styles, JavaScript, or custom attributes.
          
          Rendered like this in JSX:
          <p dangerouslySetInnerHTML={{ __html: YOUR_RESPONSE }} />
    
          Here are the user's notes:
          ${formattedNotes}
          `,
      },
    ];

    for (let i = 0; i < newQuestions.length; i++) {
      messages.push({ role: "user", content: newQuestions[i] });
      if (responses.length > i) {
        messages.push({ role: "assistant", content: responses[i] });
      }
    }

    const completion = await openai.chat.completions.create({
      model: "nousresearch/deephermes-3-llama-3-8b-preview:free",
      messages,
    });

    return (
      completion.choices[0].message.content || "Sorry a Problem has occured"
    );
  } catch (error) {
    console.error(error);
    return "Sorry a Problem has occured";
  }
};
