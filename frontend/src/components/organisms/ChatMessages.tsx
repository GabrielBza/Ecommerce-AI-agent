import { AnimatePresence, motion } from "framer-motion";
import type { RefObject } from "react";
import type { ChatMessage } from "../../types/chat";
import MessageBubble from "./MessageBubble";

type ChatMessagesProps = {
  messages: ChatMessage[];
  messagesEndRef: RefObject<HTMLDivElement | null>;
  onExampleClick: (question: string) => void;
};

type ExampleCardProps = {
  text: string;
  onClick: (question: string) => void;
};

function ExampleCard({ text, onClick }: ExampleCardProps) {
  return (
    <button
      type="button"
      onClick={() => onClick(text)}
      className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-left text-sm text-slate-300 transition hover:border-blue-500/30 hover:bg-slate-900 hover:text-white"
    >
      {text}
    </button>
  );
}

function EmptyState({
  onExampleClick,
}: {
  onExampleClick: (question: string) => void;
}) {
  const examples = [
    "Quais são os 10 produtos mais vendidos?",
    "Qual é a receita total por categoria de produto?",
    "Qual é o percentual de pedidos entregues no prazo por estado?",
    "Quais categorias têm a maior taxa de avaliação negativa?",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto mt-10 w-full max-w-3xl rounded-[28px] border border-slate-800 bg-slate-900/80 p-8 text-center shadow-[0_12px_40px_rgba(0,0,0,0.18)]"
    >
      
      <h2 className="text-xl font-semibold text-white">
        Faça sua primeira pergunta
      </h2>

      <p className="mt-3 text-sm leading-6 text-slate-400">
        Você pode pedir rankings de vendas, análises de receita, indicadores de
        entrega, médias de avaliação e comparações por estado, categoria ou
        vendedor.
      </p>

      <div className="mt-6 grid gap-3 text-left md:grid-cols-2">
        {examples.map((example) => (
          <ExampleCard
            key={example}
            text={example}
            onClick={onExampleClick}
          />
        ))}
      </div>
    </motion.div>
  );
}

export default function ChatMessages({
  messages,
  messagesEndRef,
  onExampleClick,
}: ChatMessagesProps) {
  const isEmpty = messages.length === 0;

  return (
    <section className="min-h-0 flex-1 overflow-y-auto px-4 py-6 md:px-6 lg:px-8">
      <div className="space-y-6">
        {isEmpty ? (
          <EmptyState onExampleClick={onExampleClick} />
        ) : (
          <AnimatePresence mode="popLayout">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
          </AnimatePresence>
        )}

        <div ref={messagesEndRef} />
      </div>
    </section>
  );
}