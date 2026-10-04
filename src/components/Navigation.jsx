"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  Home,
  Sparkles,
  LayoutGrid,
  Users,
  Send,
  ArrowRight,
} from "lucide-react";

const NAV_LINKS = [
  { label: "Home", href: "#home", icon: Home },
  { label: "Why Us", href: "#why-us", icon: Sparkles },
  { label: "Gallery", href: "#gallery", icon: LayoutGrid },
  { label: "About", href: "#about", icon: Users },
  { label: "Contact", href: "#contact", icon: Send },
];

// macOS dock magnification constants
const BASE_SCALE = 1;
const MAX_SCALE = 1.55;
const NEIGHBOR_SCALE = 1.28;
const MAGNETIC_RADIUS = 80; // px — how far the effect spreads

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [mouseX, setMouseX] = useState(null);
  const dockRef = useRef(null);
  const itemRefs = useRef([]);

  // ── Scroll detection ──────────────────────────────────────────────────────
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ── Active section tracking ───────────────────────────────────────────────
  useEffect(() => {
    const sections = NAV_LINKS.map((link) =>
      document.querySelector(link.href)
    ).filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { threshold: 0.25, rootMargin: "-70px 0px -40% 0px" }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // ── Body scroll lock when mobile menu open ────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // ── Mouse tracking for dock magnification ────────────────────────────────
  const handleDockMouseMove = useCallback((e) => {
    setMouseX(e.clientX);
  }, []);

  const handleDockMouseLeave = useCallback(() => {
    setMouseX(null);
  }, []);

  /**
   * Compute the scale for each dock item based on cursor distance from its
   * center.  Uses a smooth cosine-like falloff (same approach as macOS).
   */
  const getItemScale = (idx) => {
    if (mouseX === null) return BASE_SCALE;
    const el = itemRefs.current[idx];
    if (!el) return BASE_SCALE;

    const rect = el.getBoundingClientRect();
    const itemCenterX = rect.left + rect.width / 2;
    const dist = Math.abs(mouseX - itemCenterX);

    if (dist > MAGNETIC_RADIUS) return BASE_SCALE;

    // Cosine-shaped falloff: 1 at dist=0, 0 at dist=MAGNETIC_RADIUS
    const t = 1 - dist / MAGNETIC_RADIUS;
    const eased = t * t * (3 - 2 * t); // smoothstep
    return BASE_SCALE + (MAX_SCALE - BASE_SCALE) * eased;
  };

  const handleMobileNavClick = (href) => {
    setMobileOpen(false);
    setTimeout(() => {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 280);
  };

  return (
    <>
      <header className={`nav-header ${scrolled ? "scrolled" : ""}`}>
        {/* Logo */}
        <a href="#home" className="nav-logo" aria-label="Trivents home">
          <div className="nav-logo-icon-wrap">
            <img src="/images/logo.png" alt="Trivents logo" />
          </div>
          <span className="nav-logo-text">Trivents</span>
        </a>

        {/* Center — Interactive Dock Navigation with magnification */}
        <nav
          ref={dockRef}
          className="nav-desktop nav-dock"
          aria-label="Main navigation dock"
          onMouseMove={handleDockMouseMove}
          onMouseLeave={handleDockMouseLeave}
        >
          {NAV_LINKS.map((link, idx) => {
            const Icon = link.icon;
            const isActive = activeSection === link.href.slice(1);
            const scale = getItemScale(idx);

            return (
              <a
                key={link.href}
                ref={(el) => { itemRefs.current[idx] = el; }}
                href={link.href}
                className={`nav-link nav-dock-item ${isActive ? "active" : ""}`}
                style={{
                  transform: `scale(${scale}) translateY(${scale > 1 ? (scale - 1) * -8 : 0}px)`,
                  transformOrigin: "bottom center",
                  transition: mouseX === null
                    ? "transform 0.35s cubic-bezier(0.34,1.56,0.64,1)"
                    : "transform 0.08s linear",
                  willChange: "transform",
                  zIndex: Math.round(scale * 10),
                }}
              >
                <span className="nav-dock-icon-wrap">
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <span className="nav-dock-label">{link.label}</span>
                {isActive && <span className="nav-dock-active-dot" />}
              </a>
            );
          })}
        </nav>

        {/* Right — Quick Action & Mobile Toggle */}
        <div className="nav-actions">
          <a href="#contact" className="nav-quick-cta">
            <span>Get in Touch</span>
            <ArrowRight className="h-3 w-3" />
          </a>

          <button
            className={`nav-mobile-toggle ${mobileOpen ? "open" : ""}`}
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`nav-mobile-overlay ${mobileOpen ? "open" : ""}`}
        aria-hidden={!mobileOpen}
      >
        <div className="nav-mobile-inner">
          <div className="nav-mobile-header">
            <span className="nav-mobile-tag">NAVIGATION</span>
          </div>

          <div className="nav-mobile-links">
            {NAV_LINKS.map((link, index) => {
              const Icon = link.icon;
              const isActive = activeSection === link.href.slice(1);

              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={`nav-mobile-link ${isActive ? "active" : ""}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleMobileNavClick(link.href);
                  }}
                  style={{
                    transitionDelay: mobileOpen ? `${index * 50}ms` : "0ms",
                    opacity: mobileOpen ? 1 : 0,
                    transform: mobileOpen ? "translateX(0)" : "translateX(16px)",
                    transition: "opacity 0.28s ease, transform 0.28s ease",
                  }}
                >
                  <span className="nav-mobile-link-left">
                    <Icon className="h-4 w-4 nav-mobile-link-icon" />
                    <span>{link.label}</span>
                  </span>
                  <ArrowRight className="h-4 w-4 nav-mobile-link-arrow" />
                </a>
              );
            })}
          </div>

          <div className="nav-mobile-footer">
            <a
              href="mailto:creative.trivents@gmail.com"
              className="nav-mobile-footer-email"
            >
              creative.trivents@gmail.com
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
