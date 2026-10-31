"use client";

export function WebGLFallback() {
  return (
    <div
      className="relative w-full h-full min-h-[500px] flex items-center justify-center overflow-hidden bg-[#060B14]"
      aria-label="Geological Strata and Topographic Visualization Fallback"
    >
      {/* Atmospheric Ambient Depth Glows */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* SVG Topographic Contour and Subsurface Cross-Section */}
      <svg
        viewBox="0 0 800 600"
        className="w-full h-full max-w-2xl opacity-80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="contourGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.7" />
            <stop offset="50%" stopColor="#06B6D4" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="veinGradGold" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#D97706" stopOpacity="0.3" />
          </linearGradient>
          <radialGradient id="crystalGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#060B14" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient Focal Glow */}
        <circle cx="500" cy="280" r="180" fill="url(#crystalGlow)" />

        {/* Topographic Elevation Contours */}
        <path
          d="M 250,140 Q 380,100 520,130 T 720,200"
          stroke="url(#contourGrad)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
        <path
          d="M 220,180 Q 360,140 500,170 T 750,250"
          stroke="url(#contourGrad)"
          strokeWidth="1.2"
        />
        <path
          d="M 200,230 Q 340,190 480,220 T 730,310"
          stroke="url(#contourGrad)"
          strokeWidth="1.5"
        />
        <path
          d="M 180,280 Q 330,240 470,270 T 710,370"
          stroke="url(#contourGrad)"
          strokeWidth="2"
        />
        <path
          d="M 170,340 Q 320,300 460,330 T 690,430"
          stroke="url(#contourGrad)"
          strokeWidth="1.2"
        />
        <path
          d="M 160,400 Q 310,360 450,390 T 670,490"
          stroke="url(#contourGrad)"
          strokeWidth="1"
          strokeDasharray="6 3"
        />

        {/* Crystalline Mineral Specimen Facet Wireframe */}
        <g transform="translate(500, 240)">
          {/* Main Crystal Prism Facets */}
          <polygon
            points="0,-90 55,-30 40,65 -40,65 -55,-30"
            stroke="#10B981"
            strokeWidth="1.8"
            fill="rgba(16, 185, 129, 0.08)"
          />
          <line x1="0" y1="-90" x2="0" y2="65" stroke="#34D399" strokeWidth="1.2" />
          <line x1="-55" y1="-30" x2="0" y2="0" stroke="#06B6D4" strokeWidth="1" />
          <line x1="55" y1="-30" x2="0" y2="0" stroke="#06B6D4" strokeWidth="1" />
          <line x1="0" y1="0" x2="-40" y2="65" stroke="#06B6D4" strokeWidth="1" />
          <line x1="0" y1="0" x2="40" y2="65" stroke="#06B6D4" strokeWidth="1" />

          {/* Flanking Prisms */}
          <polygon
            points="-60,-10 -90,30 -65,75 -40,65 -45,15"
            stroke="#06B6D4"
            strokeWidth="1.2"
            fill="rgba(6, 182, 212, 0.05)"
          />
          <polygon
            points="55,-10 90,30 65,75 40,65 45,15"
            stroke="#06B6D4"
            strokeWidth="1.2"
            fill="rgba(6, 182, 212, 0.05)"
          />

          {/* Stratified Horizon Base Plates */}
          <ellipse cx="0" cy="95" rx="100" ry="22" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          <ellipse cx="0" cy="125" rx="115" ry="24" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
          <ellipse cx="0" cy="160" rx="130" ry="26" stroke="url(#veinGradGold)" strokeWidth="1.8" />
        </g>

        {/* Geological Technical Markers in JetBrains Mono */}
        <text x="210" y="175" fill="#10B981" fontSize="10" fontFamily="var(--font-mono), monospace" letterSpacing="0.1em">
          +1,890m ASL [STRUCTURAL HIGH]
        </text>
        <text x="180" y="275" fill="#06B6D4" fontSize="10" fontFamily="var(--font-mono), monospace" letterSpacing="0.1em">
          0m DATUM [SURFACE REGOLITH]
        </text>
        <text x="160" y="395" fill="#F59E0B" fontSize="10" fontFamily="var(--font-mono), monospace" letterSpacing="0.1em">
          -1,500m [METALLOGENIC SULFIDE CORE]
        </text>
      </svg>

      {/* Modern Badge Overlay */}
      <div className="absolute bottom-6 right-8 px-3.5 py-1.5 rounded-full border border-white/10 bg-[#0B1324]/80 backdrop-blur-md text-[11px] font-sans text-slate-300 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span>Subsurface Strata &bull; High-Fidelity Contour Model</span>
      </div>
    </div>
  );
}
