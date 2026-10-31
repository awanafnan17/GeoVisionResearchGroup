"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { PageHeader } from "@/components/portals/shared/PageHeader";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge, getGeoSentryStatusVariant } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { Spinner } from "@/components/ui/Spinner";
import { formatDate, getDepositTypeLabel } from "@/lib/utils";
import {
  portalFetch,
  extractObject,
  extractArray,
  GEOSENTRY_STATUS_OPTIONS,
  GEOSENTRY_VERDICT_OPTIONS,
  getVerdictBadgeVariant,
  type PortalGeoSentryRequest,
  type PortalExpert,
} from "@/components/portals/shared/portal-api";
import {
  ArrowLeft,
  Save,
  MapPin,
  Building2,
  User,
  FileText,
  DollarSign,
  ShieldCheck,
  MessageSquare,
  Send,
  ExternalLink,
} from "lucide-react";

export default function GeoSentryRequestDetailPage() {
  const params = useParams<{ id: string }>();
  const requestId = params.id;

  const [request, setRequest] = useState<PortalGeoSentryRequest | null>(null);
  const [experts, setExperts] = useState<PortalExpert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Editable scoring & pipeline states
  const [geologicalScore, setGeologicalScore] = useState<number>(0);
  const [jurisdictionScore, setJurisdictionScore] = useState<number>(0);
  const [operatorScore, setOperatorScore] = useState<number>(0);
  const [verdict, setVerdict] = useState<"GO" | "NO_GO" | "CONDITIONAL" | "PENDING">("PENDING");
  const [status, setStatus] = useState<string>("SUBMITTED");
  const [quotedPrice, setQuotedPrice] = useState<string>("");
  const [quotedCurrency, setQuotedCurrency] = useState<string>("USD");
  const [assignedToId, setAssignedToId] = useState<string>("");
  const [reportFile, setReportFile] = useState<string>("");
  const [reportSummary, setReportSummary] = useState<string>("");
  const [clientNotes, setClientNotes] = useState<string>("");
  const [internalNotes, setInternalNotes] = useState<string>("");

  // Timeline note addition
  const [newNoteContent, setNewNoteContent] = useState<string>("");
  const [newNoteIsInternal, setNewNoteIsInternal] = useState<boolean>(true);
  const [isAddingNote, setIsAddingNote] = useState<boolean>(false);

  const populateState = useCallback((req: PortalGeoSentryRequest) => {
    setRequest(req);
    setGeologicalScore(req.geologicalScore ?? 0);
    setJurisdictionScore(req.jurisdictionScore ?? 0);
    setOperatorScore(req.operatorScore ?? 0);
    setVerdict(req.verdict ?? "PENDING");
    setStatus(req.status ?? "SUBMITTED");
    setQuotedPrice(req.quotedPrice != null ? String(req.quotedPrice) : "");
    setQuotedCurrency(req.quotedCurrency || "USD");
    setAssignedToId(req.assignedToId ?? "");
    setReportFile(req.reportFile ?? "");
    setReportSummary(req.reportSummary ?? "");
    setClientNotes(req.clientNotes ?? "");
    setInternalNotes(req.internalNotes ?? "");
  }, []);

  const loadData = useCallback(async () => {
    if (!requestId) return;
    setIsLoading(true);
    setError(null);
    try {
      const [reqRes, expRes] = await Promise.all([
        portalFetch(`/api/geosentry/requests/${requestId}`),
        portalFetch("/api/portal/experts").catch(() => null),
      ]);

      const parsedReq = extractObject<PortalGeoSentryRequest>(reqRes, ["request"]);
      if (parsedReq && parsedReq.id) {
        populateState(parsedReq);
      } else {
        setError("Screening request not found.");
      }

      if (expRes) {
        const expList = extractArray<PortalExpert>(expRes, ["experts"]);
        setExperts(expList);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load screening request details");
    } finally {
      setIsLoading(false);
    }
  }, [requestId, populateState]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadData();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadData]);

  const clampGeo = (val: number) => Math.max(0, Math.min(40, Math.round(val || 0)));
  const clampJur = (val: number) => Math.max(0, Math.min(40, Math.round(val || 0)));
  const clampOp = (val: number) => Math.max(0, Math.min(20, Math.round(val || 0)));

  const overallScore = clampGeo(geologicalScore) + clampJur(jurisdictionScore) + clampOp(operatorScore);

  async function handleSaveAssessment(e: React.FormEvent) {
    e.preventDefault();
    if (!requestId) return;
    setIsSaving(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const payload = {
        geologicalScore: clampGeo(geologicalScore),
        jurisdictionScore: clampJur(jurisdictionScore),
        operatorScore: clampOp(operatorScore),
        overallScore,
        verdict,
        status,
        quotedPrice: quotedPrice.trim() ? Number(quotedPrice) : null,
        quotedCurrency,
        assignedToId: assignedToId || null,
        reportFile: reportFile.trim() || null,
        reportSummary: reportSummary.trim() || null,
        clientNotes: clientNotes.trim() || null,
        internalNotes: internalNotes.trim() || null,
      };
      const res = await portalFetch(`/api/geosentry/requests/${requestId}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
      const updated = extractObject<PortalGeoSentryRequest>(res, ["request"]);
      if (updated && updated.id) {
        populateState(updated);
      } else {
        await loadData();
      }
      setSuccessMsg("Assessment scores, status, and delivery details saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save assessment changes");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleAddTimelineNote(e: React.FormEvent) {
    e.preventDefault();
    if (!requestId || !newNoteContent.trim()) return;
    setIsAddingNote(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const res = await portalFetch(`/api/geosentry/requests/${requestId}`, {
        method: "PATCH",
        body: JSON.stringify({
          newNote: {
            content: newNoteContent.trim(),
            isInternal: newNoteIsInternal,
          },
        }),
      });
      const updated = extractObject<PortalGeoSentryRequest>(res, ["request"]);
      setNewNoteContent("");
      if (updated && updated.id) {
        populateState(updated);
      } else {
        await loadData();
      }
      setSuccessMsg("Timeline note added.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add timeline note");
    } finally {
      setIsAddingNote(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner size="lg" color="gold" />
      </div>
    );
  }

  if (!request) {
    return (
      <div className="space-y-4">
        <Link href="/geosentry-portal/requests">
          <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="h-4 w-4" />}>
            Back to Screening Requests
          </Button>
        </Link>
        <Alert variant="error" title="Not Found" message={error || "Screening request could not be found."} />
      </div>
    );
  }

  const commoditiesList: string[] = Array.isArray(request.commodities)
    ? request.commodities.map(String)
    : request.commodityFocus
      ? [request.commodityFocus]
      : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/geosentry-portal/requests">
          <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="h-4 w-4" />}>
            Back to Pipeline
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <Badge variant={request.priority === "RUSH" ? "danger" : "slate"} size="md">
            {request.priority} PRIORITY
          </Badge>
          <Badge variant={getGeoSentryStatusVariant(status)} size="md" dot>
            {status.replace(/_/g, " ")}
          </Badge>
          <Badge variant={getVerdictBadgeVariant(verdict)} size="md">
            VERDICT: {verdict.replace(/_/g, " ")}
          </Badge>
        </div>
      </div>

      <PageHeader
        title={`${request.referenceNumber}: ${request.targetName}`}
        subtitle={`Submitted on ${formatDate(request.createdAt)} | ${request.targetCountry} | ${getDepositTypeLabel(request.depositType)}`}
      />

      {error && <Alert variant="error" title="Action Error" message={error} onClose={() => setError(null)} />}
      {successMsg && <Alert variant="success" title="Saved" message={successMsg} onClose={() => setSuccessMsg(null)} />}

      <form onSubmit={handleSaveAssessment} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Columns: Client, Target, Technical Details, Report Delivery */}
          <div className="lg:col-span-2 space-y-6">
            {/* Client & Target Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-geo-gold" />
                    Client Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2.5 text-sm">
                  <div>
                    <span className="text-xs text-geo-slate block">Contact Name</span>
                    <span className="font-medium text-geo-white">{request.clientName}</span>
                  </div>
                  <div>
                    <span className="text-xs text-geo-slate block">Email Address</span>
                    <span className="text-geo-white">{request.clientEmail}</span>
                  </div>
                  {request.clientPhone && (
                    <div>
                      <span className="text-xs text-geo-slate block">Phone</span>
                      <span className="text-geo-white">{request.clientPhone}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-xs text-geo-slate block">Organization & Country</span>
                    <span className="text-geo-white">
                      {request.clientOrganization || "Independent"} {request.clientCountry ? `(${request.clientCountry})` : ""}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-geo-gold" />
                    Target Specifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2.5 text-sm">
                  <div>
                    <span className="text-xs text-geo-slate block">Target & Jurisdiction</span>
                    <span className="font-medium text-geo-white">
                      {request.targetName}, {request.targetRegion ? `${request.targetRegion}, ` : ""}{request.targetCountry}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-geo-slate block">Coordinates & Tenement Area</span>
                    <span className="font-mono text-xs text-geo-white">
                      {request.targetCoordinates || "Coordinates not specified"}
                      {request.targetSizeHectares != null ? ` | ${String(request.targetSizeHectares)} ha` : ""}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-geo-slate block">Deposit Model</span>
                    <span className="text-geo-white">{getDepositTypeLabel(request.depositType)}</span>
                  </div>
                  <div>
                    <span className="text-xs text-geo-slate block">Commodities</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {commoditiesList.map((c) => (
                        <Badge key={c} variant="gold" size="sm">
                          {c}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Project Scope & Client Questions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-geo-gold" />
                  Submitted Geological Context & Key Questions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-geo-slate mb-1">
                    Project Description
                  </h4>
                  <p className="text-geo-white whitespace-pre-line leading-relaxed bg-white/[0.02] p-3 rounded-none border border-white/[0.05]">
                    {request.projectDescription}
                  </p>
                </div>

                {request.existingData && (
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-geo-slate mb-1">
                      Existing Datasets
                    </h4>
                    <p className="text-geo-white whitespace-pre-line bg-white/[0.02] p-3 rounded-none border border-white/[0.05]">
                      {request.existingData}
                    </p>
                  </div>
                )}

                {request.specificConcerns && (
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-geo-slate mb-1">
                      Specific Risk Concerns
                    </h4>
                    <p className="text-geo-white whitespace-pre-line bg-white/[0.02] p-3 rounded-none border border-white/[0.05]">
                      {request.specificConcerns}
                    </p>
                  </div>
                )}

                {request.keyQuestions && (
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-geo-slate mb-1">
                      Key Decision Questions
                    </h4>
                    <p className="text-geo-white whitespace-pre-line bg-white/[0.02] p-3 rounded-none border border-white/[0.05]">
                      {request.keyQuestions}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Report Delivery & Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Report Delivery & Executive Summary</CardTitle>
                <CardDescription>
                  Attach the final GeoSentry desktop screening dossier and executive notes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3 items-end">
                  <div className="flex-1 w-full">
                    <Input
                      label="Delivered Report File URL (PDF)"
                      placeholder="https://storage.geovision.org/reports/GS-2026-0001.pdf"
                      value={reportFile}
                      onChange={(e) => setReportFile(e.target.value)}
                    />
                  </div>
                  {reportFile && (
                    <a
                      href={reportFile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 h-10 px-4 rounded-none border border-geo-gold/30 text-xs font-medium text-geo-gold hover:bg-geo-gold/10"
                    >
                      Open Report <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-medium uppercase tracking-widest text-geo-slate-light">
                    Executive Report Summary
                  </label>
                  <textarea
                    rows={4}
                    value={reportSummary}
                    onChange={(e) => setReportSummary(e.target.value)}
                    placeholder="Summarize geological prospectivity, structural controls, jurisdictional factors, and final recommendation..."
                    className="w-full rounded-none border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-geo-white placeholder:text-geo-slate/50 focus:outline-none focus:border-geo-gold"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-medium uppercase tracking-widest text-geo-slate-light">
                      Client-Visible Notes
                    </label>
                    <textarea
                      rows={3}
                      value={clientNotes}
                      onChange={(e) => setClientNotes(e.target.value)}
                      placeholder="Status updates or guidance visible to the client..."
                      className="w-full rounded-none border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-geo-white placeholder:text-geo-slate/50 focus:outline-none focus:border-geo-gold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-medium uppercase tracking-widest text-geo-slate-light">
                      GeoSentry Manager Internal Notes (Confidential)
                    </label>
                    <textarea
                      rows={3}
                      value={internalNotes}
                      onChange={(e) => setInternalNotes(e.target.value)}
                      placeholder="Strictly confidential internal assessment notes..."
                      className="w-full rounded-none border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-geo-white placeholder:text-geo-slate/50 focus:outline-none focus:border-geo-gold"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: 100-Point Scorer, Pipeline Status, Commercial & Reviewer */}
          <div className="space-y-6">
            {/* 100-Point Weighted Assessment Scorer */}
            <Card className="border-geo-gold/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-geo-gold">
                  <ShieldCheck className="h-4 w-4" />
                  100-Point Risk Scorer
                </CardTitle>
                <CardDescription>
                  Weighted scoring framework across geology, jurisdiction, and operator quality
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Live Total Score Display */}
                <div className="p-4 rounded-none bg-[#0D1F35] border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-xs uppercase tracking-widest text-geo-slate block">
                      Calculated Overall Score
                    </span>
                    <span className="text-3xl font-bold font-mono text-geo-gold">
                      {overallScore}
                      <span className="text-base font-normal text-geo-slate">/100</span>
                    </span>
                  </div>
                  <Badge variant={getVerdictBadgeVariant(verdict)} size="md">
                    {verdict.replace(/_/g, " ")}
                  </Badge>
                </div>

                {/* Geological Assessment (0-40) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <label htmlFor="geo-score" className="font-semibold text-geo-white">
                      1. Geological Assessment (Max 40)
                    </label>
                    <span className="font-mono text-geo-gold">{clampGeo(geologicalScore)} / 40</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      id="geo-score"
                      type="range"
                      min={0}
                      max={40}
                      value={clampGeo(geologicalScore)}
                      onChange={(e) => setGeologicalScore(clampGeo(Number(e.target.value)))}
                      className="flex-1 accent-[#C8A951]"
                    />
                    <input
                      type="number"
                      min={0}
                      max={40}
                      value={clampGeo(geologicalScore)}
                      onChange={(e) => setGeologicalScore(clampGeo(Number(e.target.value)))}
                      className="w-16 h-9 rounded-none border border-white/10 bg-[#0D1F35] px-2 text-center font-mono text-sm text-geo-white"
                    />
                  </div>
                </div>

                {/* Jurisdiction and ESG (0-40) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <label htmlFor="jur-score" className="font-semibold text-geo-white">
                      2. Jurisdiction and ESG (Max 40)
                    </label>
                    <span className="font-mono text-geo-gold">{clampJur(jurisdictionScore)} / 40</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      id="jur-score"
                      type="range"
                      min={0}
                      max={40}
                      value={clampJur(jurisdictionScore)}
                      onChange={(e) => setJurisdictionScore(clampJur(Number(e.target.value)))}
                      className="flex-1 accent-[#C8A951]"
                    />
                    <input
                      type="number"
                      min={0}
                      max={40}
                      value={clampJur(jurisdictionScore)}
                      onChange={(e) => setJurisdictionScore(clampJur(Number(e.target.value)))}
                      className="w-16 h-9 rounded-none border border-white/10 bg-[#0D1F35] px-2 text-center font-mono text-sm text-geo-white"
                    />
                  </div>
                </div>

                {/* Operator Quality (0-20) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <label htmlFor="op-score" className="font-semibold text-geo-white">
                      3. Operator Quality (Max 20)
                    </label>
                    <span className="font-mono text-geo-gold">{clampOp(operatorScore)} / 20</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      id="op-score"
                      type="range"
                      min={0}
                      max={20}
                      value={clampOp(operatorScore)}
                      onChange={(e) => setOperatorScore(clampOp(Number(e.target.value)))}
                      className="flex-1 accent-[#C8A951]"
                    />
                    <input
                      type="number"
                      min={0}
                      max={20}
                      value={clampOp(operatorScore)}
                      onChange={(e) => setOperatorScore(clampOp(Number(e.target.value)))}
                      className="w-16 h-9 rounded-none border border-white/10 bg-[#0D1F35] px-2 text-center font-mono text-sm text-geo-white"
                    />
                  </div>
                </div>

                {/* Verdict Selector */}
                <div className="space-y-1.5 pt-2 border-t border-white/[0.06]">
                  <label className="block text-[11px] font-medium uppercase tracking-widest text-geo-slate-light">
                    Screening Verdict
                  </label>
                  <select
                    value={verdict}
                    onChange={(e) => setVerdict(e.target.value as "GO" | "NO_GO" | "CONDITIONAL" | "PENDING")}
                    className="flex h-10 w-full rounded-none border border-white/10 bg-[#0D1F35] px-3 py-2 text-sm text-geo-white focus:outline-none focus:border-geo-gold"
                  >
                    {GEOSENTRY_VERDICT_OPTIONS.map((v) => (
                      <option key={v.value} value={v.value}>
                        {v.label}
                      </option>
                    ))}
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Pipeline Status, Quote & Reviewer */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-geo-gold" />
                  Pipeline, Quote & Reviewer
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-medium uppercase tracking-widest text-geo-slate-light">
                    Pipeline Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="flex h-10 w-full rounded-none border border-white/10 bg-[#0D1F35] px-3 py-2 text-sm text-geo-white focus:outline-none focus:border-geo-gold"
                  >
                    {GEOSENTRY_STATUS_OPTIONS.map((st) => (
                      <option key={st} value={st}>
                        {st.replace(/_/g, " ")}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <Input
                      label="Quoted Price"
                      type="number"
                      step="0.01"
                      placeholder="3500"
                      value={quotedPrice}
                      onChange={(e) => setQuotedPrice(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-medium uppercase tracking-widest text-geo-slate-light">
                      Currency
                    </label>
                    <select
                      value={quotedCurrency}
                      onChange={(e) => setQuotedCurrency(e.target.value)}
                      className="flex h-10 w-full rounded-none border border-white/10 bg-[#0D1F35] px-2 py-2 text-sm text-geo-white focus:outline-none focus:border-geo-gold"
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                      <option value="CAD">CAD</option>
                      <option value="AUD">AUD</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-medium uppercase tracking-widest text-geo-slate-light">
                    Assigned Technical Reviewer
                  </label>
                  <select
                    value={assignedToId}
                    onChange={(e) => setAssignedToId(e.target.value)}
                    className="flex h-10 w-full rounded-none border border-white/10 bg-[#0D1F35] px-3 py-2 text-sm text-geo-white focus:outline-none focus:border-geo-gold"
                  >
                    <option value="">Unassigned</option>
                    {experts.map((exp) => {
                      const uid = exp.userId || exp.user?.id || exp.id;
                      return (
                        <option key={exp.id} value={uid}>
                          {exp.fullName} ({exp.designation})
                        </option>
                      );
                    })}
                  </select>
                </div>

                <Button type="submit" className="w-full" isLoading={isSaving} leftIcon={<Save className="h-4 w-4" />}>
                  Save Assessment & Pipeline
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>

      {/* Notes Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-geo-gold" />
            Screening Activity & Notes Timeline
          </CardTitle>
          <CardDescription>
            Log internal technical review observations or external client status messages
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleAddTimelineNote} className="space-y-3 bg-white/[0.02] p-4 rounded-none border border-white/[0.06]">
            <textarea
              rows={2}
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              placeholder="Write a review observation, status note, or client update..."
              className="w-full rounded-none border border-white/10 bg-[#0D1F35] px-3 py-2 text-sm text-geo-white placeholder:text-geo-slate/50 focus:outline-none focus:border-geo-gold"
            />
            <div className="flex flex-wrap items-center justify-between gap-3">
              <label className="flex items-center gap-2 text-xs text-geo-slate cursor-pointer">
                <input
                  type="checkbox"
                  checked={newNoteIsInternal}
                  onChange={(e) => setNewNoteIsInternal(e.target.checked)}
                  className="rounded border-white/20 accent-[#C8A951]"
                />
                <span>Internal Note Only (Hidden from Client)</span>
              </label>
              <Button
                type="submit"
                size="sm"
                isLoading={isAddingNote}
                disabled={!newNoteContent.trim()}
                leftIcon={<Send className="h-3.5 w-3.5" />}
              >
                Add Note
              </Button>
            </div>
          </form>

          {(!request.statusNotes || request.statusNotes.length === 0) ? (
            <p className="text-xs text-geo-slate text-center py-6">No timeline notes recorded yet.</p>
          ) : (
            <div className="space-y-3">
              {request.statusNotes.map((note) => (
                <div
                  key={note.id}
                  className="p-3.5 rounded-none bg-white/[0.02] border border-white/[0.06] space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="h-3.5 w-3.5 text-geo-gold" />
                      <span className="text-xs font-medium text-geo-white">{note.createdBy}</span>
                      <Badge variant={note.isInternal ? "purple" : "teal"} size="sm">
                        {note.isInternal ? "Internal" : "Client Visible"}
                      </Badge>
                    </div>
                    <span className="text-[11px] text-geo-slate">{formatDate(note.createdAt)}</span>
                  </div>
                  <p className="text-sm text-geo-slate-light whitespace-pre-line">{note.content}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
