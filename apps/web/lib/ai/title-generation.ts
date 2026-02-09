import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import { env } from "@/lib/env";

// Initialize Google AI client
const google = createGoogleGenerativeAI({
  apiKey: env.GEMINI_API_KEY,
});

// Type for title generation result
export type TitleGenerationResult =
  | { success: true; title: string }
  | { success: false; error: string };

/**
 * Generate a session title from the first user message using Gemini 3 Pro
 *
 * @param userMessage - The first user message in the session
 * @returns Promise resolving to success/error result with generated title
 */
export async function generateSessionTitle(
  userMessage: string
): Promise<TitleGenerationResult> {
  try {
    // Validate input
    if (!userMessage?.trim()) {
      return {
        success: false,
        error: "User message cannot be empty",
      };
    }

    // Use the full message without truncation - let AI see complete context
    const result = await generateText({
      model: google("gemini-3-pro-preview"),
      prompt: `Generate a concise, descriptive title (max 60 characters) for a chat session based on this user message:

"${userMessage}"

Requirements:
- Keep it under 60 characters
- Make it specific and descriptive about the actual task or topic
- Avoid generic phrases like "Chat about", "Question about", "Help with", "Discussion about"
- Avoid vague terms like "issue", "problem", "thing", "stuff"
- Focus on the specific action, technology, or goal mentioned
- Use active language when possible (verbs like "Fix", "Build", "Deploy", "Create")
- Use title case for important words
- No quotation marks in the response
- Be specific about technologies, frameworks, or tools mentioned

Examples of GOOD titles:
- "Fix React useState Hook Bug" (not "Help with React issue")
- "Deploy Next.js App to Vercel" (not "Deployment question") 
- "Build Authentication with Supabase" (not "Auth discussion")
- "Debug PostgreSQL Connection Error" (not "Database problem")
- "Create Responsive Navigation Menu" (not "UI component help")
- "Optimize API Response Performance" (not "Performance issue")
- "Setup Docker Development Environment" (not "Docker question")
- "Implement Stripe Payment Integration" (not "Payment discussion")

Examples of BAD titles to avoid:
- "General question about..."
- "Help me with..."
- "I have a problem with..."
- "Can you assist with..."
- "Issue with my code"
- "Something about..."

Focus on extracting the core action or deliverable from the user's message.

Title:`,
      // Remove token limits - let AI generate as much as needed
      temperature: 0.3,
    });

    const generatedTitle = result.text.trim();

    // Validate the generated title
    if (!generatedTitle) {
      return {
        success: false,
        error: "AI generated empty title",
      };
    }

    // Ensure title is not too long
    const finalTitle =
      generatedTitle.length > 60
        ? generatedTitle.slice(0, 57) + "..."
        : generatedTitle;

    return {
      success: true,
      title: finalTitle,
    };
  } catch (error) {
    console.error("Failed to generate session title:", error);

    // Return specific error messages for common issues
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    if (errorMessage.includes("API key")) {
      return {
        success: false,
        error: "AI service configuration error",
      };
    }

    if (errorMessage.includes("quota") || errorMessage.includes("rate")) {
      return {
        success: false,
        error: "AI service rate limit exceeded",
      };
    }

    return {
      success: false,
      error: `AI title generation failed: ${errorMessage}`,
    };
  }
}

/**
 * Generate a fallback title from user message (first 50 characters)
 * Used when AI generation fails or is not available
 *
 * @param userMessage - The user message to create a title from
 * @returns Fallback title string
 */
export function generateFallbackTitle(userMessage: string): string {
  if (!userMessage?.trim()) {
    return "New Session";
  }

  // Take first 47 characters and add ellipsis if longer
  const title = userMessage.trim().slice(0, 47);
  return title.length < userMessage.trim().length ? `${title}...` : title;
}
