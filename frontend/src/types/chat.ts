export type ChatRow = Record<string, string | number | boolean | null>;

export type ChatReasoning = {
  entidade_principal: string;
  metrica_principal: string;
  tabelas_utilizadas: string[];
  relacionamentos_utilizados: string[];
  agregacao: string;
  filtro_ou_criterio: string;
  explicacao_final: string;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  statuses: string[];
  rows: ChatRow[];
  summary: string;
  createdAt: string;
  reasoning?: ChatReasoning | null;
};

export type StreamEvent =
  | { type: "status"; message: string }
  | {
      type: "done";
      question: string;
      rows: ChatRow[];
      summary: string;
      reasoning: ChatReasoning;
    }
  | { type: "error"; message: string };