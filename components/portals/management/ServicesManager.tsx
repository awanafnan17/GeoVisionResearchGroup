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
  type PortalService,
} from "@/components/portals/shared/portal-api";
import { Plus, Edit3, Trash2, X } from "lucide-react";

export function ServicesManager() {
  const [services, setServices] = useState<PortalService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<PortalService | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [methodology, setMethodology] = useState("");
  const [icon, setIcon] = useState("Compass");
  const [sortOrder, setSortOrder] = useState("0");
  const [isPublished, setIsPublished] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);

  const loadServices = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await portalFetch("/api/portal/services");
      setServices(extractArray<PortalService>(res, ["services"]));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load consultancy services");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadServices();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadServices]);

  function openCreate() {
    setEditingService(null);
    setTitle("");
    setTagline("");
    setDescription("");
    setMethodology("");
    setIcon("Compass");
    setSortOrder(String(services.length + 1));
    setIsPublished(true);
    setIsFeatured(false);
    setIsModalOpen(true);
  }

  function openEdit(svc: PortalService) {
    setEditingService(svc);
    setTitle(svc.title);
    setTagline(svc.tagline ?? "");
    setDescription(svc.description);
    setMethodology(svc.methodology ?? "");
    setIcon(svc.icon ?? "Compass");
    setSortOrder(String(svc.sortOrder ?? 0));
    setIsPublished(svc.isPublished);
    setIsFeatured(svc.isFeatured);
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
        tagline: tagline.trim() || null,
        description: description.trim(),
        methodology: methodology.trim() || null,
        icon: icon.trim() || "Compass",
        sortOrder: Number.parseInt(sortOrder, 10) || 0,
        isPublished,
        isFeatured,
      };
      if (editingService) {
        await portalFetch(`/api/portal/services/${editingService.id}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
        setSuccessMsg(`Updated service "${title}".`);
      } else {
        await portalFetch("/api/portal/services", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setSuccessMsg(`Created service "${title}".`);
      }
      setIsModalOpen(false);
      await loadServices();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save consultancy service");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleTogglePublish(svc: PortalService) {
    setError(null);
    setSuccessMsg(null);
    try {
      await portalFetch(`/api/portal/services/${svc.id}`, {
        method: "PATCH",
        body: JSON.stringify({ isPublished: !svc.isPublished }),
      });
      setSuccessMsg(`Updated publication status for "${svc.title}".`);
      await loadServices();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update service");
    }
  }

  async function handleDelete(svc: PortalService) {
    if (!window.confirm(`Delete service "${svc.title}"?`)) return;
    setError(null);
    setSuccessMsg(null);
    try {
      await portalFetch(`/api/portal/services/${svc.id}`, { method: "DELETE" });
      setSuccessMsg(`Deleted service "${svc.title}".`);
      await loadServices();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete service");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Consultancy Services"
        subtitle="Manage geological advisory, exploration, and technical due diligence offerings"
        action={
          <Button size="sm" onClick={openCreate} leftIcon={<Plus className="h-4 w-4" />}>
            Add Service
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
          ) : services.length === 0 ? (
            <div className="py-12 text-center text-sm text-geo-slate">No consultancy services found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06] bg-[#0D1F35]">
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-geo-slate">Order</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-geo-slate">Service Title</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-geo-slate">Slug</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-geo-slate">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-geo-slate">Featured</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-geo-slate">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {services.map((svc) => (
                    <tr key={svc.id} className="hover:bg-white/[0.02]">
                      <td className="px-4 py-3.5 font-mono text-xs text-geo-slate">{svc.sortOrder}</td>
                      <td className="px-4 py-3.5">
                        <p className="font-medium text-geo-white">{svc.title}</p>
                        {svc.tagline && <p className="text-xs text-geo-slate line-clamp-1">{svc.tagline}</p>}
                      </td>
                      <td className="px-4 py-3.5 font-mono text-xs text-geo-slate">{svc.slug}</td>
                      <td className="px-4 py-3.5">
                        <button type="button" onClick={() => void handleTogglePublish(svc)}>
                          <Badge variant={svc.isPublished ? "success" : "slate"} size="sm" dot>
                            {svc.isPublished ? "Published" : "Draft"}
                          </Badge>
                        </button>
                      </td>
                      <td className="px-4 py-3.5">
                        <Badge variant={svc.isFeatured ? "gold" : "default"} size="sm">
                          {svc.isFeatured ? "Featured" : "Standard"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <Button variant="ghost" size="sm" onClick={() => openEdit(svc)}>
                            <Edit3 className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => void handleDelete(svc)}>
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
              <CardTitle>{editingService ? "Edit Consultancy Service" : "Add Consultancy Service"}</CardTitle>
              <button type="button" aria-label="Close modal" onClick={() => setIsModalOpen(false)} className="text-geo-slate hover:text-geo-white">
                <X className="h-5 w-5" />
              </button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <Input label="Service Title *" required value={title} onChange={(e) => setTitle(e.target.value)} />
                  </div>
                  <Input label="Sort Order" type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} />
                </div>

                <Input label="Tagline" value={tagline} onChange={(e) => setTagline(e.target.value)} />

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-medium uppercase tracking-widest text-geo-slate-light">
                    Service Description *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full rounded-none border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-geo-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-medium uppercase tracking-widest text-geo-slate-light">
                    Technical Methodology
                  </label>
                  <textarea
                    rows={3}
                    value={methodology}
                    onChange={(e) => setMethodology(e.target.value)}
                    className="w-full rounded-none border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-geo-white"
                  />
                </div>

                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 text-xs text-geo-white cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPublished}
                      onChange={(e) => setIsPublished(e.target.checked)}
                      className="accent-[#C8A951]"
                    />
                    Published on Website
                  </label>
                  <label className="flex items-center gap-2 text-xs text-geo-white cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="accent-[#C8A951]"
                    />
                    Featured Service
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" isLoading={isSaving}>
                    {editingService ? "Save Service" : "Create Service"}
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
