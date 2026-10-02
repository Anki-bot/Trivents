"use client";

import { AtSign, MessageCircle, ArrowUp } from "lucide-react";

const FOOTER_NAV = [
  { label: "Home", href: "#home" },
  { label: "Why Us", href: "#why-us" },
  { label: "Gallery", href: "#gallery" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const SOCIAL_LINKS = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/trivent_s/",
    icon: AtSign,
  },
  {
    label: "WhatsApp",
    href: "https://chat.whatsapp.com/Dw7lBTsE9RX5DPQDp7cRUz",
    icon: MessageCircle,
  },
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <a href="#home" className="footer-logo">
              <img src="/images/logo.png"/>
              <span className="footer-logo-text">Trivents</span>
            </a>
            <p className="footer-tagline">
              The social media and event creative club of Trinity Institute.
              Building stories, moments, and digital experiences.
            </p>
            <div className="footer-social">
              {SOCIAL_LINKS.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Navigation */}
          <div className="footer-column">
            <h4>Navigate</h4>
            <ul>
              {FOOTER_NAV.map((link) => (
                <li key={link.href}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-column">
            <h4>Contact</h4>
            <ul>
              <li>
                <a href="mailto:creative.trivents@gmail.com">creative.trivents@gmail.com</a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/trivent_s/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://chat.whatsapp.com/Dw7lBTsE9RX5DPQDp7cRUz"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp Community
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="footer-column">
            <h4>Legal</h4>
            <ul>
              <li>
                <a href="#home">Privacy Policy</a>
              </li>
              <li>
                <a href="#home">Terms of Use</a>
              </li>
              <li>
                <a href="#home">Cookie Policy</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Trivents. All rights reserved.</p>
          <div className="footer-legal">
            <a href="#home">Privacy</a>
            <a href="#home">Terms</a>
            <button
              onClick={scrollToTop}
              style={{
                background: "none",
                border: "none",
                color: "var(--text-subtle)",
                cursor: "pointer",
                fontSize: "11px",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                padding: 0,
              }}
            >
              Back to top
              <ArrowUp className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
