import { motion } from "framer-motion";
import type { ChatMessage } from "../../types/chat";
import { formatTimestamp } from "../../utils/formatters";
import StatusList from "../molecules/StatusList";
import DataTable from "../molecules/DataTable";
import TableMeta from "../molecules/TableMeta";
import ReasoningCard from "../molecules/ReasoningCard";

type MessageBubbleProps = {
  message: ChatMessage;
};

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-3 flex items-center gap-2 text-sm text-slate-400"
    >
      <span>Pensando</span>
      <div className="flex gap-1">
        <motion.span
          animate={{ y: [0, -4, 0] }}
          transition={{ repeat: Infinity, duration: 0.9, delay: 0 }}
          className="h-2 w-2 rounded-full bg-slate-400"
        />
        <motion.span
          animate={{ y: [0, -4, 0] }}
          transition={{ repeat: Infinity, duration: 0.9, delay: 0.15 }}
          className="h-2 w-2 rounded-full bg-slate-400"
        />
        <motion.span
          animate={{ y: [0, -4, 0] }}
          transition={{ repeat: Infinity, duration: 0.9, delay: 0.3 }}
          className="h-2 w-2 rounded-full bg-slate-400"
        />
      </div>
    </motion.div>
  );
}

function ErrorCard({ text }: { text: string }) {
  return (
    <div className="mt-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-4">
      <div className="mb-1 text-xs font-medium uppercase tracking-[0.18em] text-red-300">
        Erro
      </div>
      <div className="text-sm leading-6 text-red-100">{text}</div>
    </div>
  );
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const showTyping =
    message.role === "assistant" &&
    !message.text &&
    (!message.rows || message.rows.length === 0);

  const columnCount =
    message.rows && message.rows.length > 0
      ? Object.keys(message.rows[0]).length
      : 0;

  const isUser = message.role === "user";
  const isError =
    message.role === "assistant" &&
    message.text.toLowerCase().includes("erro");

  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className={`mx-auto w-full max-w-5xl ${
        isUser ? "flex justify-end" : "flex justify-start"
      }`}
    >
      <div
        className={`w-full max-w-4xl rounded-[28px] border p-5 shadow-[0_12px_40px_rgba(0,0,0,0.18)] ${
          isUser
            ? "border-blue-500/20 bg-blue-600 text-white"
            : "border-slate-800 bg-slate-900/95 text-slate-100"
        }`}
      >
        <div className="mb-3 flex items-center justify-between gap-4">
          <span
            className={`text-[11px] font-medium uppercase tracking-[0.18em] ${
              isUser ? "text-blue-100/80" : "text-slate-400"
            }`}
          >
            {isUser ? "Você" : "Assistente"}
          </span>

          <span
            className={`text-xs ${
              isUser ? "text-blue-100/70" : "text-slate-500"
            }`}
          >
            {formatTimestamp(message.createdAt)}
          </span>
        </div>

        {!isError && message.text && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.22 }}
            className={`whitespace-pre-wrap text-sm leading-7 md:text-[15px] ${
              isUser ? "text-white" : "text-slate-100"
            }`}
          >
            {message.text}
          </motion.div>
        )}

        {isError && <ErrorCard text={message.text} />}

        {showTyping && <TypingIndicator />}

        {message.statuses.length > 0 && !isError && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22 }}
          >
            <StatusList statuses={message.statuses} />
          </motion.div>
        )}

        {message.reasoning && !isError && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.24 }}
          >
            <ReasoningCard reasoning={message.reasoning} />
          </motion.div>
        )}

        {message.rows && message.rows.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28 }}
          >
            <TableMeta
              rowCount={message.rows.length}
              columnCount={columnCount}
            />
            <DataTable rows={message.rows} />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}