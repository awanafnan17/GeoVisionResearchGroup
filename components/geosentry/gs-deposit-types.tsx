import { GEOSENTRY_DEPOSIT_TYPES } from "@/lib/constants";
import { getDepositTypeLabel } from "@/lib/utils";

const DISPLAY_DEPOSIT_TYPES = [
  "PORPHYRY",
  "VMS",
  "EPITHERMAL_HIGH_SULPHIDATION",
  "EPITHERMAL_LOW_SULPHIDATION",
  "OROGENIC_GOLD",
  "IOCG",
  "SKARN",
  "CARLIN_TYPE",
  "NICKEL_LATERITE",
  "PEGMATITE_LITHIUM_REE",
  "BIF_IRON",
  "MVT_LEAD_ZINC",
] as const;

const DEPOSIT_METADATA: Record<
  string,
  { code: string; commodities: string; vector: string }
> = {
  PORPHYRY: {
    code: "MOD-01 • MAG-HYD",
    commodities: "Cu-Mo-Au-Ag",
    vector: "Potassic-phyllic-propylitic concentric SWIR zonation",
  },
  VMS: {
    code: "MOD-02 • EXH-MAF",
    commodities: "Cu-Zn-Pb-Au-Ag",
    vector: "Ophiolite sheeted-dike contacts, chlorite-epidote footwall pipes",
  },
  EPITHERMAL_HIGH_SULPHIDATION: {
    code: "MOD-03 • EPI-HS",
    commodities: "Au-Ag-Cu",
    vector: "Vuggy residual silica, alunite-dickite-pyrophyllite SWIR signature",
  },
  EPITHERMAL_LOW_SULPHIDATION: {
    code: "MOD-04 • EPI-LS",
    commodities: "Au-Ag",
    vector: "Banded chalcedony-adularia-illite extensional vein arrays",
  },
  OROGENIC_GOLD: {
    code: "MOD-05 • ORO-SZ",
    commodities: "Au (±As-Sb-W)",
    vector: "Greenschist second-order shear zones, carbonate-sericite-sulfide halos",
  },
  IOCG: {
    code: "MOD-06 • IOCG-BX",
    commodities: "Cu-Au-Fe-U-REE",
    vector: "Coincident gravity-magnetic highs, sodic-calcic & hematite breccias",
  },
  SKARN: {
    code: "MOD-07 • MET-SKN",
    commodities: "Cu-Au-Zn-W-Mo",
    vector: "Prograde garnet-pyroxene endoskarn/exoskarn at carbonate contacts",
  },
  CARLIN_TYPE: {
    code: "MOD-08 • SED-CAR",
    commodities: "Au (As-Sb-Hg-Tl)",
    vector: "Decalcified silty carbonate horizons, jasperoid replacement & feeder faults",
  },
  NICKEL_LATERITE: {
    code: "MOD-09 • SUP-LAT",
    commodities: "Ni-Co-Sc",
    vector: "Ultramafic regolith preservation, saprolite-limonite plateau geomorphology",
  },
  PEGMATITE_LITHIUM_REE: {
    code: "MOD-10 • LCT-PEG",
    commodities: "Li-Cs-Ta-Sn-REE",
    vector: "Fractionated fertile S-type granite aureoles, spodumene-lepidolite fractionation",
  },
  BIF_IRON: {
    code: "MOD-11 • PRE-BIF",
    commodities: "Fe (Hematite-Magnetite)",
    vector: "Supergene-enriched martite-goethite structural fold hinges",
  },
  MVT_LEAD_ZINC: {
    code: "MOD-12 • BAS-MVT",
    commodities: "Zn-Pb-Ag (±Ba-F)",
    vector: "Dolomitized platform carbonate reef margins and collapse breccias",
  },
};

export function GsDepositTypes() {
  return (
    <section
      className="section-padding bg-geo-stone text-geo-ink border-b border-geo-stone-border"
      aria-label="Deposit types covered"
    >
      <div className="container-custom">
        {/* Top Metadata Rule */}
        <div className="flex items-baseline gap-4 text-[11px] font-mono uppercase tracking-[0.24em] text-geo-slate mb-10">
          <span className="text-geo-ink font-semibold">
            DEPOSIT MODEL CLASSIFICATION MATRIX
          </span>
          <span className="h-px flex-1 bg-geo-stone-border" />
          <span className="tabular-nums">24 MINERAL SYSTEMS SUPPORTED</span>
        </div>

        {/* Asymmetric Section Intro */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-14">
          <div className="lg:col-span-6">
            <h2 className="text-headline text-geo-ink">
              Deposit Models &amp;{" "}
              <span className="italic font-normal text-geo-gold-dark">
                Metallogenic
              </span>{" "}
              Coverage.
            </h2>
          </div>
          <div className="lg:col-span-6 flex items-end">
            <p className="text-sm sm:text-base text-geo-charcoal leading-relaxed">
              Each GeoSentry screening applies deposit-specific diagnostic
              rubrics—calibrating spectral alteration bands, structural trap
              geometries, and geochemical pathfinder suites to the target&apos;s
              genetic mineral system.
            </p>
          </div>
        </div>

        {/* 12-System Swiss Grid Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t border-l border-geo-stone-border bg-white/70">
          {DISPLAY_DEPOSIT_TYPES.map((dt) => {
            const info = GEOSENTRY_DEPOSIT_TYPES.find((d) => d.value === dt);
            const meta = DEPOSIT_METADATA[dt];

            return (
              <div
                key={dt}
                className="p-6 border-r border-b border-geo-stone-border flex flex-col justify-between hover:bg-geo-stone-muted/50 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-geo-stone-border/70">
                    <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.16em] text-geo-gold-dark">
                      {meta?.code ?? "MOD • GEN"}
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-mono font-semibold bg-geo-stone-muted border border-geo-stone-border text-geo-ink">
                      {meta?.commodities ?? "Polymetallic"}
                    </span>
                  </div>

                  <h3 className="text-lg font-heading text-geo-ink mb-2">
                    {getDepositTypeLabel(dt)}
                  </h3>

                  {info && (
                    <p className="text-xs text-geo-slate leading-relaxed mb-4">
                      {info.description}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-geo-stone-border/70 space-y-1.5 text-[11px]">
                  {meta && (
                    <div>
                      <span className="font-mono uppercase tracking-[0.12em] text-geo-slate block text-[10px]">
                        DIAGNOSTIC VECTOR:
                      </span>
                      <span className="text-geo-ink font-medium">
                        {meta.vector}
                      </span>
                    </div>
                  )}
                  {info?.examples && (
                    <div>
                      <span className="font-mono uppercase tracking-[0.12em] text-geo-slate mr-1 text-[10px]">
                        ANALOGUES:
                      </span>
                      <span className="font-mono text-[10px] text-geo-charcoal">
                        {info.examples}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
