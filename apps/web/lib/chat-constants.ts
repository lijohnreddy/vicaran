/**
 * Chat Model Constants
 *
 * Defines the single AI model used throughout the chat application.
 * This replaces the complex model management system with simple constants.
 */

export const CHAT_MODEL = {
  provider: "google",
  name: "gemini-2.5-flash",
  displayName: "Gemini 2.5 Flash",
  openRouterModel: "google/gemini-2.5-flash",
  hasImageInput: true,
  hasObjectGeneration: true,
  hasToolUsage: true,
} as const;

export type ChatModel = typeof CHAT_MODEL;
