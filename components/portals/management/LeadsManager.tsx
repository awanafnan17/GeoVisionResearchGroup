"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/portals/shared/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge, getLeadStatusVariant } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Spinner } from "@/components/ui/Spinner";
import { formatDateShort } from "@/lib/utils";
import {
  portalFetch,
  extractArray,
  type PortalLead,
  type PortalExpert,
} from "@/components/portals/shared/portal-api";
import { MessageSquare, Send, X } from "lucide-react";

const LEAD_STATUSES: Array<PortalLead["status"]> = [
  "NEW",
  "CONTACTED",
  "IN_DISCUSSION",
  "PROPOSAL_SENT",
  "WON",
  "LOST",
  "CLOSED",
];

export function LeadsManager({ isExpertView = false }: { isExpertView?: boolean }) {
  const [leads, setLeads] = useState<PortalLead[]>([]);
  const [experts, setExperts] = useState<PortalExpert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedLead, setSelectedLead] = useState<PortalLead | null>(null);
  const [noteText, setNoteText] = useState("");
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [leadsRes, expRes] = await Promise.all([
        portalFetch("/api/portal/leads"),
        isExpertView ? Promise.resolve(null) : portalFetch("/api/portal/experts").catch(() => null),
      ]);
      const leadItems = extractArray<PortalLead>(leadsRes, ["leads"]);
      setLeads(leadItems);
      if (expRes) {
        setExperts(extractArray<PortalExpert>(expRes, ["experts"]));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load inquiries and leads");
    } finally {
      setIsLoading(false);
    }
  }, [isExpertView]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadData();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadData]);

  async function handleUpdateLead(leadId: string, patch: Record<string, unknown>, msg: string) {
    setError(null);
    setSuccessMsg(null);
    try {
      await portalFetch(`/api/portal/leads/${leadId}`, {
        method: "PATCH",
        body: JSON.stringify(patch),
      });
      setSuccessMsg(msg);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update lead");
    }
  }

  async function handleAddNote(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedLead || !noteText.trim()) return;
    setIsSubmittingNote(true);
    setError(null);
    try {
      await portalFetch(`/api/portal/leads/${selectedLead.id}`, {
        method: "PATCH",
        body: JSON.stringify({ newNote: noteText.trim() }),
      });
      setNoteText("");
      setSuccessMsg("Lead note recorded.");
      await loadData();
      setSelectedLead(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add note");
    } finally {
      setIsSubmittingNote(false);
    }
  }

  const filtered = leads.filter((l) => statusFilter === "ALL" || l.status === statusFilter);

  return (
    <div className="space-y-6">
      <PageHeader
        title={isExpertView ? "Assigned Consultation Leads" : "Inquiries & Leads Pipeline"}
        subtitle={
          isExpertView
            ? "Review and respond to technical inquiries assigned to your profile"
            : "Manage incoming client inquiries, assign specialist geologists, and track conversion status"
        }
      />

      {error && <Alert variant="error" title="Error" message={error} onClose={() => setError(null)} />}
      {successMsg && <Alert variant="success" title="Updated" message={successMsg} onClose={() => setSuccessMsg(null)} />}

      <div className="flex flex-wrap gap-2">
        {["ALL", ...LEAD_STATUSES].map((st) => (
          <button
            key={st}
            type="button"
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded-none text-xs font-medium transition-colors ${
              statusFilter === st
                ? "bg-geo-gold text-geo-navy"
                : "bg-geo-navy-light text-geo-slate hover:text-geo-white border border-white/10"
            }`}
          >
            {st.replace(/_/g, " ")}
          </button>
        ))}
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Spinner size="lg" color="gold" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-sm text-geo-slate">No inquiries found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06] bg-[#0D1F35]">
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-geo-slate">Client</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-geo-slate">Type & Subject</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-geo-slate">Status</th>
                    {!isExpertView && (
                      <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-geo-slate">Assigned Expert</th>
                    )}
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-geo-slate">Date</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-geo-slate">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {filtered.map((lead) => (
                    <tr key={lead.id} className="hover:bg-white/[0.02]">
                      <td className="px-4 py-3.5">
                        <p className="font-medium text-geo-white">{lead.name}</p>
                        <p className="text-xs text-geo-slate">
                          {lead.email} {lead.organization ? `| ${lead.organization}` : ""}
                        </p>
                      </td>
                      <td className="px-4 py-3.5 max-w-xs">
                        <Badge variant="default" size="sm">
                          {lead.type.replace(/_/g, " ")}
                        </Badge>
                        <p className="text-xs text-geo-white mt-1 line-clamp-2">{lead.subject || lead.message}</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <Badge variant={getLeadStatusVariant(lead.status)} size="sm" dot>
                            {lead.status.replace(/_/g, " ")}
                          </Badge>
                          <select
                            aria-label={`Change status for ${lead.name}`}
                            value={lead.status}
                            onChange={(e) =>
                              void handleUpdateLead(
                                lead.id,
                                { status: e.target.value },
                                `Updated lead status to ${e.target.value}.`
                              )
                            }
                            className="rounded border border-white/10 bg-[#0D1F35] px-2 py-1 text-xs text-geo-white"
                          >
                            {LEAD_STATUSES.map((st) => (
                              <option key={st} value={st}>
                                {st.replace(/_/g, " ")}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                      {!isExpertView && (
                        <td className="px-4 py-3.5">
                          <select
                            aria-label={`Assign expert for ${lead.name}`}
                            value={lead.expertProfileId ?? ""}
                            onChange={(e) =>
                              void handleUpdateLead(
                                lead.id,
                                { expertProfileId: e.target.value || null },
                                "Updated lead specialist assignment."
                              )
                            }
                            className="rounded border border-white/10 bg-[#0D1F35] px-2 py-1 text-xs text-geo-white"
                          >
                            <option value="">Unassigned</option>
                            {experts.map((exp) => (
                              <option key={exp.id} value={exp.id}>
                                {exp.fullName}
                              </option>
                            ))}
                          </select>
                        </td>
                      )}
                      <td className="px-4 py-3.5 text-xs text-geo-slate">{formatDateShort(lead.createdAt)}</td>
                      <td className="px-4 py-3.5 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedLead(lead)}
                          leftIcon={<MessageSquare className="h-3.5 w-3.5" />}
                        >
                          Details ({lead.notes?.length ?? 0})
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 overflow-y-auto">
          <Card className="w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Inquiry from {selectedLead.name}</CardTitle>
              <button type="button" aria-label="Close modal" onClick={() => setSelectedLead(null)} className="text-geo-slate hover:text-geo-white">
                <X className="h-5 w-5" />
              </button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3.5 rounded-none bg-[#0D1F35] border border-white/[0.06] space-y-2 text-sm">
                <p className="text-xs text-geo-slate">
                  Email: <span className="text-geo-white">{selectedLead.email}</span>
                  {selectedLead.phone ? ` | Phone: ${selectedLead.phone}` : ""}
                </p>
                {selectedLead.subject && (
                  <p className="font-semibold text-geo-white">{selectedLead.subject}</p>
                )}
                <p className="text-geo-slate-light whitespace-pre-line">{selectedLead.message}</p>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-geo-slate">Activity Notes</h4>
                {(!selectedLead.notes || selectedLead.notes.length === 0) ? (
                  <p className="text-xs text-geo-slate">No notes recorded yet.</p>
                ) : (
                  selectedLead.notes.map((n) => (
                    <div key={n.id} className="p-2.5 rounded bg-white/[0.02] border border-white/[0.05] text-xs">
                      <div className="flex justify-between text-geo-slate mb-1">
                        <span className="font-medium text-geo-gold">{n.createdBy}</span>
                        <span>{formatDateShort(n.createdAt)}</span>
                      </div>
                      <p className="text-geo-white">{n.content}</p>
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={handleAddNote} className="space-y-3 pt-2 border-t border-white/[0.06]">
                <textarea
                  rows={2}
                  required
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Add an interaction note or follow-up summary..."
                  className="w-full rounded-none border border-white/10 bg-[#0D1F35] px-3 py-2 text-sm text-geo-white"
                />
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="secondary" size="sm" onClick={() => setSelectedLead(null)}>
                    Close
                  </Button>
                  <Button type="submit" size="sm" isLoading={isSubmittingNote} leftIcon={<Send className="h-3.5 w-3.5" />}>
                    Save Note
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
