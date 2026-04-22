import ChatLayout from "./components/templates/ChatLayout";
import { useChatStream } from "./hooks/useChatStream";

export default function App() {
  const {
    messages,
    question,
    setQuestion,
    loading,
    handleSubmit,
    messagesEndRef,
    clearMessages,
    sendQuestionDirect,
  } = useChatStream();

  return (
    <ChatLayout
      messages={messages}
      messagesEndRef={messagesEndRef}
      question={question}
      setQuestion={setQuestion}
      loading={loading}
      onSubmit={handleSubmit}
      onClearChat={clearMessages}
      onExampleClick={sendQuestionDirect}
    />
  );
}