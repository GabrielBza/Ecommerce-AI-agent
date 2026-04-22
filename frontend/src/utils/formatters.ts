export function formatMessageText(text: string): string {
  return text ?? "";
}

export function formatTimestamp(dateString: string): string {
  const date = new Date(dateString);

  return date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}