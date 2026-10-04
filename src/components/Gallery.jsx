"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import "./Gallery.css";

/* =====================================================
   GALLERY MOSAIC DATA
   No external photos — uses gradients, shapes, and type.
===================================================== */

const mosaicItems = [
  { label: "LIVE EVENTS", tag: "01", accent: "#ff552d", sub: "2024", type: "large", icon: "◈" },
  { label: "BRAND COLLABS", tag: "02", accent: "#ff7a5a", sub: "SERIES", type: "wide", icon: "◉" },
  { label: "UNDERGROUND", tag: "03", accent: "#ff3a1a", sub: "SESSIONS", type: "tall", icon: "▲" },
  { label: "POP-UPS", tag: "04", accent: "#ff9070", sub: "DROPS", type: "small", icon: "◆" },
  { label: "DIGITAL", tag: "05", accent: "#ff5533", sub: "ACTIVATIONS", type: "medium", icon: "◎" },
  { label: "IMMERSIVE", tag: "06", accent: "#ff6644", sub: "EXPERIENCES", type: "small", icon: "❋" },
  { label: "AFTER PARTIES", tag: "07", accent: "#ff4422", sub: "EXCLUSIVE", type: "wide", icon: "◐" },
  { label: "ARTIST NIGHTS", tag: "08", accent: "#ff7744", sub: "CURATED", type: "medium", icon: "✦" },
  { label: "COMMUNITY", tag: "09", accent: "#ff6633", sub: "GATHERINGS", type: "tall", icon: "◑" },
];

const stats = [
  { value: "200+", label: "Events Created" },
  { value: "50K+", label: "Lives Touched" },
  { value: "3", label: "Cities Active" },
  { value: "100%", label: "Passion-Driven" },
];

/* =====================================================
   MOSAIC CARD
===================================================== */

function MosaicCard({ item, index }) {
  return (
    <div
      className={`gallery-mosaic-card gallery-mosaic-card--${item.type}`}
      style={{ "--card-accent": item.accent }}
      data-index={index}
    >
      <div className="gallery-mosaic-card-bg" />
      <div className="gallery-mosaic-card-glow" />
      <div className="gallery-mosaic-card-noise" />

      <div className="gallery-mosaic-card-content">
        <div className="gallery-mosaic-card-header">
          <span className="gallery-mosaic-card-tag">{item.tag}</span>
          <span className="gallery-mosaic-card-icon">{item.icon}</span>
        </div>

        <div className="gallery-mosaic-card-body">
          <p className="gallery-mosaic-card-sub">{item.sub}</p>
          <h3 className="gallery-mosaic-card-label">{item.label}</h3>
        </div>

        <div className="gallery-mosaic-card-corner" />
      </div>
    </div>
  );
}

/* =====================================================
   FLOATING TICKER
===================================================== */

function GalleryTicker() {
  const trackRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const tween = gsap.to(track, {
      xPercent: -50,
      duration: 22,
      ease: "none",
      repeat: -1,
    });

    return () => tween.kill();
  }, []);

  const words = ["TRIVENTS", "ARCHIVE", "MOMENTS", "COLLABS", "CULTURE", "LIVE"];
  const repeated = [...words, ...words];

  return (
    <div className="gallery-ticker">
      <div className="gallery-ticker-track" ref={trackRef}>
        {repeated.map((word, i) => (
          <span key={i} className="gallery-ticker-word">
            {word}
            <span className="gallery-ticker-dot">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* =====================================================
   STATS ROW
===================================================== */

function GalleryStats() {
  return (
    <div className="gallery-stats">
      {stats.map((stat) => (
        <div key={stat.label} className="gallery-stat">
          <span className="gallery-stat-value">{stat.value}</span>
          <span className="gallery-stat-label">{stat.label}</span>
        </div>
      ))}
    </div>
  );
}

/* =====================================================
   GALLERY
===================================================== */

export default function Gallery() {
  const mosaicRef = useRef(null);
  const mouseX = useRef(0.5);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.current = e.clientX / window.innerWidth;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    const cards = mosaicRef.current?.querySelectorAll(".gallery-mosaic-card");
    if (!cards) return;

    const ticker = () => {
      const offset = (mouseX.current - 0.5) * 18;
      cards.forEach((card, i) => {
        const dir = i % 2 === 0 ? 1 : -1;
        const depth = 0.4 + (i % 3) * 0.3;
        gsap.to(card, {
          y: offset * dir * depth,
          x: offset * dir * depth * 0.4,
          duration: 1.2 + i * 0.05,
          ease: "power2.out",
          overwrite: "auto",
        });
      });
    };

    gsap.ticker.add(ticker);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      gsap.ticker.remove(ticker);
    };
  }, []);

  return (
    <section id="gallery" className="gallery-section">
      <div className="gallery-inner">

        {/* ---- HEADER ---- */}
        <div className="gallery-header">
          <div className="gallery-kicker">
            <span />
            GALLERY
          </div>

          <h2>
            COLLABS
            <br />
            &amp; EVENTS
          </h2>

          <p>
            A collection of moments, collaborations and
            experiences created along the way.
          </p>
        </div>

        {/* ---- TICKER ---- */}
        <GalleryTicker />

        {/* ---- MOSAIC GRID ---- */}
        <div className="gallery-mosaic" ref={mosaicRef}>
          {mosaicItems.map((item, index) => (
            <MosaicCard key={item.tag} item={item} index={index} />
          ))}

          {/* Decorative accent orb */}
          <div className="gallery-mosaic-orb" />
        </div>

        {/* ---- STATS ---- */}
        <GalleryStats />

        {/* ---- FOOTER LABEL ---- */}
        <div className="gallery-footer">
          <span>TRIVENTS / ARCHIVE</span>
          <span>9 CATEGORIES</span>
        </div>

      </div>
    </section>
  );
}