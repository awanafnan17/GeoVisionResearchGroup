"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/portals/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge, getGeoSentryStatusVariant } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { Spinner } from "@/components/ui/Spinner";
import { formatDateShort, getDepositTypeLabel } from "@/lib/utils";
import {
  portalFetch,
  extractArray,
  GEOSENTRY_STATUS_OPTIONS,
  getVerdictBadgeVariant,
  type PortalGeoSentryRequest,
} from "@/components/portals/shared/portal-api";
import { Search, Plus, ArrowRight, RefreshCw, Filter } from "lucide-react";

export default function GeoSentryRequestsPage() {
  const [requests, setRequests] = useState<PortalGeoSentryRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [verdictFilter, setVerdictFilter] = useState("ALL");

  const loadRequests = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await portalFetch("/api/geosentry/requests");
      const items = extractArray<PortalGeoSentryRequest>(res, ["requests"]);
      setRequests(items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load GeoSentry screening requests");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadRequests();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadRequests]);

  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      if (statusFilter !== "ALL" && req.status !== statusFilter) return false;
      if (priorityFilter !== "ALL" && req.priority !== priorityFilter) return false;
      if (verdictFilter !== "ALL" && req.verdict !== verdictFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchRef = req.referenceNumber.toLowerCase().includes(q);
        const matchClient = req.clientName.toLowerCase().includes(q) || req.clientEmail.toLowerCase().includes(q) || (req.clientOrganization ?? "").toLowerCase().includes(q);
        const matchTarget = req.targetName.toLowerCase().includes(q) || req.targetCountry.toLowerCase().includes(q);
        const matchCommodity = req.commodityFocus.toLowerCase().includes(q);
        if (!matchRef && !matchClient && !matchTarget && !matchCommodity) return false;
      }
      return true;
    });
  }, [requests, statusFilter, priorityFilter, verdictFilter, searchQuery]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="GeoSentry Screening Requests"
        subtitle="Manage desktop geological screening pipeline, 100-point risk assessments, and Go/No-Go verdicts"
        action={
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={() => void loadRequests()} leftIcon={<RefreshCw className="h-3.5 w-3.5" />}>
              Refresh
            </Button>
            <Link href="/geosentry-portal/new-request">
              <Button size="sm" leftIcon={<Plus className="h-4 w-4" />}>
                Log New Request
              </Button>
            </Link>
          </div>
        }
      />

      {error && <Alert variant="error" title="Error loading pipeline" message={error} onClose={() => setError(null)} />}

      <Card>
        <CardContent className="py-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
            <Input
              label="Search Pipeline"
              placeholder="Reference, client, target, country..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="h-4 w-4" />}
            />

            <div className="space-y-1.5">
              <label className="block text-[11px] font-medium uppercase tracking-widest text-geo-slate-light">
                Pipeline Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="flex h-10 w-full rounded-none border border-white/10 bg-[#0D1F35] px-3 py-2 text-sm text-geo-white focus:outline-none focus:border-geo-gold"
              >
                <option value="ALL">All Statuses</option>
                {GEOSENTRY_STATUS_OPTIONS.map((st) => (
                  <option key={st} value={st}>
                    {st.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-medium uppercase tracking-widest text-geo-slate-light">
                Priority
              </label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="flex h-10 w-full rounded-none border border-white/10 bg-[#0D1F35] px-3 py-2 text-sm text-geo-white focus:outline-none focus:border-geo-gold"
              >
                <option value="ALL">All Priorities</option>
                <option value="STANDARD">Standard</option>
                <option value="RUSH">Rush (72h)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-medium uppercase tracking-widest text-geo-slate-light">
                Verdict
              </label>
              <select
                value={verdictFilter}
                onChange={(e) => setVerdictFilter(e.target.value)}
                className="flex h-10 w-full rounded-none border border-white/10 bg-[#0D1F35] px-3 py-2 text-sm text-geo-white focus:outline-none focus:border-geo-gold"
              >
                <option value="ALL">All Verdicts</option>
                <option value="PENDING">Pending</option>
                <option value="GO">GO</option>
                <option value="CONDITIONAL">CONDITIONAL</option>
                <option value="NO_GO">NO GO</option>
              </select>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-geo-slate">
            <span className="flex items-center gap-1.5">
              <Filter className="h-3.5 w-3.5 text-geo-gold" />
              Showing {filteredRequests.length} of {requests.length} screening requests
            </span>
            {(statusFilter !== "ALL" || priorityFilter !== "ALL" || verdictFilter !== "ALL" || searchQuery) && (
              <button
                type="button"
                onClick={() => {
                  setStatusFilter("ALL");
                  setPriorityFilter("ALL");
                  setVerdictFilter("ALL");
                  setSearchQuery("");
                }}
                className="text-geo-gold hover:underline"
              >
                Reset Filters
              </button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Spinner size="lg" color="gold" />
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4">
              <Search className="h-10 w-10 text-geo-slate/30 mb-3" />
              <p className="text-base font-medium text-geo-white mb-1">No matching screening requests</p>
              <p className="text-xs text-geo-slate max-w-md mb-4">
                Adjust your search filters or log a new incoming GeoSentry desktop screening request.
              </p>
              <Link href="/geosentry-portal/new-request">
                <Button variant="outline" size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />}>
                  Log New Request
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06] bg-[#0D1F35]">
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-geo-slate">Reference</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-geo-slate">Client</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-geo-slate">Target & Country</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-geo-slate">Deposit Type</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-geo-slate">Priority</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-geo-slate">Score</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-geo-slate">Verdict</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-geo-slate">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-geo-slate">Reviewer</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-geo-slate">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {filteredRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3.5">
                        <Link
                          href={`/geosentry-portal/requests/${req.id}`}
                          className="font-mono text-xs font-semibold text-geo-gold hover:underline"
                        >
                          {req.referenceNumber}
                        </Link>
                        <p className="text-[11px] text-geo-slate mt-0.5">{formatDateShort(req.createdAt)}</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="font-medium text-geo-white">{req.clientName}</p>
                        <p className="text-xs text-geo-slate">{req.clientOrganization || req.clientEmail}</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="font-medium text-geo-white">{req.targetName}</p>
                        <p className="text-xs text-geo-slate">
                          {req.targetCountry} | {req.commodityFocus}
                        </p>
                      </td>
                      <td className="px-4 py-3.5">
                        <Badge variant="default" size="sm">
                          {getDepositTypeLabel(req.depositType)}
                        </Badge>
                      </td>
                      <td className="px-4 py-3.5">
                        <Badge variant={req.priority === "RUSH" ? "danger" : "slate"} size="sm">
                          {req.priority}
                        </Badge>
                      </td>
                      <td className="px-4 py-3.5">
                        {req.overallScore != null ? (
                          <span className="font-mono text-xs font-semibold text-geo-gold">
                            {req.overallScore}/100
                          </span>
                        ) : (
                          <span className="text-xs text-geo-slate">Unscored</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        <Badge variant={getVerdictBadgeVariant(req.verdict)} size="sm">
                          {req.verdict.replace(/_/g, " ")}
                        </Badge>
                      </td>
                      <td className="px-4 py-3.5">
                        <Badge variant={getGeoSentryStatusVariant(req.status)} size="sm" dot>
                          {req.status.replace(/_/g, " ")}
                        </Badge>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-geo-slate">
                        {req.assignedTo?.name || req.assignedTo?.email || "Unassigned"}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <Link href={`/geosentry-portal/requests/${req.id}`}>
                          <Button variant="outline" size="sm" rightIcon={<ArrowRight className="h-3 w-3" />}>
                            Workbench
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
