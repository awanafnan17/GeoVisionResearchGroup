"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/portals/shared/PageHeader";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import {
  portalFetch,
  extractObject,
  DEPOSIT_TYPE_OPTIONS,
  type PortalGeoSentryRequest,
} from "@/components/portals/shared/portal-api";
import { ArrowLeft, PlusCircle } from "lucide-react";

export default function GeoSentryNewRequestPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientOrganization, setClientOrganization] = useState("");
  const [clientCountry, setClientCountry] = useState("");

  const [targetName, setTargetName] = useState("");
  const [targetCountry, setTargetCountry] = useState("");
  const [targetRegion, setTargetRegion] = useState("");
  const [targetCoordinates, setTargetCoordinates] = useState("");
  const [depositType, setDepositType] = useState("PORPHYRY");
  const [commodityFocus, setCommodityFocus] = useState("");
  const [targetSizeHectares, setTargetSizeHectares] = useState("");
  const [existingData, setExistingData] = useState("");

  const [projectDescription, setProjectDescription] = useState("");
  const [specificConcerns, setSpecificConcerns] = useState("");
  const [keyQuestions, setKeyQuestions] = useState("");
  const [priority, setPriority] = useState<"STANDARD" | "RUSH">("STANDARD");
  const [quotedPrice, setQuotedPrice] = useState("3500");
  const [quotedCurrency, setQuotedCurrency] = useState("USD");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const commodities = commodityFocus
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        clientName: clientName.trim(),
        clientEmail: clientEmail.trim(),
        clientPhone: clientPhone.trim() || undefined,
        clientOrganization: clientOrganization.trim() || undefined,
        clientCountry: clientCountry.trim() || undefined,
        targetName: targetName.trim(),
        targetCountry: targetCountry.trim(),
        targetRegion: targetRegion.trim() || undefined,
        targetCoordinates: targetCoordinates.trim() || undefined,
        depositType,
        commodityFocus: commodityFocus.trim(),
        commodities,
        targetSizeHectares: targetSizeHectares.trim() ? Number(targetSizeHectares) : undefined,
        existingData: existingData.trim() || undefined,
        projectDescription: projectDescription.trim(),
        specificConcerns: specificConcerns.trim() || undefined,
        keyQuestions: keyQuestions.trim() || undefined,
        priority,
        quotedPrice: quotedPrice.trim() ? Number(quotedPrice) : undefined,
        quotedCurrency,
        source: "MANAGER_PORTAL",
      };

      const res = await portalFetch("/api/geosentry/requests", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const created = extractObject<PortalGeoSentryRequest>(res, ["request"]);
      if (created?.id) {
        router.push(`/geosentry-portal/requests/${created.id}`);
      } else {
        router.push("/geosentry-portal/requests");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to log GeoSentry screening request");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/geosentry-portal/requests">
          <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="h-4 w-4" />}>
            Back to Requests
          </Button>
        </Link>
      </div>

      <PageHeader
        title="Log New GeoSentry Request"
        subtitle="Manually register a desktop geological screening request on behalf of a client or investor"
      />

      {error && <Alert variant="error" title="Submission Error" message={error} onClose={() => setError(null)} />}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>1. Client & Organization Details</CardTitle>
            <CardDescription>Primary contact information for the screening engagement</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Client Name *"
              required
              placeholder="Dr. Henrik Lindqvist"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
            />
            <Input
              label="Client Email *"
              type="email"
              required
              placeholder="hlindqvist@nordicminerals.se"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
            />
            <Input
              label="Organization / Company"
              placeholder="Nordic Minerals AB"
              value={clientOrganization}
              onChange={(e) => setClientOrganization(e.target.value)}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Phone"
                placeholder="+46 8 555 0192"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
              />
              <Input
                label="Client Country"
                placeholder="Sweden"
                value={clientCountry}
                onChange={(e) => setClientCountry(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Exploration Target & Deposit Parameters</CardTitle>
            <CardDescription>Location, deposit model, and target commodity specification</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Target / Tenement Name *"
              required
              placeholder="Chagai North Copper-Gold Prospect"
              value={targetName}
              onChange={(e) => setTargetName(e.target.value)}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Target Country *"
                required
                placeholder="Pakistan"
                value={targetCountry}
                onChange={(e) => setTargetCountry(e.target.value)}
              />
              <Input
                label="Province / Region"
                placeholder="Balochistan"
                value={targetRegion}
                onChange={(e) => setTargetRegion(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-medium uppercase tracking-widest text-geo-slate-light">
                Deposit Type *
              </label>
              <select
                value={depositType}
                onChange={(e) => setDepositType(e.target.value)}
                className="flex h-10 w-full rounded-none border border-white/10 bg-[#0D1F35] px-3 py-2 text-sm text-geo-white focus:outline-none focus:border-geo-gold"
              >
                {DEPOSIT_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Commodity Focus (Comma Separated) *"
              required
              placeholder="Copper, Gold, Molybdenum"
              value={commodityFocus}
              onChange={(e) => setCommodityFocus(e.target.value)}
            />

            <Input
              label="Target Coordinates (Lat, Lon)"
              placeholder="29.1250, 64.3800"
              value={targetCoordinates}
              onChange={(e) => setTargetCoordinates(e.target.value)}
            />

            <Input
              label="License Area (Hectares)"
              type="number"
              step="0.01"
              placeholder="4850"
              value={targetSizeHectares}
              onChange={(e) => setTargetSizeHectares(e.target.value)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. Technical Context & Commercial Priority</CardTitle>
            <CardDescription>Geological background, client risk questions, and commercial turnaround</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-medium uppercase tracking-widest text-geo-slate-light">
                Project Geological Description *
              </label>
              <textarea
                rows={4}
                required
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                placeholder="Describe regional geology, alteration zones, structural setting, and exploration history..."
                className="w-full rounded-none border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-geo-white placeholder:text-geo-slate/50 focus:outline-none focus:border-geo-gold"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-medium uppercase tracking-widest text-geo-slate-light">
                  Available Datasets
                </label>
                <textarea
                  rows={3}
                  value={existingData}
                  onChange={(e) => setExistingData(e.target.value)}
                  placeholder="ASTER imagery, stream sediment geochemistry, aeromagnetics..."
                  className="w-full rounded-none border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-geo-white placeholder:text-geo-slate/50 focus:outline-none focus:border-geo-gold"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[11px] font-medium uppercase tracking-widest text-geo-slate-light">
                  Specific Risk Concerns
                </label>
                <textarea
                  rows={3}
                  value={specificConcerns}
                  onChange={(e) => setSpecificConcerns(e.target.value)}
                  placeholder="Depth of post-mineral cover, fault offset, tenement security..."
                  className="w-full rounded-none border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-geo-white placeholder:text-geo-slate/50 focus:outline-none focus:border-geo-gold"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[11px] font-medium uppercase tracking-widest text-geo-slate-light">
                  Key Client Questions
                </label>
                <textarea
                  rows={3}
                  value={keyQuestions}
                  onChange={(e) => setKeyQuestions(e.target.value)}
                  placeholder="Should we proceed to IP geophysical survey or walk away?"
                  className="w-full rounded-none border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-geo-white placeholder:text-geo-slate/50 focus:outline-none focus:border-geo-gold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-white/[0.06]">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-medium uppercase tracking-widest text-geo-slate-light">
                  Turnaround Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => {
                    const p = e.target.value as "STANDARD" | "RUSH";
                    setPriority(p);
                    setQuotedPrice(p === "RUSH" ? "5000" : "3500");
                  }}
                  className="flex h-10 w-full rounded-none border border-white/10 bg-[#0D1F35] px-3 py-2 text-sm text-geo-white focus:outline-none focus:border-geo-gold"
                >
                  <option value="STANDARD">Standard (5 to 7 Business Days)</option>
                  <option value="RUSH">Rush (72 Hours)</option>
                </select>
              </div>
              <Input
                label="Quoted Fee"
                type="number"
                step="0.01"
                value={quotedPrice}
                onChange={(e) => setQuotedPrice(e.target.value)}
              />
              <div className="space-y-1.5">
                <label className="block text-[11px] font-medium uppercase tracking-widest text-geo-slate-light">
                  Currency
                </label>
                <select
                  value={quotedCurrency}
                  onChange={(e) => setQuotedCurrency(e.target.value)}
                  className="flex h-10 w-full rounded-none border border-white/10 bg-[#0D1F35] px-3 py-2 text-sm text-geo-white focus:outline-none focus:border-geo-gold"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Link href="/geosentry-portal/requests">
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" isLoading={isSubmitting} leftIcon={<PlusCircle className="h-4 w-4" />}>
                Create Screening Request
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
