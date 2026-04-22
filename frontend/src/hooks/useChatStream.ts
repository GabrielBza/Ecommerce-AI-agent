import { useEffect, useRef, useState } from "react";
import type { ChatMessage, StreamEvent } from "../types/chat";

const STORAGE_KEY = "agente-ia-chat-history";

function loadMessagesFromStorage(): ChatMessage[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored) as ChatMessage[];

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed;
  } catch {
    return [];
  }
}

export function useChatStream() {
  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    loadMessagesFromStorage()
  );
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  function createAssistantPlaceholder(): ChatMessage {
    return {
      id: crypto.randomUUID(),
      role: "assistant",
      text: "",
      statuses: [],
      rows: [],
      summary: "",
      createdAt: new Date().toISOString(),
      reasoning: null,
    };
  }

  function updateAssistantMessage(
    messageId: string,
    updater: ChatMessage | ((msg: ChatMessage) => ChatMessage)
  ) {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id !== messageId) return msg;
        return typeof updater === "function" ? updater(msg) : updater;
      })
    );
  }

  function clearMessages() {
    setMessages([]);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  }

  async function submitQuestion(questionText: string) {
    const trimmed = questionText.trim();
    if (!trimmed || loading) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      text: trimmed,
      statuses: [],
      rows: [],
      summary: "",
      createdAt: new Date().toISOString(),
      reasoning: null,
    };

    const assistantMessage = createAssistantPlaceholder();

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setQuestion("");
    setLoading(true);

    try {
      const response = await fetch("/ask-stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: trimmed }),
      });

      if (!response.ok) {
        let detail = "Erro ao processar a pergunta.";

        try {
          const data = await response.json();
          detail = data.detail || detail;
        } catch {
          detail = "Erro ao processar a pergunta.";
        }

        updateAssistantMessage(assistantMessage.id, {
          ...assistantMessage,
          text: detail,
        });
        setLoading(false);
        return;
      }

      if (!response.body) {
        updateAssistantMessage(assistantMessage.id, {
          ...assistantMessage,
          text: "Resposta vazia do servidor.",
        });
        setLoading(false);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.trim()) continue;

          const event = JSON.parse(line) as StreamEvent;

          if (event.type === "status") {
            updateAssistantMessage(assistantMessage.id, (msg) => ({
              ...msg,
              statuses: [...msg.statuses, event.message],
            }));
          }

          if (event.type === "done") {
            updateAssistantMessage(assistantMessage.id, (msg) => ({
              ...msg,
              text: event.summary || "",
              summary: event.summary,
              rows: event.rows || [],
              reasoning: event.reasoning ?? null,
            }));
          }

          if (event.type === "error") {
            updateAssistantMessage(assistantMessage.id, (msg) => ({
              ...msg,
              text: event.message,
            }));
          }
        }
      }
    } catch {
      updateAssistantMessage(assistantMessage.id, {
        ...assistantMessage,
        text: "Erro de conexão com o backend.",
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await submitQuestion(question);
  }

  async function sendQuestionDirect(questionText: string) {
    await submitQuestion(questionText);
  }

  return {
    messages,
    question,
    setQuestion,
    loading,
    handleSubmit,
    messagesEndRef,
    clearMessages,
    sendQuestionDirect,
  };
}