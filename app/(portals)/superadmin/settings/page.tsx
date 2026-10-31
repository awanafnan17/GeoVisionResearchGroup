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
  type PortalSiteSetting,
} from "@/components/portals/shared/portal-api";
import { Save } from "lucide-react";

export default function SuperAdminSettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [siteName, setSiteName] = useState("Geo Vision Research Group");
  const [siteTagline, setSiteTagline] = useState("Global Geological Consultancy & Exploration Intelligence");
  const [contactEmail, setContactEmail] = useState("info@geovision.org");
  const [contactPhone, setContactPhone] = useState("+92 51 844 2100");
  const [headquarters, setHeadquarters] = useState("Islamabad, Pakistan");
  const [geosentryFee, setGeosentryFee] = useState("3500");

  const loadSettings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await portalFetch("/api/portal/settings");
      const list = extractArray<PortalSiteSetting>(res, ["settings"]);
      for (const s of list) {
        if (s.key === "site_name") setSiteName(s.value);
        if (s.key === "site_tagline") setSiteTagline(s.value);
        if (s.key === "contact_email") setContactEmail(s.value);
        if (s.key === "contact_phone") setContactPhone(s.value);
        if (s.key === "headquarters_address") setHeadquarters(s.value);
        if (s.key === "geosentry_standard_fee") setGeosentryFee(s.value);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load site settings");
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

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccessMsg(null);
    try {
      await portalFetch("/api/portal/settings", {
        method: "PUT",
        body: JSON.stringify({
          settings: [
            { key: "site_name", value: siteName, group: "general", label: "Platform Name" },
            { key: "site_tagline", value: siteTagline, group: "general", label: "Platform Tagline" },
            { key: "contact_email", value: contactEmail, group: "contact", label: "Primary Contact Email" },
            { key: "contact_phone", value: contactPhone, group: "contact", label: "Primary Phone" },
            { key: "headquarters_address", value: headquarters, group: "contact", label: "Headquarters Location" },
            { key: "geosentry_standard_fee", value: geosentryFee, group: "geosentry", label: "GeoSentry Standard Fee" },
          ],
        }),
      });
      setSuccessMsg("Site-wide settings saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save site settings");
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
    <div className="space-y-6 max-w-3xl">
      <PageHeader
        title="Platform & Site-Wide Settings"
        subtitle="Configure general branding, corporate contact endpoints, and default platform parameters"
      />

      {error && <Alert variant="error" title="Error" message={error} onClose={() => setError(null)} />}
      {successMsg && <Alert variant="success" title="Saved" message={successMsg} onClose={() => setSuccessMsg(null)} />}

      <form onSubmit={handleSave} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>General Branding (`general`)</CardTitle>
            <CardDescription>Organization title and public positioning statement</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input label="Platform Name" value={siteName} onChange={(e) => setSiteName(e.target.value)} />
            <Input label="Platform Tagline" value={siteTagline} onChange={(e) => setSiteTagline(e.target.value)} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact & Headquarters (`contact`)</CardTitle>
            <CardDescription>Displayed on public contact pages and inquiry notifications</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Primary Contact Email" type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
            <Input label="Primary Phone" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
            <div className="md:col-span-2">
              <Input label="Headquarters Location" value={headquarters} onChange={(e) => setHeadquarters(e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>GeoSentry Base Reference (`geosentry`)</CardTitle>
            <CardDescription>Baseline fee displayed on public GeoSentry overview</CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              label="Standard Desktop Screening Fee (USD)"
              type="number"
              value={geosentryFee}
              onChange={(e) => setGeosentryFee(e.target.value)}
            />
          </CardContent>
        </Card>

        <Button type="submit" isLoading={isSaving} leftIcon={<Save className="h-4 w-4" />}>
          Save All Site Settings
        </Button>
      </form>
    </div>
  );
}
