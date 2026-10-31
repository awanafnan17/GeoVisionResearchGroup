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
  type PortalProject,
} from "@/components/portals/shared/portal-api";
import { Plus, Edit3, Trash2, X } from "lucide-react";

export function PortfolioManager() {
  const [projects, setProjects] = useState<PortalProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<PortalProject | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [client, setClient] = useState("");
  const [sector, setSector] = useState("");
  const [country, setCountry] = useState("");
  const [year, setYear] = useState("2025");
  const [description, setDescription] = useState("");
  const [results, setResults] = useState("");
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">("PUBLISHED");
  const [isFeatured, setIsFeatured] = useState(false);

  const loadProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await portalFetch("/api/portal/portfolio");
      setProjects(extractArray<PortalProject>(res, ["projects"]));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load portfolio projects");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadProjects();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadProjects]);

  function openCreate() {
    setEditingProject(null);
    setTitle("");
    setClient("");
    setSector("Mineral Exploration");
    setCountry("");
    setYear(String(new Date().getFullYear()));
    setDescription("");
    setResults("");
    setStatus("PUBLISHED");
    setIsFeatured(false);
    setIsModalOpen(true);
  }

  function openEdit(proj: PortalProject) {
    setEditingProject(proj);
    setTitle(proj.title);
    setClient(proj.client ?? "");
    setSector(proj.sector ?? "");
    setCountry(proj.country ?? "");
    setYear(proj.year != null ? String(proj.year) : "");
    setDescription(proj.description);
    setResults(proj.results ?? "");
    setStatus(proj.status);
    setIsFeatured(proj.isFeatured);
    setIsModalOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const payload = {
        title: title.trim(),
        client: client.trim() || null,
        sector: sector.trim() || null,
        country: country.trim() || null,
        year: year.trim() ? Number.parseInt(year, 10) : null,
        description: description.trim(),
        results: results.trim() || null,
        status,
        isFeatured,
      };
      if (editingProject) {
        await portalFetch(`/api/portal/portfolio/${editingProject.id}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
        setSuccessMsg(`Updated project "${title}".`);
      } else {
        await portalFetch("/api/portal/portfolio", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setSuccessMsg(`Created project "${title}".`);
      }
      setIsModalOpen(false);
      await loadProjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save portfolio project");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(proj: PortalProject) {
    if (!window.confirm(`Delete project "${proj.title}"?`)) return;
    setError(null);
    setSuccessMsg(null);
    try {
      await portalFetch(`/api/portal/portfolio/${proj.id}`, { method: "DELETE" });
      setSuccessMsg(`Deleted project "${proj.title}".`);
      await loadProjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete project");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Portfolio & Case Studies"
        subtitle="Manage published field campaigns, resource evaluations, and geological case studies"
        action={
          <Button size="sm" onClick={openCreate} leftIcon={<Plus className="h-4 w-4" />}>
            Add Project
          </Button>
        }
      />

      {error && <Alert variant="error" title="Error" message={error} onClose={() => setError(null)} />}
      {successMsg && <Alert variant="success" title="Success" message={successMsg} onClose={() => setSuccessMsg(null)} />}

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Spinner size="lg" color="gold" />
            </div>
          ) : projects.length === 0 ? (
            <div className="py-12 text-center text-sm text-geo-slate">No portfolio projects found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06] bg-[#0D1F35]">
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-geo-slate">Project Title</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-geo-slate">Client & Sector</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-geo-slate">Country & Year</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-geo-slate">Status</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-geo-slate">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {projects.map((proj) => (
                    <tr key={proj.id} className="hover:bg-white/[0.02]">
                      <td className="px-4 py-3.5">
                        <p className="font-medium text-geo-white">{proj.title}</p>
                        <p className="text-xs text-geo-slate line-clamp-1">{proj.description}</p>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-geo-slate">
                        <p className="text-geo-white">{proj.client || "Confidential Client"}</p>
                        <p>{proj.sector || "Exploration"}</p>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-geo-slate">
                        {proj.country || "Global"} {proj.year ? `(${proj.year})` : ""}
                      </td>
                      <td className="px-4 py-3.5">
                        <Badge variant={proj.status === "PUBLISHED" ? "success" : "slate"} size="sm" dot>
                          {proj.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <Button variant="ghost" size="sm" onClick={() => openEdit(proj)}>
                            <Edit3 className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => void handleDelete(proj)}>
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
              <CardTitle>{editingProject ? "Edit Portfolio Project" : "Create Portfolio Project"}</CardTitle>
              <button type="button" aria-label="Close modal" onClick={() => setIsModalOpen(false)} className="text-geo-slate hover:text-geo-white">
                <X className="h-5 w-5" />
              </button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-4">
                <Input label="Project Title *" required value={title} onChange={(e) => setTitle(e.target.value)} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Client" value={client} onChange={(e) => setClient(e.target.value)} />
                  <Input label="Sector" value={sector} onChange={(e) => setSector(e.target.value)} />
                  <Input label="Country" value={country} onChange={(e) => setCountry(e.target.value)} />
                  <Input label="Year" type="number" value={year} onChange={(e) => setYear(e.target.value)} />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-medium uppercase tracking-widest text-geo-slate-light">
                    Project Summary *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full rounded-none border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-geo-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-medium uppercase tracking-widest text-geo-slate-light">
                    Key Results & Deliverables
                  </label>
                  <textarea
                    rows={3}
                    value={results}
                    onChange={(e) => setResults(e.target.value)}
                    className="w-full rounded-none border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-geo-white"
                  />
                </div>

                <div className="flex items-center gap-6">
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-medium uppercase tracking-widest text-geo-slate-light">
                      Status
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as "DRAFT" | "PUBLISHED")}
                      className="rounded-none border border-white/10 bg-[#0D1F35] px-3 py-2 text-sm text-geo-white"
                    >
                      <option value="PUBLISHED">PUBLISHED</option>
                      <option value="DRAFT">DRAFT</option>
                    </select>
                  </div>

                  <label className="flex items-center gap-2 text-xs text-geo-white cursor-pointer pt-4">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="accent-[#C8A951]"
                    />
                    Featured Case Study
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" isLoading={isSaving}>
                    {editingProject ? "Save Project" : "Create Project"}
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
