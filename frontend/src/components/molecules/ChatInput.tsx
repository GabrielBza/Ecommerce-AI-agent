import { motion } from "framer-motion";
import type {
  Dispatch,
  FormEventHandler,
  KeyboardEvent,
  SetStateAction,
} from "react";
import Button from "../atoms/Button";
import TextArea from "../atoms/TextArea";

type ChatInputProps = {
  question: string;
  setQuestion: Dispatch<SetStateAction<string>>;
  loading: boolean;
  onSubmit: FormEventHandler<HTMLFormElement>;
};

export default function ChatInput({
  question,
  setQuestion,
  loading,
  onSubmit,
}: ChatInputProps) {
  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      const form = e.currentTarget.form;
      if (form) {
        form.requestSubmit();
      }
    }
  }

  return (
    <form onSubmit={onSubmit} className="px-4 py-3 md:px-6 lg:px-8">
      <motion.div
        initial={false}
        animate={{ scale: loading ? 0.995 : 1 }}
        transition={{ duration: 0.18 }}
        className="rounded-[24px] border border-slate-800 bg-slate-900/90 p-2.5 shadow-[0_10px_30px_rgba(0,0,0,0.2)] backdrop-blur"
      >
        <div className="flex items-end gap-2.5">
          <TextArea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ex.: Quais são os 10 produtos mais vendidos?"
            rows={1}
            disabled={loading}
          />
          <Button type="submit" disabled={loading}>
            {loading ? "Enviando..." : "Enviar"}
          </Button>
        </div>
      </motion.div>
    </form>
  );
}