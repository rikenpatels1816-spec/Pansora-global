import React, { useEffect, useState } from "react";
import styles from "./AboutUs.module.css";

const BASE_URL = "http://192.168.1.131:3000/api/Home";

const sections = [
  { key: "Description", label: "Who We Are",      icon: "◎", accent: 0 },
  { key: "Mission",     label: "Our Mission",      icon: "⊕", accent: 1 },
  { key: "Vision",      label: "Our Vision",       icon: "◈", accent: 2 },
  { key: "Goal",        label: "Our Goal",         icon: "◇", accent: 3 },
  { key: "Why_Us",      label: "Why Choose Us",    icon: "★", accent: 4 },
];

export default function AboutUs() {
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAbout() {
      try {
        const res = await fetch(`${BASE_URL}/Aboutus`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });
        const data = await res.json();
        const result = Array.isArray(data) ? data[0] : data?.data?.[0] || data;
        setAbout(result);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchAbout();
  }, []);

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loadingWrap}>
          <div className={styles.spinnerRing} />
          <p className={styles.loadingText}>Loading about us…</p>
        </div>
      </div>
    );
  }

  if (!about) {
    return (
      <div className={styles.page}>
        <p className={styles.errorMsg}>No data found.</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* ── Breadcrumb ── */}

      {/* ── Header ── */}
      <header className={styles.header}>
        <h1 className={styles.heading}>
          <span>About Us</span>
        </h1>
      <nav className={styles.breadcrumb}>
        <button className={styles.breadcrumbLink}>Home</button>
        <span className={styles.breadcrumbSep}>›</span>
        <span className={styles.breadcrumbCurrent}>About Us</span>
      </nav>
      </header>

      {/* ── Sections ── */}
      <div className={styles.sectionsWrap}>
        {sections.map((sec, i) => {
          const text = about[sec.key];
          if (!text) return null;
          return (
            <div
              key={sec.key}
              className={`${styles.card} ${styles[`accent${sec.accent}`]}`}
              style={{ "--i": i }}
            >
              <div className={styles.cardLeft}>
                <div className={styles.iconBubble}>{sec.icon}</div>
                <div className={styles.connector} />
              </div>
              <div className={styles.cardBody}>
                <div className={styles.cardEyebrow}>
                  <span className={styles.stepNum}>0{i + 1}</span>
                </div>
                <h2 className={styles.cardTitle}>{sec.label}</h2>
                <p className={styles.cardText}>{text}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}