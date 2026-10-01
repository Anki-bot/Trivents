"use client";

import Reveal from "./Reveal";
import {
  Lightbulb,
  Users,
  Target,
  Zap,
  Shield,
  Heart,
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

const DIFFERENTIATORS = [
  {
    icon: Lightbulb,
    title: "Creative First",
    description:
      "We approach every project with fresh thinking and original concepts.",
  },
  {
    icon: Users,
    title: "Community Driven",
    description:
      "Built by students, for students — everything we do serves the community.",
  },
  {
    icon: Target,
    title: "Detail Obsessed",
    description:
      "From the big picture to the smallest detail, we craft every element.",
  },
  {
    icon: Zap,
    title: "Fast & Agile",
    description:
      "We move quickly without compromising quality — ideas become reality.",
  },
  {
    icon: Shield,
    title: "Reliable",
    description:
      "When we commit, we deliver. Trust is the foundation of everything.",
  },
  {
    icon: Heart,
    title: "Passionate",
    description:
      "This isn&apos;t just a club — it&apos;s a creative family that loves what it does.",
  },
];

const VALUES = [
  {
    title: "Innovation",
    description: "Pushing creative boundaries in everything we do.",
  },
  {
    title: "Collaboration",
    description: "Better together — every voice matters in the process.",
  },
  {
    title: "Quality",
    description: "We don't ship mediocre. Every detail gets attention.",
  },
  {
    title: "Transparency",
    description: "Open communication with our community and partners.",
  },
  {
    title: "Impact",
    description: "Creating moments that genuinely matter to people.",
  },
  {
    title: "Growth",
    description: "Always learning, always evolving, always improving.",
  },
];

export default function About() {
  return (
    <section id="about" className="about-section">
      <div className="about-inner">
        {/* Block 01 — Who We Are */}
        <Reveal className="about-block">
          <div className="about-block-label">01 — Who We Are</div>
          <h2 className="section-heading" style={{ marginBottom: "var(--space-5)" }}>
            The creative club of
            <br />
            <span className="highlight">Trinity Institute</span>
          </h2>
          <p className="about-intro">
            Trivents is the social media and event creative club of Trinity
            Institute. We are a collective of designers, writers, photographers,
            and storytellers who believe that the best experiences are the ones
            that bring people together.
          </p>
        </Reveal>

        {/* Block 02 — What We Do */}
        <Reveal className="about-block" delay={1}>
          <div className="about-block-label">02 — What We Do</div>
          <h2 className="section-heading" style={{ marginBottom: "var(--space-5)" }}>
            We build
            <br />
            <span className="highlight">experiences</span>
          </h2>
          <p className="about-intro">
            From concept to execution, we create events, content, and digital
            experiences that capture the energy of our community. Every project
            is an opportunity to tell a story worth remembering.
          </p>
        </Reveal>

        {/* Block 03 — Our Approach */}
        <Reveal className="about-block" delay={2}>
          <div className="about-block-label">03 — Our Approach</div>
          <h2 className="section-heading" style={{ marginBottom: "var(--space-5)" }}>
            How we
            <br />
            <span className="highlight">work</span>
          </h2>
          <div className="about-approach">
            {APPROACH_STEPS.map((step, index) => (
              <div key={step.number} className="about-approach-step">
                <div className="step-number">{step.number}</div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
                {index < APPROACH_STEPS.length - 1 && (
                  <span className="step-arrow">→</span>
                )}
              </div>
            ))}
          </div>
        </Reveal>

        {/* Block 04 — What Makes Us Different */}
        <Reveal className="about-block" delay={3}>
          <div className="about-block-label">04 — What Makes Us Different</div>
          <h2 className="section-heading" style={{ marginBottom: "var(--space-5)" }}>
            Why
            <br />
            <span className="highlight">Trivents</span>
          </h2>
          <div className="about-differentiators">
            {DIFFERENTIATORS.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="about-diff-card">
                  <div className="diff-icon">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              );
            })}
          </div>
        </Reveal>

        {/* Block 05 — Vision */}
        <Reveal className="about-block" delay={4}>
          <div className="about-block-label">05 — Vision</div>
          <div className="about-vision">
            <h3>
              A campus where every
              <br />
              moment matters.
            </h3>
            <p>
              We envision a Trinity Institute where every event is an experience,
              every story is told with intention, and every student feels
              connected to something larger than themselves. Trivents is more
              than a club — it&apos;s the creative heartbeat of our community.
            </p>
          </div>
        </Reveal>

        {/* Block 06 — Values */}
        <Reveal className="about-block" delay={5}>
          <div className="about-block-label">06 — Values</div>
          <h2 className="section-heading" style={{ marginBottom: "var(--space-5)" }}>
            What we
            <br />
            <span className="highlight">believe</span>
          </h2>
          <div className="about-values">
            {VALUES.map((value) => (
              <div key={value.title} className="about-value">
                <h4>{value.title}</h4>
                <p>{value.description}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
