"use client";

import Reveal from "./Reveal";
import {
  Sparkles,
  ArrowRight,
} from "lucide-react";

const APPROACH_STEPS = [
  {
    number: "01",
    title: "Discover",
    description:
      "We listen first. Understanding the community, the culture, and the story waiting to be told.",
  },
  {
    number: "02",
    title: "Design",
    description:
      "Every experience is crafted with intention — from concept to visual identity.",
  },
  {
    number: "03",
    title: "Build",
    description:
      "We bring ideas to life through events, content, and digital experiences.",
  },
  {
    number: "04",
    title: "Deliver",
    description:
      "Moments that resonate. Stories that stay long after the event ends.",
  },
];

export default function About() {
  return (
    <section id="about" className="about-section">
      <div className="about-ambient-glow" aria-hidden="true" />

      <div className="about-inner">
        {/* =====================================================
            HEADER / STORY: WHO WE ARE & WHAT WE DO
        ===================================================== */}
        <div className="about-header-block">
          <Reveal>
            <div className="about-pill-label">
              <Sparkles className="h-3 w-3 text-accent" />
              <span>WHO WE ARE</span>
            </div>

            <h2 className="about-main-title">
              THE CREATIVE COLLECTIVE OF{" "}
              <span className="about-title-highlight">TRINITY INSTITUTE</span>
            </h2>
          </Reveal>

          <div className="about-story-grid">
            <Reveal delay={1} className="about-story-card">
              <div className="about-story-card-tag">01 / IDENTITY</div>
              <h3 className="about-story-heading">
                We are designers, storytellers &amp; creators.
              </h3>
              <p className="about-story-p">
                Trivents is the social media and event creative club of Trinity
                Institute. We are a collective of designers, writers,
                photographers, and storytellers who believe that the best
                experiences are the ones that bring people together.
              </p>
              <div className="about-story-badges">
                <span className="about-mini-badge">Campus Media</span>
                <span className="about-mini-badge">Event Production</span>
                <span className="about-mini-badge">Creative Strategy</span>
              </div>
            </Reveal>

            <Reveal delay={2} className="about-story-card about-story-card--accent">
              <div className="about-story-card-tag">02 / MISSION</div>
              <h3 className="about-story-heading">
                We craft moments that resonate.
              </h3>
              <p className="about-story-p">
                From concept to execution, we create events, content, and digital
                experiences that capture the energy of our community. Every
                project is an opportunity to tell a story worth remembering.
              </p>
              <div className="about-story-badges">
                <span className="about-mini-badge">Live Experiences</span>
                <span className="about-mini-badge">Digital Storytelling</span>
                <span className="about-mini-badge">Community First</span>
              </div>
            </Reveal>
          </div>
        </div>

        {/* =====================================================
            OUR APPROACH (4-STEP HORIZONTAL FLOW)
        ===================================================== */}
        <div className="about-sub-block">
          <Reveal>
            <div className="about-section-header">
              <div className="about-pill-label">
                <span>03 / OUR APPROACH</span>
              </div>
              <h2 className="about-section-title">
                HOW WE <span className="highlight">WORK</span>
              </h2>
              <p className="about-section-subtitle">
                A structured creative process that transforms raw ideas into
                unforgettable campus moments.
              </p>
            </div>
          </Reveal>

          <div className="about-approach-grid">
            {APPROACH_STEPS.map((step, index) => (
              <Reveal key={step.number} delay={index + 1} className="about-approach-col">
                <div className="about-step-card">
                  <div className="about-step-header">
                    <span className="about-step-num">{step.number}</span>
                    {index < APPROACH_STEPS.length - 1 && (
                      <span className="about-step-arrow" aria-hidden="true">
                        <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    )}
                  </div>
                  <h3 className="about-step-title">{step.title}</h3>
                  <p className="about-step-desc">{step.description}</p>
                  <div className="about-step-glow" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
