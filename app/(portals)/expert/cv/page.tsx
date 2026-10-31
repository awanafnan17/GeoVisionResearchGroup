"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/portals/shared/PageHeader";
import { StatsGrid } from "@/components/portals/shared/StatsGrid";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { Spinner } from "@/components/ui/Spinner";
import {
  portalFetch,
  extractArray,
  type PortalExpert,
} from "@/components/portals/shared/portal-api";
import { Save, FileText, ExternalLink } from "lucide-react";

export default function ExpertCvManagementPage() {
  const [profile, setProfile] = useState<PortalExpert | null>(null);
  const [cvFile, setCvFile] = useState("");
  const [cvIsPublic, setCvIsPublic] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const loadCvData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await portalFetch("/api/portal/experts");
      const list = extractArray<PortalExpert>(res, ["experts"]);
      const me = list[0] ?? null;
      if (me) {
        setProfile(me);
        setCvFile(me.cvFile ?? "");
        setCvIsPublic(me.cvIsPublic);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load CV settings");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadCvData();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadCvData]);

  async function handleSaveCv(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) return;
    setIsSaving(true);
    setError(null);
    setSuccessMsg(null);
    try {
      await portalFetch(`/api/portal/experts/${profile.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          cvFile: cvFile.trim() || null,
          cvIsPublic,
        }),
      });
      setSuccessMsg("Curriculum Vitae URL and privacy preferences updated.");
      await loadCvData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save CV settings");
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
        title="Curriculum Vitae (CV) Management"
        subtitle="Control your technical CV document link and public download availability"
      />

      {error && <Alert variant="error" title="Error" message={error} onClose={() => setError(null)} />}
      {successMsg && <Alert variant="success" title="Saved" message={successMsg} onClose={() => setSuccessMsg(null)} />}

      {profile && (
        <StatsGrid
          columns={2}
          stats={[
            { title: "Total CV Downloads", value: profile.cvDownloads, icon: "Download", color: "gold" },
            { title: "Profile Views", value: profile.profileViews, icon: "Eye", color: "blue" },
          ]}
        />
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-geo-gold" />
            CV Document & Privacy Controls
          </CardTitle>
          <CardDescription>
            Provide a direct PDF URL for your curriculum vitae and choose whether prospective clients can download it
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveCv} className="space-y-4">
            <Input
              label="CV Document URL (PDF)"
              placeholder="/uploads/cvs/dr-expert-cv.pdf"
              value={cvFile}
              onChange={(e) => setCvFile(e.target.value)}
            />

            {cvFile && (
              <div>
                <a
                  href={cvFile}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-geo-gold hover:underline"
                >
                  Preview Current CV Document <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            )}

            <label className="flex items-center gap-3 p-3.5 rounded-none bg-[#0D1F35] border border-white/10 cursor-pointer">
              <input
                type="checkbox"
                checked={cvIsPublic}
                onChange={(e) => setCvIsPublic(e.target.checked)}
                className="accent-[#C8A951] h-4 w-4"
              />
              <div>
                <p className="text-sm font-medium text-geo-white">Allow Public CV Download</p>
                <p className="text-xs text-geo-slate">
                  When enabled, visitors on your public expert profile can download your CV PDF.
                </p>
              </div>
            </label>

            <Button type="submit" isLoading={isSaving} leftIcon={<Save className="h-4 w-4" />}>
              Save CV Settings
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
