"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/portals/shared/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { Spinner } from "@/components/ui/Spinner";
import { formatCurrency } from "@/lib/utils";
import {
  portalFetch,
  extractArray,
  type PortalCourse,
} from "@/components/portals/shared/portal-api";
import { Plus, Edit3, Trash2, X } from "lucide-react";

const COURSE_STATUSES: Array<PortalCourse["status"]> = [
  "DRAFT",
  "PUBLISHED",
  "UPCOMING",
  "ONGOING",
  "COMPLETED",
  "CANCELLED",
];

export function CoursesManager() {
  const [courses, setCourses] = useState<PortalCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<PortalCourse | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [mode, setMode] = useState<PortalCourse["mode"]>("ONLINE");
  const [status, setStatus] = useState<PortalCourse["status"]>("PUBLISHED");
  const [fee, setFee] = useState("450");
  const [currency, setCurrency] = useState("USD");
  const [maxSeats, setMaxSeats] = useState("30");
  const [durationText, setDurationText] = useState("4 Weeks");
  const [schedule, setSchedule] = useState("");
  const [certificate, setCertificate] = useState(true);

  const loadCourses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await portalFetch("/api/portal/courses");
      setCourses(extractArray<PortalCourse>(res, ["courses"]));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load training courses");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadCourses();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadCourses]);

  function openCreate() {
    setEditingCourse(null);
    setTitle("");
    setTagline("");
    setDescription("");
    setMode("ONLINE");
    setStatus("PUBLISHED");
    setFee("450");
    setCurrency("USD");
    setMaxSeats("30");
    setDurationText("4 Weeks");
    setSchedule("");
    setCertificate(true);
    setIsModalOpen(true);
  }

  function openEdit(c: PortalCourse) {
    setEditingCourse(c);
    setTitle(c.title);
    setTagline(c.tagline ?? "");
    setDescription(c.description);
    setMode(c.mode);
    setStatus(c.status);
    setFee(c.fee != null ? String(c.fee) : "");
    setCurrency(c.currency || "USD");
    setMaxSeats(c.maxSeats != null ? String(c.maxSeats) : "");
    setDurationText(c.durationText ?? "");
    setSchedule(c.schedule ?? "");
    setCertificate(c.certificate);
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
        mode,
        status,
        fee: fee.trim() ? Number(fee) : null,
        currency,
        maxSeats: maxSeats.trim() ? Number.parseInt(maxSeats, 10) : null,
        durationText: durationText.trim() || null,
        schedule: schedule.trim() || null,
        certificate,
      };
      if (editingCourse) {
        await portalFetch(`/api/portal/courses/${editingCourse.id}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
        setSuccessMsg(`Updated course "${title}".`);
      } else {
        await portalFetch("/api/portal/courses", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setSuccessMsg(`Created course "${title}".`);
      }
      setIsModalOpen(false);
      await loadCourses();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save course");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleStatusChange(courseId: string, nextStatus: string) {
    setError(null);
    setSuccessMsg(null);
    try {
      await portalFetch(`/api/portal/courses/${courseId}`, {
        method: "PATCH",
        body: JSON.stringify({ status: nextStatus }),
      });
      setSuccessMsg(`Updated course status to ${nextStatus}.`);
      await loadCourses();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update course status");
    }
  }

  async function handleDelete(c: PortalCourse) {
    if (!window.confirm(`Delete course "${c.title}"?`)) return;
    setError(null);
    setSuccessMsg(null);
    try {
      await portalFetch(`/api/portal/courses/${c.id}`, { method: "DELETE" });
      setSuccessMsg(`Deleted course "${c.title}".`);
      await loadCourses();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete course");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Training Courses Management"
        subtitle="Manage professional geoscience courses, delivery modes, tuition fees, and seat capacity"
        action={
          <Button size="sm" onClick={openCreate} leftIcon={<Plus className="h-4 w-4" />}>
            Create Course
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
          ) : courses.length === 0 ? (
            <div className="py-12 text-center text-sm text-geo-slate">No training courses found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06] bg-[#0D1F35]">
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-geo-slate">Course Title</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-geo-slate">Mode & Duration</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-geo-slate">Tuition Fee</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-geo-slate">Enrollments / Seats</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-geo-slate">Status</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-geo-slate">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {courses.map((c) => {
                    const enrolledCount = c._count?.enrollments ?? c.enrollments?.length ?? 0;
                    return (
                      <tr key={c.id} className="hover:bg-white/[0.02]">
                        <td className="px-4 py-3.5">
                          <p className="font-medium text-geo-white">{c.title}</p>
                          <p className="text-xs text-geo-slate">
                            Instructor: {c.instructor?.name || c.instructor?.email || "Geo Vision Faculty"}
                          </p>
                        </td>
                        <td className="px-4 py-3.5">
                          <Badge variant="info" size="sm">
                            {c.mode}
                          </Badge>
                          {c.durationText && <span className="ml-2 text-xs text-geo-slate">{c.durationText}</span>}
                        </td>
                        <td className="px-4 py-3.5 font-mono text-xs text-geo-gold">
                          {c.fee != null ? formatCurrency(Number(c.fee), c.currency || "USD") : "Free"}
                        </td>
                        <td className="px-4 py-3.5 font-mono text-xs text-geo-white">
                          {enrolledCount} / {c.maxSeats ?? "Unlimited"}
                        </td>
                        <td className="px-4 py-3.5">
                          <select
                            aria-label={`Status for ${c.title}`}
                            value={c.status}
                            onChange={(e) => void handleStatusChange(c.id, e.target.value)}
                            className="rounded border border-white/10 bg-[#0D1F35] px-2 py-1 text-xs text-geo-white"
                          >
                            {COURSE_STATUSES.map((st) => (
                              <option key={st} value={st}>
                                {st}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <Button variant="ghost" size="sm" onClick={() => openEdit(c)}>
                              <Edit3 className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => void handleDelete(c)}>
                              <Trash2 className="h-3.5 w-3.5 text-red-400" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
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
              <CardTitle>{editingCourse ? "Edit Training Course" : "Create Training Course"}</CardTitle>
              <button type="button" aria-label="Close modal" onClick={() => setIsModalOpen(false)} className="text-geo-slate hover:text-geo-white">
                <X className="h-5 w-5" />
              </button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-4">
                <Input label="Course Title *" required value={title} onChange={(e) => setTitle(e.target.value)} />
                <Input label="Tagline" value={tagline} onChange={(e) => setTagline(e.target.value)} />

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-medium uppercase tracking-widest text-geo-slate-light">
                    Course Description *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full rounded-none border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-geo-white"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-medium uppercase tracking-widest text-geo-slate-light">
                      Delivery Mode
                    </label>
                    <select
                      value={mode}
                      onChange={(e) => setMode(e.target.value as PortalCourse["mode"])}
                      className="flex h-10 w-full rounded-none border border-white/10 bg-[#0D1F35] px-3 py-2 text-sm text-geo-white"
                    >
                      <option value="ONLINE">ONLINE</option>
                      <option value="ONSITE">ONSITE</option>
                      <option value="HYBRID">HYBRID</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-medium uppercase tracking-widest text-geo-slate-light">
                      Status
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as PortalCourse["status"])}
                      className="flex h-10 w-full rounded-none border border-white/10 bg-[#0D1F35] px-3 py-2 text-sm text-geo-white"
                    >
                      {COURSE_STATUSES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Input
                    label="Duration"
                    placeholder="4 Weeks / 24 Hours"
                    value={durationText}
                    onChange={(e) => setDurationText(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="Tuition Fee"
                    type="number"
                    step="0.01"
                    value={fee}
                    onChange={(e) => setFee(e.target.value)}
                  />
                  <Input
                    label="Currency"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                  />
                  <Input
                    label="Max Seats Capacity"
                    type="number"
                    value={maxSeats}
                    onChange={(e) => setMaxSeats(e.target.value)}
                  />
                </div>

                <Input
                  label="Schedule Details"
                  placeholder="Saturdays & Sundays, 14:00 to 17:00 UTC"
                  value={schedule}
                  onChange={(e) => setSchedule(e.target.value)}
                />

                <label className="flex items-center gap-2 text-xs text-geo-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={certificate}
                    onChange={(e) => setCertificate(e.target.checked)}
                    className="accent-[#C8A951]"
                  />
                  Includes Verified Completion Certificate
                </label>

                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" isLoading={isSaving}>
                    {editingCourse ? "Save Changes" : "Create Course"}
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
