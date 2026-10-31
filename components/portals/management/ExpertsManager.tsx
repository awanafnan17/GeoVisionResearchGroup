"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/portals/shared/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { Spinner } from "@/components/ui/Spinner";
import {
  portalFetch,
  extractArray,
  type PortalExpert,
} from "@/components/portals/shared/portal-api";
import { Plus, Edit3, Trash2, Star, Eye, CheckCircle, X } from "lucide-react";

const STATUS_OPTIONS: Array<PortalExpert["status"]> = [
  "DRAFT",
  "PENDING_REVIEW",
  "PUBLISHED",
  "ARCHIVED",
];

function getStatusBadge(status: PortalExpert["status"]) {
  if (status === "PUBLISHED") return <Badge variant="success" size="sm" dot>Published</Badge>;
  if (status === "PENDING_REVIEW") return <Badge variant="warning" size="sm" dot>Pending Review</Badge>;
  if (status === "ARCHIVED") return <Badge variant="slate" size="sm">Archived</Badge>;
  return <Badge variant="default" size="sm">Draft</Badge>;
}

export function ExpertsManager() {
  const [experts, setExperts] = useState<PortalExpert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState("ALL");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpert, setEditingExpert] = useState<PortalExpert | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [designation, setDesignation] = useState("");
  const [shortBio, setShortBio] = useState("");
  const [fullBio, setFullBio] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [cvFile, setCvFile] = useState("");
  const [cvIsPublic, setCvIsPublic] = useState(true);
  const [status, setStatus] = useState<PortalExpert["status"]>("PUBLISHED");
  const [isFeatured, setIsFeatured] = useState(false);

  const loadExperts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await portalFetch("/api/portal/experts");
      setExperts(extractArray<PortalExpert>(res, ["experts"]));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load expert profiles");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadExperts();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadExperts]);

  function openCreateModal() {
    setEditingExpert(null);
    setFullName("");
    setEmail("");
    setDesignation("");
    setShortBio("");
    setFullBio("");
    setCity("");
    setCountry("");
    setCvFile("");
    setCvIsPublic(true);
    setStatus("PUBLISHED");
    setIsFeatured(false);
    setIsModalOpen(true);
  }

  function openEditModal(exp: PortalExpert) {
    setEditingExpert(exp);
    setFullName(exp.fullName);
    setEmail(exp.user?.email ?? "");
    setDesignation(exp.designation);
    setShortBio(exp.shortBio);
    setFullBio(exp.fullBio ?? "");
    setCity(exp.city ?? "");
    setCountry(exp.country ?? "");
    setCvFile(exp.cvFile ?? "");
    setCvIsPublic(exp.cvIsPublic);
    setStatus(exp.status);
    setIsFeatured(exp.isFeatured);
    setIsModalOpen(true);
  }

  async function handleSaveModal(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccessMsg(null);
    try {
      if (editingExpert) {
        await portalFetch(`/api/portal/experts/${editingExpert.id}`, {
          method: "PATCH",
          body: JSON.stringify({
            fullName: fullName.trim(),
            designation: designation.trim(),
            shortBio: shortBio.trim(),
            fullBio: fullBio.trim() || null,
            city: city.trim() || null,
            country: country.trim() || null,
            cvFile: cvFile.trim() || null,
            cvIsPublic,
            status,
            isFeatured,
          }),
        });
        setSuccessMsg(`Updated profile for ${fullName}.`);
      } else {
        await portalFetch("/api/portal/experts", {
          method: "POST",
          body: JSON.stringify({
            fullName: fullName.trim(),
            email: email.trim(),
            designation: designation.trim(),
            shortBio: shortBio.trim(),
            fullBio: fullBio.trim() || null,
            city: city.trim() || null,
            country: country.trim() || null,
            cvFile: cvFile.trim() || null,
            cvIsPublic,
            status,
            isFeatured,
          }),
        });
        setSuccessMsg(`Created expert profile for ${fullName}.`);
      }
      setIsModalOpen(false);
      await loadExperts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save expert profile");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleQuickPatch(id: string, patch: Record<string, unknown>, message: string) {
    setError(null);
    setSuccessMsg(null);
    try {
      await portalFetch(`/api/portal/experts/${id}`, {
        method: "PATCH",
        body: JSON.stringify(patch),
      });
      setSuccessMsg(message);
      await loadExperts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update expert profile");
    }
  }

  async function handleDelete(exp: PortalExpert) {
    if (!window.confirm(`Delete expert profile for ${exp.fullName}?`)) return;
    setError(null);
    setSuccessMsg(null);
    try {
      await portalFetch(`/api/portal/experts/${exp.id}`, { method: "DELETE" });
      setSuccessMsg(`Deleted profile for ${exp.fullName}.`);
      await loadExperts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete expert profile");
    }
  }

  const filtered = experts.filter((e) => statusFilter === "ALL" || e.status === statusFilter);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Expert Profiles Management"
        subtitle="Approve geologist profiles, manage featured specialists, and control CV download visibility"
        action={
          <Button size="sm" onClick={openCreateModal} leftIcon={<Plus className="h-4 w-4" />}>
            Add Expert Profile
          </Button>
        }
      />

      {error && <Alert variant="error" title="Error" message={error} onClose={() => setError(null)} />}
      {successMsg && <Alert variant="success" title="Success" message={successMsg} onClose={() => setSuccessMsg(null)} />}

      <div className="flex flex-wrap gap-2">
        {["ALL", ...STATUS_OPTIONS].map((st) => (
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
            <div className="py-12 text-center text-sm text-geo-slate">No expert profiles found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06] bg-[#0D1F35]">
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-geo-slate">Geologist</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-geo-slate">Location</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-geo-slate">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-geo-slate">Featured</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-geo-slate">CV Public</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-geo-slate">Views / CV</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-geo-slate">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {filtered.map((exp) => (
                    <tr key={exp.id} className="hover:bg-white/[0.02]">
                      <td className="px-4 py-3.5">
                        <p className="font-medium text-geo-white">{exp.fullName}</p>
                        <p className="text-xs text-geo-slate">{exp.designation}</p>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-geo-slate">
                        {[exp.city, exp.country].filter(Boolean).join(", ") || "Global"}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          {getStatusBadge(exp.status)}
                          <select
                            aria-label={`Change status for ${exp.fullName}`}
                            value={exp.status}
                            onChange={(e) =>
                              void handleQuickPatch(
                                exp.id,
                                { status: e.target.value },
                                `Status for ${exp.fullName} changed to ${e.target.value}.`
                              )
                            }
                            className="rounded border border-white/10 bg-[#0D1F35] px-2 py-1 text-xs text-geo-white"
                          >
                            {STATUS_OPTIONS.map((st) => (
                              <option key={st} value={st}>
                                {st.replace(/_/g, " ")}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <button
                          type="button"
                          onClick={() =>
                            void handleQuickPatch(
                              exp.id,
                              { isFeatured: !exp.isFeatured },
                              `Featured status updated for ${exp.fullName}.`
                            )
                          }
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-none text-xs font-medium transition-colors ${
                            exp.isFeatured
                              ? "bg-geo-gold/15 text-geo-gold border border-geo-gold/30"
                              : "bg-white/5 text-geo-slate border border-white/10"
                          }`}
                        >
                          <Star className="h-3 w-3" />
                          {exp.isFeatured ? "Featured" : "Standard"}
                        </button>
                      </td>
                      <td className="px-4 py-3.5">
                        <button
                          type="button"
                          onClick={() =>
                            void handleQuickPatch(
                              exp.id,
                              { cvIsPublic: !exp.cvIsPublic },
                              `CV visibility updated for ${exp.fullName}.`
                            )
                          }
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-none text-xs font-medium ${
                            exp.cvIsPublic
                              ? "bg-green-500/10 text-green-400 border border-green-500/20"
                              : "bg-slate-500/10 text-slate-400 border border-slate-500/20"
                          }`}
                        >
                          <Eye className="h-3 w-3" />
                          {exp.cvIsPublic ? "Public" : "Private"}
                        </button>
                      </td>
                      <td className="px-4 py-3.5 font-mono text-xs text-geo-slate">
                        {exp.profileViews} / {exp.cvDownloads}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          {exp.status === "PENDING_REVIEW" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                void handleQuickPatch(
                                  exp.id,
                                  { status: "PUBLISHED" },
                                  `Approved and published ${exp.fullName}.`
                                )
                              }
                              leftIcon={<CheckCircle className="h-3.5 w-3.5" />}
                            >
                              Approve
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" onClick={() => openEditModal(exp)}>
                            <Edit3 className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => void handleDelete(exp)}>
                            <Trash2 className="h-3.5 w-3.5 text-red-400" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 overflow-y-auto">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{editingExpert ? `Edit ${editingExpert.fullName}` : "Create Expert Profile"}</CardTitle>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-geo-slate hover:text-geo-white"
              >
                <X className="h-5 w-5" />
              </button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveModal} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Full Name *"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                  {!editingExpert && (
                    <Input
                      label="Account Email *"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  )}
                  <Input
                    label="Designation / Title *"
                    required
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Input label="City" value={city} onChange={(e) => setCity(e.target.value)} />
                    <Input label="Country" value={country} onChange={(e) => setCountry(e.target.value)} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-medium uppercase tracking-widest text-geo-slate-light">
                    Short Bio *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={shortBio}
                    onChange={(e) => setShortBio(e.target.value)}
                    className="w-full rounded-none border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-geo-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-medium uppercase tracking-widest text-geo-slate-light">
                    Full Biography
                  </label>
                  <textarea
                    rows={4}
                    value={fullBio}
                    onChange={(e) => setFullBio(e.target.value)}
                    className="w-full rounded-none border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-geo-white"
                  />
                </div>

                <Input
                  label="CV File URL"
                  placeholder="/uploads/cvs/expert-cv.pdf"
                  value={cvFile}
                  onChange={(e) => setCvFile(e.target.value)}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-medium uppercase tracking-widest text-geo-slate-light">
                      Profile Status
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as PortalExpert["status"])}
                      className="flex h-10 w-full rounded-none border border-white/10 bg-[#0D1F35] px-3 py-2 text-sm text-geo-white"
                    >
                      {STATUS_OPTIONS.map((st) => (
                        <option key={st} value={st}>
                          {st.replace(/_/g, " ")}
                        </option>
                      ))}
                    </select>
                  </div>

                  <label className="flex items-center gap-2 text-xs text-geo-white cursor-pointer pt-4">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="accent-[#C8A951]"
                    />
                    Featured Specialist
                  </label>

                  <label className="flex items-center gap-2 text-xs text-geo-white cursor-pointer pt-4">
                    <input
                      type="checkbox"
                      checked={cvIsPublic}
                      onChange={(e) => setCvIsPublic(e.target.checked)}
                      className="accent-[#C8A951]"
                    />
                    CV Publicly Downloadable
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" isLoading={isSaving}>
                    {editingExpert ? "Save Changes" : "Create Profile"}
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
