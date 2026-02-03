import ProfilePageClient from "./ProfilePageClient";

export default async function ProfilePage() {
  // Authentication handled by protected layout - user data available via UserContext
  return <ProfilePageClient />;
}
