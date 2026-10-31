"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/portals/shared/PageHeader";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { Spinner } from "@/components/ui/Spinner";
import { portalFetch, extractObject } from "@/components/portals/shared/portal-api";
import { Save, User, Lock } from "lucide-react";

export function ProfileSettingsForm({ title = "Account Settings", subtitle = "Manage your personal profile and security credentials" }: { title?: string; subtitle?: string }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const loadProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await portalFetch("/api/portal/profile");
      const user = extractObject<{ name?: string; email?: string; role?: string }>(res, ["user", "profile"]);
      if (user) {
        setName(user.name ?? "");
        setEmail(user.email ?? "");
        setRole(user.role ?? "");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load account profile");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadProfile();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadProfile]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccessMsg(null);
    try {
      await portalFetch("/api/portal/profile", {
        method: "PATCH",
        body: JSON.stringify({
          name: name.trim(),
          currentPassword: currentPassword || undefined,
          newPassword: newPassword || undefined,
        }),
      });
      setCurrentPassword("");
      setNewPassword("");
      setSuccessMsg("Account settings updated.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update account settings");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" color="gold" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <PageHeader title={title} subtitle={subtitle} />

      {error && <Alert variant="error" title="Error" message={error} onClose={() => setError(null)} />}
      {successMsg && <Alert variant="success" title="Saved" message={successMsg} onClose={() => setSuccessMsg(null)} />}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-4 w-4 text-geo-gold" />
              Personal Information
            </CardTitle>
            <CardDescription>Your identity across the Geo Vision platform</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Full Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Email Address" value={email} disabled />
              <Input label="Portal Role" value={role} disabled />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-geo-gold" />
              Password & Authentication
            </CardTitle>
            <CardDescription>Leave blank if you do not wish to change your password</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Current Password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <Input
              label="New Password (Min 8 Characters)"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Button type="submit" isLoading={isSaving} leftIcon={<Save className="h-4 w-4" />}>
              Save Account Changes
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
