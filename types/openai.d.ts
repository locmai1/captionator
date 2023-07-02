export interface OpenAIChatMessage {
  id?: number;
  role: "system" | "assistant" | "user";
  content: string;
}
