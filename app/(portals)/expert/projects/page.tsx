"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/portals/shared/PageHeader";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge, getGeoSentryStatusVariant } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Spinner } from "@/components/ui/Spinner";
import { getDepositTypeLabel } from "@/lib/utils";
import {
  portalFetch,
  extractArray,
  getVerdictBadgeVariant,
  type PortalProject,
  type PortalGeoSentryRequest,
} from "@/components/portals/shared/portal-api";
import { FolderOpen, ShieldCheck, Save } from "lucide-react";

export default function ExpertProjectsPage() {
  const [projects, setProjects] = useState<PortalProject[]>([]);
  const [assignedRequests, setAssignedRequests] = useState<PortalGeoSentryRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [selectedReq, setSelectedReq] = useState<PortalGeoSentryRequest | null>(null);
  const [geoScore, setGeoScore] = useState<number>(0);
  const [jurScore, setJurScore] = useState<number>(0);
  const [opScore, setOpScore] = useState<number>(0);
  const [reviewNote, setReviewNote] = useState<string>("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [projRes, gsRes] = await Promise.all([
        portalFetch("/api/portal/portfolio").catch(() => null),
        portalFetch("/api/geosentry/requests").catch(() => null),
      ]);
      if (projRes) {
        setProjects(extractArray<PortalProject>(projRes, ["projects"]));
      }
      if (gsRes) {
        setAssignedRequests(extractArray<PortalGeoSentryRequest>(gsRes, ["requests"]));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load projects and assigned screenings");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadData();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadData]);

  function openReviewWorkbench(req: PortalGeoSentryRequest) {
    setSelectedReq(req);
    setGeoScore(req.geologicalScore ?? 0);
    setJurScore(req.jurisdictionScore ?? 0);
    setOpScore(req.operatorScore ?? 0);
    setReviewNote("");
  }

  async function handleSubmitTechnicalReview(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedReq) return;
    setIsSubmittingReview(true);
    setError(null);
    setSuccessMsg(null);
    try {
      await portalFetch(`/api/geosentry/requests/${selectedReq.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          geologicalScore: Math.max(0, Math.min(40, geoScore)),
          jurisdictionScore: Math.max(0, Math.min(40, jurScore)),
          operatorScore: Math.max(0, Math.min(20, opScore)),
          ...(reviewNote.trim()
            ? {
                newNote: {
                  content: reviewNote.trim(),
                  isInternal: false,
                },
              }
            : {}),
        }),
      });
      setSuccessMsg(`Submitted technical review scores for ${selectedReq.referenceNumber}.`);
      setSelectedReq(null);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit technical review");
    } finally {
      setIsSubmittingReview(false);
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
        title="My Projects & Assigned GeoSentry Reviews"
        subtitle="Consultancy case studies featuring your expertise and assigned GeoSentry desktop screenings"
      />

      {error && <Alert variant="error" title="Error" message={error} onClose={() => setError(null)} />}
      {successMsg && <Alert variant="success" title="Submitted" message={successMsg} onClose={() => setSuccessMsg(null)} />}

      {/* Assigned GeoSentry Reviews */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-geo-gold" />
            Assigned GeoSentry Technical Reviews ({assignedRequests.length})
          </CardTitle>
          <CardDescription>
            Submit 100-point technical component scores and geological observations for targets assigned to you
          </CardDescription>
        </CardHeader>
        <CardContent>
          {assignedRequests.length === 0 ? (
            <p className="text-xs text-geo-slate py-4">No GeoSentry screening requests are currently assigned to you.</p>
          ) : (
            <div className="space-y-3">
              {assignedRequests.map((req) => (
                <div
                  key={req.id}
                  className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-none bg-white/[0.02] border border-white/[0.06]"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-geo-gold">{req.referenceNumber}</span>
                      <Badge variant={getGeoSentryStatusVariant(req.status)} size="sm" dot>
                        {req.status.replace(/_/g, " ")}
                      </Badge>
                      <Badge variant={getVerdictBadgeVariant(req.verdict)} size="sm">
                        {req.verdict}
                      </Badge>
                    </div>
                    <p className="font-medium text-geo-white">{req.targetName}</p>
                    <p className="text-xs text-geo-slate">
                      {req.targetCountry} | {getDepositTypeLabel(req.depositType)} | {req.commodityFocus}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm text-geo-gold">
                      Score: {req.overallScore != null ? `${req.overallScore}/100` : "Unscored"}
                    </span>
                    <Button variant="outline" size="sm" onClick={() => openReviewWorkbench(req)}>
                      Score & Note
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedReq && (
            <form
              onSubmit={handleSubmitTechnicalReview}
              className="mt-4 p-4 rounded-none bg-[#0D1F35] border border-geo-gold/30 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-geo-gold">
                  Technical Scoring Workbench: {selectedReq.referenceNumber} ({selectedReq.targetName})
                </h4>
                <span className="font-mono text-sm text-geo-white">
                  Total: {geoScore + jurScore + opScore}/100
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-geo-slate mb-1">Geological Assessment (0 to 40)</label>
                  <input
                    type="number"
                    min={0}
                    max={40}
                    value={geoScore}
                    onChange={(e) => setGeoScore(Number(e.target.value))}
                    className="w-full h-10 rounded-none border border-white/10 bg-white/[0.04] px-3 font-mono text-sm text-geo-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-geo-slate mb-1">Jurisdiction & ESG (0 to 40)</label>
                  <input
                    type="number"
                    min={0}
                    max={40}
                    value={jurScore}
                    onChange={(e) => setJurScore(Number(e.target.value))}
                    className="w-full h-10 rounded-none border border-white/10 bg-white/[0.04] px-3 font-mono text-sm text-geo-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-geo-slate mb-1">Operator Quality (0 to 20)</label>
                  <input
                    type="number"
                    min={0}
                    max={20}
                    value={opScore}
                    onChange={(e) => setOpScore(Number(e.target.value))}
                    className="w-full h-10 rounded-none border border-white/10 bg-white/[0.04] px-3 font-mono text-sm text-geo-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-geo-slate mb-1">Technical Review Note</label>
                <textarea
                  rows={3}
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                  placeholder="Provide geological observations and risk notes..."
                  className="w-full rounded-none border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-geo-white"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="secondary" size="sm" onClick={() => setSelectedReq(null)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" isLoading={isSubmittingReview} leftIcon={<Save className="h-3.5 w-3.5" />}>
                  Submit Technical Review
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Portfolio Case Studies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="h-4 w-4 text-geo-gold" />
            Portfolio Case Studies ({projects.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {projects.length === 0 ? (
            <p className="text-xs text-geo-slate py-4">You are not currently listed on any published portfolio projects.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((p) => (
                <div key={p.id} className="p-4 rounded-none bg-white/[0.02] border border-white/[0.06] space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="gold" size="sm">
                      {p.sector || "Consultancy"}
                    </Badge>
                    <span className="text-xs text-geo-slate">{p.country} {p.year ? `(${p.year})` : ""}</span>
                  </div>
                  <h4 className="font-semibold text-geo-white">{p.title}</h4>
                  <p className="text-xs text-geo-slate line-clamp-2">{p.description}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
