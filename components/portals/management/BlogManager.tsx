"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/portals/shared/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { Spinner } from "@/components/ui/Spinner";
import { formatDateShort } from "@/lib/utils";
import {
  portalFetch,
  extractArray,
  type PortalBlogPost,
} from "@/components/portals/shared/portal-api";
import { Plus, Edit3, Trash2, X } from "lucide-react";

export function BlogManager() {
  const [posts, setPosts] = useState<PortalBlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<PortalBlogPost | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<PortalBlogPost["status"]>("PUBLISHED");
  const [isFeatured, setIsFeatured] = useState(false);

  const loadPosts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await portalFetch("/api/portal/blog");
      setPosts(extractArray<PortalBlogPost>(res, ["posts", "blogPosts"]));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load blog articles");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadPosts();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadPosts]);

  function openCreate() {
    setEditingPost(null);
    setTitle("");
    setExcerpt("");
    setContent("");
    setStatus("PUBLISHED");
    setIsFeatured(false);
    setIsModalOpen(true);
  }

  function openEdit(p: PortalBlogPost) {
    setEditingPost(p);
    setTitle(p.title);
    setExcerpt(p.excerpt ?? "");
    setContent(p.content);
    setStatus(p.status);
    setIsFeatured(p.isFeatured);
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
        excerpt: excerpt.trim() || null,
        content: content.trim(),
        status,
        isFeatured,
      };
      if (editingPost) {
        await portalFetch(`/api/portal/blog/${editingPost.id}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
        setSuccessMsg(`Updated article "${title}".`);
      } else {
        await portalFetch("/api/portal/blog", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setSuccessMsg(`Published article "${title}".`);
      }
      setIsModalOpen(false);
      await loadPosts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save article");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(p: PortalBlogPost) {
    if (!window.confirm(`Delete article "${p.title}"?`)) return;
    setError(null);
    setSuccessMsg(null);
    try {
      await portalFetch(`/api/portal/blog/${p.id}`, { method: "DELETE" });
      setSuccessMsg(`Deleted article "${p.title}".`);
      await loadPosts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete article");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Blog & Research Articles"
        subtitle="Publish geological insights, exploration commentary, and technical research notes"
        action={
          <Button size="sm" onClick={openCreate} leftIcon={<Plus className="h-4 w-4" />}>
            New Article
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
          ) : posts.length === 0 ? (
            <div className="py-12 text-center text-sm text-geo-slate">No blog articles found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06] bg-[#0D1F35]">
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-geo-slate">Title</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-geo-slate">Author</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-geo-slate">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-geo-slate">Date</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-geo-slate">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {posts.map((post) => (
                    <tr key={post.id} className="hover:bg-white/[0.02]">
                      <td className="px-4 py-3.5">
                        <p className="font-medium text-geo-white">{post.title}</p>
                        {post.excerpt && <p className="text-xs text-geo-slate line-clamp-1">{post.excerpt}</p>}
                      </td>
                      <td className="px-4 py-3.5 text-xs text-geo-slate">
                        {post.author?.name || post.author?.email || "Editorial Team"}
                      </td>
                      <td className="px-4 py-3.5">
                        <Badge
                          variant={post.status === "PUBLISHED" ? "success" : post.status === "ARCHIVED" ? "slate" : "warning"}
                          size="sm"
                          dot
                        >
                          {post.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-geo-slate">
                        {formatDateShort(post.publishedAt || post.createdAt)}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <Button variant="ghost" size="sm" onClick={() => openEdit(post)}>
                            <Edit3 className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => void handleDelete(post)}>
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
              <CardTitle>{editingPost ? "Edit Article" : "Write New Article"}</CardTitle>
              <button type="button" aria-label="Close modal" onClick={() => setIsModalOpen(false)} className="text-geo-slate hover:text-geo-white">
                <X className="h-5 w-5" />
              </button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-4">
                <Input label="Article Title *" required value={title} onChange={(e) => setTitle(e.target.value)} />
                <Input label="Short Excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-medium uppercase tracking-widest text-geo-slate-light">
                    Article Content *
                  </label>
                  <textarea
                    rows={8}
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write full article body (minimum 20 characters)..."
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
                      onChange={(e) => setStatus(e.target.value as PortalBlogPost["status"])}
                      className="rounded-none border border-white/10 bg-[#0D1F35] px-3 py-2 text-sm text-geo-white"
                    >
                      <option value="PUBLISHED">PUBLISHED</option>
                      <option value="DRAFT">DRAFT</option>
                      <option value="ARCHIVED">ARCHIVED</option>
                    </select>
                  </div>

                  <label className="flex items-center gap-2 text-xs text-geo-white cursor-pointer pt-4">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="accent-[#C8A951]"
                    />
                    Featured Article
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" isLoading={isSaving}>
                    {editingPost ? "Save Article" : "Publish Article"}
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
