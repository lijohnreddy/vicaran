import { redirect } from "next/navigation";

/**
 * Home page - Temporary redirect to /chat until Phase 5 implementation
 * This route will be replaced with the full home page in Phase 5
 */
export default function HomePage() {
    redirect("/chat");
}
