import { ProfileSettingsForm } from "@/components/portals/management/ProfileSettingsForm";

export default function AdminSettingsPage() {
  return (
    <ProfileSettingsForm
      title="Admin Account Settings"
      subtitle="Update your administrator display name and password credentials"
    />
  );
}
