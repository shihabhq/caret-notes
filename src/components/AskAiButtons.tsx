"use client";
import { User } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Fragment, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Textarea } from "./ui/textarea";
import { ArrowUpIcon } from "lucide-react";
import { AskAIAboutNotesAction } from "@/actions/notes";
import "../styles/ai-responses.css";

const AskAiButton = ({ user }: { user: User | null }) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [questionText, setQuestionText] = useState("");
  const [questions, setQuestions] = useState<string[]>([]);
  const [responses, setResponses] = useState<string[]>([]);

  const handleOpenChange = (isOpen: boolean) => {
    if (!user) {
      router.push("/login");
    } else {
      if (isOpen) {
        setQuestionText("");
        setQuestions([]);
        setResponses([]);
      }
      setOpen(isOpen);
    }
  };
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const handleInput = () => {
    const textarea = textareaRef.current;
    if (!textarea) {
      return;
    }
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const handleClickInput = () => {
    textareaRef.current?.focus();
  };

  const handleSubmit = () => {
    if (!questionText.trim()) return;

    const newQuestions = [...questions, questionText];
    setQuestions(newQuestions);
    setQuestionText("");
    setTimeout(scrollToBottom, 100);

    startTransition(async () => {
      const response = await AskAIAboutNotesAction(newQuestions, responses);
      setResponses((prev) => [...prev, response]);
      setTimeout(scrollToBottom, 100);
    });
  };
  const scrollToBottom = () => {
    contentRef.current?.scrollTo({
      top: contentRef.current.scrollHeight,
      behavior: "smooth",
    });
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      scrollToBottom();
      handleSubmit();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="secondary">Ask AI</Button>
      </DialogTrigger>
      <DialogContent
        ref={contentRef}
        className="custom-scrollbar flex h-[85vh] max-w-4xl min-w-[60%] flex-col overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle>Ask ai about your notes</DialogTitle>
          <DialogDescription>
            Our AI can answer can questions about all of your notes.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 flex flex-col gap-8">
          {questions.map((question, index) => (
            <Fragment key={index}>
              <p className="bg-muted text-muted-foreground ml-auto max-w-[60%] rounded-md px-2 py-1 text-sm">
                {question}
              </p>
              {responses[index] && (
                <p
                  className="bot-response text-muted-foreground text-sm"
                  dangerouslySetInnerHTML={{ __html: responses[index] }}
                />
              )}
            </Fragment>
          ))}
          {isPending && <p className="animate-pulse text-sm">Thinking...</p>}
        </div>
        <div
          className="mt-auto flex cursor-text flex-col rounded-lg border p-4"
          onClick={handleClickInput}
        >
          <Textarea
            ref={textareaRef}
            placeholder="Ask me anything about your notes"
            className="placeholder:text-muted-foreground resize-none rounded-none border-none p-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
            style={{
              minHeight: "0",
              lineHeight: "normal",
              backgroundColor: "transparent",
            }}
            rows={1}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
          />
          <Button
            onClick={handleSubmit}
            className="ml-auto size-8 rounded-full"
          >
            <ArrowUpIcon className="text-background" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AskAiButton;
