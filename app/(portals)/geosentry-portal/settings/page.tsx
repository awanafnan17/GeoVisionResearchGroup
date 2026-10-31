"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/portals/shared/PageHeader";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { Spinner } from "@/components/ui/Spinner";
import {
  portalFetch,
  extractArray,
  extractObject,
  type PortalSiteSetting,
} from "@/components/portals/shared/portal-api";
import { Save, Shield, User } from "lucide-react";

export default function GeoSentrySettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingConfig, setIsSavingConfig] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // GeoSentry service settings
  const [standardFee, setStandardFee] = useState("3500");
  const [rushFee, setRushFee] = useState("5000");
  const [standardSlaDays, setStandardSlaDays] = useState("7");
  const [rushSlaHours, setRushSlaHours] = useState("72");
  const [intakeEmail, setIntakeEmail] = useState("geosentry@geovision.org");

  // Manager Personal Profile
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const loadSettings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [settingsRes, profileRes] = await Promise.all([
        portalFetch("/api/portal/settings?group=geosentry").catch(() => null),
        portalFetch("/api/portal/profile").catch(() => null),
      ]);

      if (settingsRes) {
        const list = extractArray<PortalSiteSetting>(settingsRes, ["settings"]);
        for (const item of list) {
          if (item.key === "geosentry_standard_fee") setStandardFee(item.value);
          if (item.key === "geosentry_rush_fee") setRushFee(item.value);
          if (item.key === "geosentry_standard_sla_days") setStandardSlaDays(item.value);
          if (item.key === "geosentry_rush_sla_hours") setRushSlaHours(item.value);
          if (item.key === "geosentry_intake_email") setIntakeEmail(item.value);
        }
      }

      if (profileRes) {
        const userObj = extractObject<{ name?: string; email?: string }>(profileRes, ["user", "profile"]);
        if (userObj) {
          if (userObj.name) setName(userObj.name);
          if (userObj.email) setEmail(userObj.email);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load settings");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadSettings();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadSettings]);

  async function handleSaveGeoSentrySettings(e: React.FormEvent) {
    e.preventDefault();
    setIsSavingConfig(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const settingsPayload = {
        group: "geosentry",
        settings: [
          { key: "geosentry_standard_fee", value: standardFee, group: "geosentry", label: "GeoSentry Standard Fee (USD)" },
          { key: "geosentry_rush_fee", value: rushFee, group: "geosentry", label: "GeoSentry Rush Fee (USD)" },
          { key: "geosentry_standard_sla_days", value: standardSlaDays, group: "geosentry", label: "Standard Turnaround (Days)" },
          { key: "geosentry_rush_sla_hours", value: rushSlaHours, group: "geosentry", label: "Rush Turnaround (Hours)" },
          { key: "geosentry_intake_email", value: intakeEmail, group: "geosentry", label: "GeoSentry Intake Notification Email" },
        ],
      };

      await portalFetch("/api/portal/settings", {
        method: "PUT",
        body: JSON.stringify(settingsPayload),
      });
      setSuccessMsg("GeoSentry commercial and SLA settings updated.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update GeoSentry settings");
    } finally {
      setIsSavingConfig(false);
    }
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setIsSavingProfile(true);
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
      setSuccessMsg("Personal account profile updated.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setIsSavingProfile(false);
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
    <div className="space-y-6">
      <PageHeader
        title="GeoSentry Settings"
        subtitle="Configure desktop screening pricing, turnaround SLAs, and manager account preferences"
      />

      {error && <Alert variant="error" title="Error" message={error} onClose={() => setError(null)} />}
      {successMsg && <Alert variant="success" title="Saved" message={successMsg} onClose={() => setSuccessMsg(null)} />}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-geo-gold" />
              GeoSentry Pipeline & Pricing Configuration
            </CardTitle>
            <CardDescription>
              Standard and Rush screening parameters for public intake and commercial quotes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveGeoSentrySettings} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Standard Screening Fee (USD)"
                  type="number"
                  value={standardFee}
                  onChange={(e) => setStandardFee(e.target.value)}
                />
                <Input
                  label="Rush Screening Fee (USD)"
                  type="number"
                  value={rushFee}
                  onChange={(e) => setRushFee(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Standard SLA (Business Days)"
                  type="number"
                  value={standardSlaDays}
                  onChange={(e) => setStandardSlaDays(e.target.value)}
                />
                <Input
                  label="Rush SLA (Hours)"
                  type="number"
                  value={rushSlaHours}
                  onChange={(e) => setRushSlaHours(e.target.value)}
                />
              </div>

              <Input
                label="Intake Notification Email"
                type="email"
                value={intakeEmail}
                onChange={(e) => setIntakeEmail(e.target.value)}
              />

              <Button type="submit" isLoading={isSavingConfig} leftIcon={<Save className="h-4 w-4" />}>
                Save GeoSentry Configuration
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-4 w-4 text-geo-gold" />
              Manager Account & Password
            </CardTitle>
            <CardDescription>Update your display name and security credentials</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                label="Email Address"
                value={email}
                disabled
              />
              <Input
                label="Current Password (To Change Password)"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <Input
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <Button type="submit" variant="outline" isLoading={isSavingProfile} leftIcon={<Save className="h-4 w-4" />}>
                Update Manager Account
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
