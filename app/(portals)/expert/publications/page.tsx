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
  type PortalExpert,
  type PublicationEntry,
} from "@/components/portals/shared/portal-api";
import { Plus, Save, Trash2, BookOpen, ExternalLink } from "lucide-react";

export default function ExpertPublicationsPage() {
  const [profile, setProfile] = useState<PortalExpert | null>(null);
  const [publications, setPublications] = useState<PublicationEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [newTitle, setNewTitle] = useState("");
  const [newJournal, setNewJournal] = useState("");
  const [newYear, setNewYear] = useState("2025");
  const [newDoi, setNewDoi] = useState("");

  const loadPublications = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await portalFetch("/api/portal/experts");
      const list = extractArray<PortalExpert>(res, ["experts"]);
      const me = list[0] ?? null;
      if (me) {
        setProfile(me);
        setPublications(Array.isArray(me.publications) ? me.publications : []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load publications");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadPublications();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadPublications]);

  async function persistPublications(updatedList: PublicationEntry[], message: string) {
    if (!profile) return;
    setIsSaving(true);
    setError(null);
    setSuccessMsg(null);
    try {
      await portalFetch(`/api/portal/experts/${profile.id}`, {
        method: "PATCH",
        body: JSON.stringify({ publications: updatedList }),
      });
      setPublications(updatedList);
      setSuccessMsg(message);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save publications");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleAddPublication(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const entry: PublicationEntry = {
      title: newTitle.trim(),
      journal: newJournal.trim() || undefined,
      year: newYear.trim() || String(new Date().getFullYear()),
      doi: newDoi.trim() || undefined,
      url: newDoi.trim().startsWith("http") ? newDoi.trim() : undefined,
    };
    const next = [entry, ...publications];
    await persistPublications(next, "Publication added to your profile.");
    setNewTitle("");
    setNewJournal("");
    setNewDoi("");
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
        title="Academic & Technical Publications"
        subtitle="Manage peer-reviewed papers, geological survey bulletins, and conference proceedings on your profile"
      />

      {error && <Alert variant="error" title="Error" message={error} onClose={() => setError(null)} />}
      {successMsg && <Alert variant="success" title="Saved" message={successMsg} onClose={() => setSuccessMsg(null)} />}

      <Card>
        <CardHeader>
          <CardTitle>Add New Publication</CardTitle>
          <CardDescription>Include journal name, publication year, and DOI or external URL</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddPublication} className="space-y-4">
            <Input
              label="Paper / Report Title *"
              required
              placeholder="Structural Controls on Porphyry Cu-Au Mineralization in the Tethyan Belt"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Journal / Bulletin"
                placeholder="Economic Geology"
                value={newJournal}
                onChange={(e) => setNewJournal(e.target.value)}
              />
              <Input
                label="Publication Year"
                placeholder="2025"
                value={newYear}
                onChange={(e) => setNewYear(e.target.value)}
              />
              <Input
                label="DOI or Full URL"
                placeholder="10.2113/gsecongeo.120.1.45"
                value={newDoi}
                onChange={(e) => setNewDoi(e.target.value)}
              />
            </div>
            <Button type="submit" size="sm" isLoading={isSaving} leftIcon={<Plus className="h-4 w-4" />}>
              Add Publication
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Published Works ({publications.length})</CardTitle>
          {publications.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              isLoading={isSaving}
              onClick={() => void persistPublications(publications, "Publications order saved.")}
              leftIcon={<Save className="h-3.5 w-3.5" />}
            >
              Save List
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {publications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <BookOpen className="h-10 w-10 text-geo-slate/30 mb-2" />
              <p className="text-sm text-geo-slate">No publications listed yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {publications.map((pub, idx) => (
                <div
                  key={idx}
                  className="flex items-start justify-between gap-4 p-4 rounded-none bg-white/[0.02] border border-white/[0.06]"
                >
                  <div className="space-y-1">
                    <p className="font-medium text-geo-white text-sm">{pub.title}</p>
                    <p className="text-xs text-geo-slate">
                      {pub.journal || "Technical Publication"} | {pub.year}
                    </p>
                    {(pub.doi || pub.url) && (
                      <a
                        href={pub.url || `https://doi.org/${pub.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-geo-gold hover:underline"
                      >
                        {pub.doi || pub.url} <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const next = publications.filter((_, i) => i !== idx);
                      void persistPublications(next, "Publication removed.");
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-red-400" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
