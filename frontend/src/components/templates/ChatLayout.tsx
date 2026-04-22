import type { Dispatch, FormEventHandler, RefObject, SetStateAction } from "react";
import type { ChatMessage } from "../../types/chat";
import Sidebar from "../organisms/Sidebar";
import Header from "../organisms/Header";
import ChatMessages from "../organisms/ChatMessages";
import ChatInput from "../molecules/ChatInput";

type ChatLayoutProps = {
  messages: ChatMessage[];
  messagesEndRef: RefObject<HTMLDivElement | null>;
  question: string;
  setQuestion: Dispatch<SetStateAction<string>>;
  loading: boolean;
  onSubmit: FormEventHandler<HTMLFormElement>;
  onClearChat: () => void;
  onExampleClick: (question: string) => void;
};

export default function ChatLayout({
  messages,
  messagesEndRef,
  question,
  setQuestion,
  loading,
  onSubmit,
  onClearChat,
  onExampleClick,
}: ChatLayoutProps) {
  return (
    <div className="h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="flex h-full bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.12),_transparent_30%)]">
        <Sidebar />

        <main className="flex h-full min-h-0 flex-1 flex-col">
          <Header onClearChat={onClearChat} />

          <div className="mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col">
            <ChatMessages
              messages={messages}
              messagesEndRef={messagesEndRef}
              onExampleClick={onExampleClick}
            />
          </div>

          <div className="shrink-0 border-t border-slate-800/80 bg-slate-950/90 backdrop-blur-xl">
            <div className="mx-auto w-full max-w-7xl">
              <ChatInput
                question={question}
                setQuestion={setQuestion}
                loading={loading}
                onSubmit={onSubmit}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}