"use client";

import { useEffect, useRef, useState } from "react";

/* =====================================================
   WHY US DATA
   No images needed — pure UI.
===================================================== */

const cards = [
  {
    number: "01",
    title: "CREATE",
    description:
      "Ideas with intention. From concept to execution, we build moments that feel distinct.",
    icon: "◈",
    metric: "100+",
    metricLabel: "Concepts Executed",
    features: ["Concept Design", "Venue Curation", "Creative Direction"],
    gradient: "from-orange to-red",
    hue: "#ff552d",
  },
  {
    number: "02",
    title: "CONNECT",
    description:
      "People before platforms. We create experiences that bring communities together.",
    icon: "◉",
    metric: "50K+",
    metricLabel: "People Connected",
    features: ["Community Events", "Brand Partnerships", "Social Experiences"],
    gradient: "from-red to-orange",
    hue: "#ff7a5a",
  },
  {
    number: "03",
    title: "CAPTURE",
    description:
      "Moments that stay. Visuals and stories designed to live beyond the event itself.",
    icon: "✦",
    metric: "∞",
    metricLabel: "Stories Told",
    features: ["Visual Storytelling", "Digital Archive", "Brand Narrative"],
    gradient: "from-orange to-amber",
    hue: "#ff6644",
  },
];

/* =====================================================
   ANIMATED RING
===================================================== */

function AnimatedRing({ hue, active }) {
  return (
    <div
      className="why-us-ring-wrap"
      style={{ "--ring-hue": hue }}
    >
      <div className={`why-us-ring why-us-ring--1 ${active ? "why-us-ring--active" : ""}`} />
      <div className={`why-us-ring why-us-ring--2 ${active ? "why-us-ring--active" : ""}`} />
      <div className={`why-us-ring why-us-ring--3 ${active ? "why-us-ring--active" : ""}`} />
      <div className="why-us-ring-center">
        <div className="why-us-ring-dot" />
      </div>
    </div>
  );
}

/* =====================================================
   FEATURE TAG
===================================================== */

function FeatureTag({ label }) {
  return (
    <span className="why-us-feature-tag">
      <span className="why-us-feature-tag-dot" />
      {label}
    </span>
  );
}

/* =====================================================
   REDESIGNED CARD (no photos)
===================================================== */

function WhyUsCard({ card }) {
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef(null);
  const glowRef = useRef(null);

  /* Magnetic glow that follows mouse inside card */
  const handleMouseMove = (e) => {
    const card = cardRef.current;
    const glow = glowRef.current;
    if (!card || !glow) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    glow.style.background = `radial-gradient(
      420px circle at ${x}px ${y}px,
      ${card.getAttribute("data-hue")}22 0%,
      transparent 65%
    )`;
  };

  return (
    <article
      ref={cardRef}
      className="why-us-card"
      data-hue={card.hue}
      style={{
        "--card-hue": card.hue,
        position: "relative",
        zIndex: 50,
        isolation: "isolate",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
    >
      {/* Magnetic glow layer */}
      <div ref={glowRef} className="why-us-card-magnetic-glow" />

      {/* Gradient accent layer */}
      <div className={`why-us-card-accent-layer ${hovered ? "why-us-card-accent-layer--active" : ""}`} />

      {/* ---- TOP ---- */}
      <div className="why-us-card-top" style={{ position: "relative", zIndex: 10 }}>
        <span className="why-us-card-number">{card.number}</span>
        <AnimatedRing hue={card.hue} active={hovered} />
      </div>

      {/* ---- VISUAL AREA (replaces photo) ---- */}
      <div className="why-us-visual-area">
        {/* Large display icon */}
        <div className={`why-us-visual-icon ${hovered ? "why-us-visual-icon--active" : ""}`}>
          {card.icon}
        </div>

        {/* Big metric */}
        <div className="why-us-visual-metric">
          <span className="why-us-visual-metric-value">{card.metric}</span>
          <span className="why-us-visual-metric-label">{card.metricLabel}</span>
        </div>

        {/* Geometric grid lines */}
        <div className="why-us-visual-grid">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="why-us-visual-grid-line" />
          ))}
        </div>

        {/* Corner bracket */}
        <div className="why-us-visual-bracket why-us-visual-bracket--tl" />
        <div className="why-us-visual-bracket why-us-visual-bracket--br" />
      </div>

      {/* ---- BOTTOM ---- */}
      <div
        className="why-us-card-bottom"
        style={{ position: "relative", zIndex: 10 }}
      >
        <div>
          <h3>{card.title}</h3>
          <p>{card.description}</p>

          <div className="why-us-features">
            {card.features.map((f) => (
              <FeatureTag key={f} label={f} />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom accent line */}
      <div
        className="why-us-card-line"
        style={{ position: "relative", zIndex: 10 }}
      />
    </article>
  );
}

/* =====================================================
   WHY US
===================================================== */

export default function WhyUs() {
  return (
    <section
      id="why-us"
      className="why-us-section"
      style={{
        position: "relative",
        zIndex: 50,
        isolation: "isolate",
      }}
    >
      <div
        className="why-us-inner"
        style={{ position: "relative", zIndex: 50 }}
      >

        {/* ---- HEADER ---- */}
        <div
          className="why-us-header"
          style={{ position: "relative", zIndex: 50 }}
        >
          <div className="why-us-kicker">
            <span />
            WHY TRIVENTS
          </div>

          <h2>EXPERIENCE BEYOND ORDINARY</h2>

          <p>
            We turn events into experiences, experiences into stories,
            and stories into something people remember.
          </p>
        </div>

        {/* ---- CARDS ---- */}
        <div
          className="why-us-grid"
          style={{ position: "relative", zIndex: 50 }}
        >
          {cards.map((card) => (
            <WhyUsCard key={card.title} card={card} />
          ))}
        </div>

      </div>
    </section>
  );
}