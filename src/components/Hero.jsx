"use client";

import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section id="home" className="hero-section">
      <div className="hero-content">
        {/* Eyebrow */}
        <div className="hero-eyebrow">
          <span>Social Media Club of Trinity Institute</span>
        </div>

        {/* Headline */}
        <h1 className="hero-title">
          <span>We Capture</span>
          <span>We Create</span>
          <span>We Connect</span>
        </h1>

        {/* Description */}
        <p className="hero-description">
          Trivents is the creative club of Trinity Institute — building stories,
          moments, and digital experiences with culture, creativity, and
          community at the center.
        </p>

        {/* CTAs */}
        <div className="hero-ctas">
          <a href="#about" className="hero-cta-primary">
            Discover Trivents
            <ArrowRight className="h-4 w-4" />
          </a>
          <a href="#contact" className="hero-cta-secondary">
            Get in Touch
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="hero-scroll-indicator">
        <span>Scroll</span>
        <div className="hero-scroll-line" />
      </div>
    </section>
  );
}
