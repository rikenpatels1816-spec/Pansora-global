import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ContactUs.module.css";
import emailjs from "@emailjs/browser";

const BASE_URL = "https://apis.ganeshinfotech.org/api/Home";

export default function ContactUs() {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
   const navigate = useNavigate();

  function getEmbedUrl(link) {
    if (!link) return null;
    // Already an embed URL
    if (link.includes("google.com/maps/embed")) return link;
    // Extract coordinates from @lat,lng or ll=lat,lng
    const coordMatch = link.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/) ||
                       link.match(/ll=(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (coordMatch) {
      return `https://maps.google.com/maps?q=${coordMatch[1]},${coordMatch[2]}&output=embed`;
    }
    // Extract place query from /place/...
    const placeMatch = link.match(/\/place\/([^/@]+)/);
    if (placeMatch) {
      const query = decodeURIComponent(placeMatch[1]).replace(/\+/g, " ");
      return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
    }
    // Fallback: wrap raw URL
    return `https://maps.google.com/maps?q=${encodeURIComponent(link)}&output=embed`;
  }

  useEffect(() => {
    async function fetchCompany() {
      try {
        const res = await fetch(`${BASE_URL}/company`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });
        const data = await res.json();
        const comp = Array.isArray(data) ? data[0] : data?.data?.[0] || data;
        setCompany(comp);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchCompany();
  }, []);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit() {
  if (!form.name || !form.email || !form.message) return;

  const templateParams = {
    name: form.name,
    email: form.email,
    message: form.message,
  };

  emailjs
    .send(
      "service_stl6val",   // 🔁 replace
      "template_22cgse5",  // 🔁 replace
      templateParams,
      "tlcmnqeSwV2JDV6vL"    // 🔁 replace
    )
    .then(
      (response) => {
        console.log("SUCCESS!", response.status, response.text);
        setSubmitted(true);
      },
      (error) => {
        console.log("FAILED...", error);
        alert("Failed to send message ❌");
      }
    );
}

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loadingWrap}>
          <div className={styles.spinnerRing} />
          <p className={styles.loadingText}>Fetching contact details…</p>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className={styles.page}>
        <p className={styles.errorMsg}>No company data found.</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* ── Ambient blobs via CSS pseudo-elements ── */}

      {/* ── Breadcrumb ── */}

      {/* ── Header ── */}
      <header className={styles.header}>
        <h1 className={styles.heading}>
          <span>Contact Us</span>
        </h1>
      <nav className={styles.breadcrumb}>
        <button className={styles.breadcrumbLink} onClick={() => navigate("/")}>Home</button>
        <span className={styles.breadcrumbSep}>›</span>
        <span className={styles.breadcrumbCurrent}>Contact Us</span>
      </nav>
      </header>

      {/* ── Two-column layout ── */}
      <div className={styles.layout}>

        {/* ── Info card ── */}
        <div className={styles.infoCard} style={{ "--i": 0 }}>
          <div className={styles.infoCardTop}>
            <span className={styles.infoIcon}>📍</span>
            <div>
              <p className={styles.infoLabel}>Address</p>
              <p className={styles.infoValue}>{company.Comp_Address}</p>
            </div>
          </div>

          <div className={styles.divider} />

          <div className={styles.infoCardTop}>
            <span className={styles.infoIcon}>✉</span>
            <div>
              <p className={styles.infoLabel}>Email</p>
              <a className={styles.infoLink} href={`mailto:${company.Comp_Email}`}>
                {company.Comp_Email}
              </a>
            </div>
          </div>

          <div className={styles.divider} />

          <div className={styles.infoCardTop}>
            <span className={styles.infoIcon}>📞</span>
            <div>
              <p className={styles.infoLabel}>Phone</p>
              <a className={styles.infoLink} href={`tel:${company.Comp_Contact}`}>
                {company.Comp_Contact}
              </a>
            </div>
          </div>

          {/* ── Map ── */}
          {company.Comp_MapLink && (() => {
            const embedUrl = getEmbedUrl(company.Comp_MapLink);
            return embedUrl ? (
              <div className={styles.mapWrap}>
                <iframe
                  src={embedUrl}
                  width="100%"
                  height="200"
                  className={styles.mapFrame}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                  title="Company location"
                />
              </div>
            ) : null;
          })()}
        </div>

        {/* ── Form card ── */}
        <div className={styles.formCard} style={{ "--i": 1 }}>
          {submitted ? (
            <div className={styles.successState}>
              <div className={styles.successIcon}>✓</div>
              <h2 className={styles.successHeading}>Message sent!</h2>
              <p className={styles.successBody}>
                Thanks for reaching out. We'll get back to you shortly.
              </p>
              <button
                className={styles.resetBtn}
                onClick={() => {
                  setForm({ name: "", email: "", message: "" });
                  setSubmitted(false);
                }}
              >
                Send another
              </button>
            </div>
          ) : (
            <>

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Your Name</label>
                <input
                  className={styles.fieldInput}
                  name="name"
                  placeholder="Your Name"
                  value={form.name}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Email Address</label>
                <input
                  className={styles.fieldInput}
                  name="email"
                  type="email"
                  placeholder="Your Email"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Message</label>
                <textarea
                  className={styles.fieldTextarea}
                  name="message"
                  rows={5}
                  placeholder="Tell us how we can help…"
                  value={form.message}
                  onChange={handleChange}
                />
              </div>

              <button className={styles.submitBtn} onClick={handleSubmit}>
                <span>Send Message</span>
                <span className={styles.submitArrow}>→</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}