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
  type PortalUser,
} from "@/components/portals/shared/portal-api";
import { UserPlus, Unlock, Power, X } from "lucide-react";

const ROLE_OPTIONS: Array<PortalUser["role"]> = [
  "SUPERADMIN",
  "ADMIN",
  "GEOSENTRY_MANAGER",
  "EXPERT",
  "STUDENT",
];

export default function SuperAdminUsersPage() {
  const [users, setUsers] = useState<PortalUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<PortalUser["role"]>("EXPERT");

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await portalFetch("/api/portal/users");
      setUsers(extractArray<PortalUser>(res, ["users"]));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load platform users");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadUsers();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadUsers]);

  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault();
    setIsCreating(true);
    setError(null);
    setSuccessMsg(null);
    try {
      await portalFetch("/api/portal/users", {
        method: "POST",
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
          role,
          isActive: true,
        }),
      });
      setIsModalOpen(false);
      setName("");
      setEmail("");
      setPassword("");
      setSuccessMsg(`Created account for ${email}.`);
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create user account");
    } finally {
      setIsCreating(false);
    }
  }

  async function handlePatchUser(userId: string, patch: Record<string, unknown>, message: string) {
    setError(null);
    setSuccessMsg(null);
    try {
      await portalFetch(`/api/portal/users/${userId}`, {
        method: "PATCH",
        body: JSON.stringify(patch),
      });
      setSuccessMsg(message);
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update user");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users & Role Access Control"
        subtitle="Manage platform accounts, role permissions, active status, and security lockouts"
        action={
          <Button size="sm" onClick={() => setIsModalOpen(true)} leftIcon={<UserPlus className="h-4 w-4" />}>
            Create User
          </Button>
        }
      />

      {error && <Alert variant="error" title="Error" message={error} onClose={() => setError(null)} />}
      {successMsg && <Alert variant="success" title="Updated" message={successMsg} onClose={() => setSuccessMsg(null)} />}

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Spinner size="lg" color="gold" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06] bg-[#0D1F35]">
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-geo-slate">User</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-geo-slate">Role</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-geo-slate">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-geo-slate">Security / Lockout</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-geo-slate">Joined</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-geo-slate">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {users.map((u) => {
                    const isLocked = Boolean(u.lockedUntil && new Date(u.lockedUntil) > new Date()) || u.loginAttempts >= 5;
                    return (
                      <tr key={u.id} className="hover:bg-white/[0.02]">
                        <td className="px-4 py-3.5">
                          <p className="font-medium text-geo-white">{u.name || "Unnamed User"}</p>
                          <p className="text-xs text-geo-slate">{u.email}</p>
                        </td>
                        <td className="px-4 py-3.5">
                          <select
                            aria-label={`Role for ${u.email}`}
                            value={u.role}
                            onChange={(e) =>
                              void handlePatchUser(
                                u.id,
                                { role: e.target.value },
                                `Changed role for ${u.email} to ${e.target.value}.`
                              )
                            }
                            className="rounded border border-white/10 bg-[#0D1F35] px-2.5 py-1 text-xs text-geo-white"
                          >
                            {ROLE_OPTIONS.map((r) => (
                              <option key={r} value={r}>
                                {r.replace(/_/g, " ")}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3.5">
                          <Badge variant={u.isActive ? "success" : "danger"} size="sm" dot>
                            {u.isActive ? "Active" : "Deactivated"}
                          </Badge>
                        </td>
                        <td className="px-4 py-3.5 text-xs">
                          {isLocked ? (
                            <Badge variant="danger" size="sm">
                              Locked ({u.loginAttempts} attempts)
                            </Badge>
                          ) : (
                            <span className="text-geo-slate">Clear ({u.loginAttempts} failed)</span>
                          )}
                        </td>
                        <td className="px-4 py-3.5 text-xs text-geo-slate">
                          {formatDateShort(u.createdAt)}
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <div className="inline-flex items-center gap-2">
                            {(isLocked || u.loginAttempts > 0) && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  void handlePatchUser(
                                    u.id,
                                    { unlock: true, loginAttempts: 0, lockedUntil: null },
                                    `Unlocked account for ${u.email}.`
                                  )
                                }
                                leftIcon={<Unlock className="h-3.5 w-3.5" />}
                              >
                                Unlock Account
                              </Button>
                            )}
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() =>
                                void handlePatchUser(
                                  u.id,
                                  { isActive: !u.isActive },
                                  `${u.isActive ? "Deactivated" : "Activated"} account for ${u.email}.`
                                )
                              }
                              leftIcon={<Power className="h-3.5 w-3.5" />}
                            >
                              {u.isActive ? "Deactivate" : "Activate"}
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
          <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Create Platform User</CardTitle>
              <button type="button" aria-label="Close modal" onClick={() => setIsModalOpen(false)} className="text-geo-slate hover:text-geo-white">
                <X className="h-5 w-5" />
              </button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateUser} className="space-y-4">
                <Input label="Full Name *" required value={name} onChange={(e) => setName(e.target.value)} />
                <Input label="Email Address *" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                <Input
                  label="Initial Password (Min 8 Characters) *"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-medium uppercase tracking-widest text-geo-slate-light">
                    Role *
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as PortalUser["role"])}
                    className="flex h-10 w-full rounded-none border border-white/10 bg-[#0D1F35] px-3 py-2 text-sm text-geo-white"
                  >
                    {ROLE_OPTIONS.map((r) => (
                      <option key={r} value={r}>
                        {r.replace(/_/g, " ")}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-3">
                  <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" isLoading={isCreating}>
                    Create User
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
