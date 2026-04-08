import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Footer.module.css";
import logo from "../../assets/Images/logo2.png";

const quickLinks = [
  { label: "About Us",   path: "/about" },
  { label: "Products",   path: "/categories" },
  { label: "Contact Us", path: "/contact" },
];

const socials = [
  {
    label: "Facebook",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "Twitter/X",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
        <path d="M4 4l16 16M20 4 4 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
];



export default function Footer({ categories = [], company }) {
  const navigate = useNavigate();
  const safeCompany = company || {};

  return (
    <footer className={styles.footer}>
      {/* ── Top wave decoration ── */}
      <div className={styles.waveTop}>
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,30 C360,60 1080,0 1440,30 L1440,0 L0,0 Z" fill="white" />
        </svg>
      </div>

      <div className={styles.inner}>
        {/* ── Col 1: Brand ── */}
        <div className={styles.brandCol}>
          <img src={logo} alt="logo" className={styles.logo} />
          <p className={styles.tagline}>
            We provide high quality products with reliability and trust.
            Your satisfaction is our priority.
          </p>
          {/* Social icons */}
          <div className={styles.socials}>
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className={styles.socialBtn}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* ── Col 2: Quick Links ── */}
        <div className={styles.col}>
          <h4 className={styles.colHeading}>
            <span className={styles.colHeadingLine} />
            Quick Links
          </h4>
          <ul className={styles.linkList}>
            {quickLinks.map((l) => (
              <li key={l.path}>
                <button
                  className={styles.linkBtn}
                  onClick={() => navigate(l.path)}
                >
                  <span className={styles.linkArrow}>›</span>
                  {l.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Col 3: Categories ── */}
        <div className={styles.col}>
          <h4 className={styles.colHeading}>
            <span className={styles.colHeadingLine} />
            Categories
          </h4>
          <ul className={styles.linkList}>
            {categories.length > 0 ? (
              categories.map((cat) => (
                <li key={cat.IC_Code}>
                  <button
                    className={styles.linkBtn}
                    onClick={() => navigate(`/categories/${cat.IC_Code}`)}
                  >
                    <span className={styles.linkArrow}>›</span>
                    {cat.IC_Name}
                  </button>
                </li>
              ))
            ) : (
              <li className={styles.loadingDots}>
                <span /><span /><span />
              </li>
            )}
          </ul>
        </div>

        {/* ── Col 4: Contact ── */}
        <div className={styles.col}>
          <h4 className={styles.colHeading}>
            <span className={styles.colHeadingLine} />
            Contact Us
          </h4>
          <ul className={styles.contactList}>
            <li className={styles.contactItem}>
              <span className={styles.contactIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </span>
              <span className={styles.contactText}>
                {safeCompany.Comp_Address || "Address not available"}
              </span>
            </li>
            <li className={styles.contactItem}>
              <span className={styles.contactIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </span>
              <a
                href={`mailto:${safeCompany.Comp_Email || ""}`}
                className={styles.contactLink}
              >
                {safeCompany.Comp_Email || "email@example.com"}
              </a>
            </li>
            <li className={styles.contactItem}>
              <span className={styles.contactIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.18 6.18l.95-.94a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </span>
              <a
                href={`tel:${safeCompany.Comp_Contact || ""}`}
                className={styles.contactLink}
              >
                {safeCompany.Comp_Contact || "0000000000"}
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className={styles.bottomBar}>
        <div className={styles.bottomInner}>
          <span>© {new Date().getFullYear()} Pansora Global. All rights reserved.</span>
          <span className={styles.bottomDivider}>·</span>
          <span className={styles.bottomSub}>Made with care</span>
        </div>
      </div>
    </footer>
  );
}