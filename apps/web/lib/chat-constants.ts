/**
 * Chat Model Constants
 *
 * Defines the single AI model used throughout the chat application.
 * This replaces the complex model management system with simple constants.
 */

export const CHAT_MODEL = {
  provider: "google",
  name: "gemini-3-pro-preview",
  displayName: "Gemini 3 Pro",
  openRouterModel: "google/gemini-3-pro-preview",
  hasImageInput: true,
  hasObjectGeneration: true,
  hasToolUsage: true,
} as const;

export type ChatModel = typeof CHAT_MODEL;
