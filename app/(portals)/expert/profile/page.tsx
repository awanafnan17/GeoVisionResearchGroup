"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/portals/shared/PageHeader";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { Spinner } from "@/components/ui/Spinner";
import {
  portalFetch,
  extractArray,
  type PortalExpert,
  type EducationEntry,
  type ExperienceEntry,
  type CertificationEntry,
} from "@/components/portals/shared/portal-api";
import { Save, Send, Plus, Trash2 } from "lucide-react";

export default function ExpertProfilePage() {
  const [profile, setProfile] = useState<PortalExpert | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [fullName, setFullName] = useState("");
  const [designation, setDesignation] = useState("");
  const [shortBio, setShortBio] = useState("");
  const [fullBio, setFullBio] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [googleScholar, setGoogleScholar] = useState("");
  const [researchgate, setResearchgate] = useState("");
  const [orcid, setOrcid] = useState("");

  const [education, setEducation] = useState<EducationEntry[]>([]);
  const [experience, setExperience] = useState<ExperienceEntry[]>([]);
  const [certifications, setCertifications] = useState<CertificationEntry[]>([]);

  const loadMyProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await portalFetch("/api/portal/experts");
      const list = extractArray<PortalExpert>(res, ["experts"]);
      const me = list[0] ?? null;
      if (me) {
        setProfile(me);
        setFullName(me.fullName);
        setDesignation(me.designation);
        setShortBio(me.shortBio);
        setFullBio(me.fullBio ?? "");
        setCity(me.city ?? "");
        setCountry(me.country ?? "");
        setLinkedin(me.linkedin ?? "");
        setGoogleScholar(me.googleScholar ?? "");
        setResearchgate(me.researchgate ?? "");
        setOrcid(me.orcid ?? "");
        setEducation(Array.isArray(me.education) ? me.education : []);
        setExperience(Array.isArray(me.experience) ? me.experience : []);
        setCertifications(Array.isArray(me.certifications) ? me.certifications : []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load expert profile");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadMyProfile();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadMyProfile]);

  async function saveProfileData(submitForReview: boolean) {
    if (!profile) return;
    setIsSaving(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const payload: Record<string, unknown> = {
        fullName: fullName.trim(),
        designation: designation.trim(),
        shortBio: shortBio.trim(),
        fullBio: fullBio.trim() || null,
        city: city.trim() || null,
        country: country.trim() || null,
        linkedin: linkedin.trim() || null,
        googleScholar: googleScholar.trim() || null,
        researchgate: researchgate.trim() || null,
        orcid: orcid.trim() || null,
        education,
        experience,
        certifications,
      };
      if (submitForReview && profile.status !== "PUBLISHED") {
        payload.status = "PENDING_REVIEW";
      }

      await portalFetch(`/api/portal/experts/${profile.id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
      setSuccessMsg(
        submitForReview
          ? "Profile saved and submitted to administrators for review."
          : "Expert profile changes saved."
      );
      await loadMyProfile();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update expert profile");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" color="gold" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="space-y-4">
        <PageHeader title="My Expert Profile" subtitle="Geologist profile configuration" />
        <Alert
          variant="warning"
          title="No Expert Profile Found"
          message="Your user account does not yet have an initialized ExpertProfile record."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Geologist Profile"
        subtitle="Maintain your public credentials, academic background, and professional experience"
        action={
          <div className="flex items-center gap-2">
            <Badge variant={profile.status === "PUBLISHED" ? "success" : "warning"} size="md" dot>
              {profile.status.replace(/_/g, " ")}
            </Badge>
            {profile.status !== "PUBLISHED" && (
              <Button
                variant="outline"
                size="sm"
                isLoading={isSaving}
                onClick={() => void saveProfileData(true)}
                leftIcon={<Send className="h-3.5 w-3.5" />}
              >
                Submit for Review
              </Button>
            )}
            <Button
              size="sm"
              isLoading={isSaving}
              onClick={() => void saveProfileData(false)}
              leftIcon={<Save className="h-4 w-4" />}
            >
              Save Profile
            </Button>
          </div>
        }
      />

      {error && <Alert variant="error" title="Error" message={error} onClose={() => setError(null)} />}
      {successMsg && <Alert variant="success" title="Saved" message={successMsg} onClose={() => setSuccessMsg(null)} />}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Core Identity & Location</CardTitle>
            <CardDescription>Displayed on the public Experts directory</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input label="Full Name *" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            <Input label="Designation / Title *" value={designation} onChange={(e) => setDesignation(e.target.value)} />
            <div className="grid grid-cols-2 gap-3">
              <Input label="City" value={city} onChange={(e) => setCity(e.target.value)} />
              <Input label="Country" value={country} onChange={(e) => setCountry(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <label className="block text-[11px] font-medium uppercase tracking-widest text-geo-slate-light">
                Short Summary Bio *
              </label>
              <textarea
                rows={3}
                value={shortBio}
                onChange={(e) => setShortBio(e.target.value)}
                className="w-full rounded-none border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-geo-white"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-[11px] font-medium uppercase tracking-widest text-geo-slate-light">
                Detailed Technical Biography
              </label>
              <textarea
                rows={5}
                value={fullBio}
                onChange={(e) => setFullBio(e.target.value)}
                className="w-full rounded-none border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-geo-white"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Research & Professional Identifiers</CardTitle>
            <CardDescription>External academic and professional network links</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input label="LinkedIn Profile URL" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} />
            <Input label="Google Scholar URL" value={googleScholar} onChange={(e) => setGoogleScholar(e.target.value)} />
            <Input label="ResearchGate URL" value={researchgate} onChange={(e) => setResearchgate(e.target.value)} />
            <Input label="ORCID Identifier" placeholder="0000-0002-1825-0097" value={orcid} onChange={(e) => setOrcid(e.target.value)} />
          </CardContent>
        </Card>
      </div>

      {/* Education */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Academic Education</CardTitle>
            <CardDescription>University degrees and geological training</CardDescription>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setEducation([...education, { degree: "", institution: "", year: "" }])}
            leftIcon={<Plus className="h-3.5 w-3.5" />}
          >
            Add Degree
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {education.length === 0 ? (
            <p className="text-xs text-geo-slate">No education entries added yet.</p>
          ) : (
            education.map((ed, idx) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-7 gap-3 items-end p-3 rounded-none bg-white/[0.02] border border-white/[0.05]">
                <div className="md:col-span-3">
                  <Input
                    label="Degree"
                    placeholder="Ph.D. in Economic Geology"
                    value={ed.degree}
                    onChange={(e) => {
                      const next = [...education];
                      next[idx] = { ...ed, degree: e.target.value };
                      setEducation(next);
                    }}
                  />
                </div>
                <div className="md:col-span-2">
                  <Input
                    label="Institution"
                    placeholder="ETH Zurich"
                    value={ed.institution}
                    onChange={(e) => {
                      const next = [...education];
                      next[idx] = { ...ed, institution: e.target.value };
                      setEducation(next);
                    }}
                  />
                </div>
                <Input
                  label="Year"
                  placeholder="2018"
                  value={ed.year}
                  onChange={(e) => {
                    const next = [...education];
                    next[idx] = { ...ed, year: e.target.value };
                    setEducation(next);
                  }}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setEducation(education.filter((_, i) => i !== idx))}
                >
                  <Trash2 className="h-4 w-4 text-red-400" />
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Experience & Certifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Professional Experience</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setExperience([...experience, { title: "", organization: "", startYear: "" }])}
              leftIcon={<Plus className="h-3.5 w-3.5" />}
            >
              Add Role
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {experience.map((exp, idx) => (
              <div key={idx} className="p-3 rounded-none bg-white/[0.02] border border-white/[0.05] space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    label="Role Title"
                    value={exp.title}
                    onChange={(e) => {
                      const next = [...experience];
                      next[idx] = { ...exp, title: e.target.value };
                      setExperience(next);
                    }}
                  />
                  <Input
                    label="Organization"
                    value={exp.organization}
                    onChange={(e) => {
                      const next = [...experience];
                      next[idx] = { ...exp, organization: e.target.value };
                      setExperience(next);
                    }}
                  />
                </div>
                <div className="flex items-end justify-between gap-2">
                  <Input
                    label="Years"
                    placeholder="2019 to Present"
                    value={exp.startYear}
                    onChange={(e) => {
                      const next = [...experience];
                      next[idx] = { ...exp, startYear: e.target.value };
                      setExperience(next);
                    }}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setExperience(experience.filter((_, i) => i !== idx))}
                  >
                    <Trash2 className="h-4 w-4 text-red-400" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Professional Certifications</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setCertifications([...certifications, { name: "", issuer: "", year: "" }])}
              leftIcon={<Plus className="h-3.5 w-3.5" />}
            >
              Add Certification
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {certifications.map((cert, idx) => (
              <div key={idx} className="p-3 rounded-none bg-white/[0.02] border border-white/[0.05] space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    label="Designation"
                    placeholder="QP NI 43-101 / AusIMM"
                    value={cert.name}
                    onChange={(e) => {
                      const next = [...certifications];
                      next[idx] = { ...cert, name: e.target.value };
                      setCertifications(next);
                    }}
                  />
                  <Input
                    label="Issuing Body"
                    value={cert.issuer}
                    onChange={(e) => {
                      const next = [...certifications];
                      next[idx] = { ...cert, issuer: e.target.value };
                      setCertifications(next);
                    }}
                  />
                </div>
                <div className="flex items-end justify-between gap-2">
                  <Input
                    label="Year"
                    value={cert.year}
                    onChange={(e) => {
                      const next = [...certifications];
                      next[idx] = { ...cert, year: e.target.value };
                      setCertifications(next);
                    }}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setCertifications(certifications.filter((_, i) => i !== idx))}
                  >
                    <Trash2 className="h-4 w-4 text-red-400" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
