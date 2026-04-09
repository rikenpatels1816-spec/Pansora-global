import React from "react";
import { useNavigate } from "react-router-dom";

export default function ContactSnippet() {
  const navigate = useNavigate();
  window.scrollTo(0, 0);

  return (
    <>
      <style>{`
        .cs-section {
          padding: 80px 40px;
          background: #ffffff;
          position: relative;
          overflow: hidden;
          font-family: 'Outfit', sans-serif;
        }
        .cs-section::before {
          content: '';
          position: absolute;
          width: 600px; height: 600px;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          background: radial-gradient(circle, rgba(83,188,213,0.07) 0%, transparent 70%);
          pointer-events: none;
        }
        .cs-inner {
          max-width: 1100px;
          margin: 0 auto;
          position: relative;
          border: 1.5px solid rgba(30,79,165,0.10);
          border-radius: 28px;
          background: linear-gradient(135deg, #f0f7ff 0%, #eef6fb 50%, #f8fbff 100%);
          box-shadow: 0 8px 40px rgba(30,79,165,0.10);
          padding: 64px 72px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          gap: 48px;
          overflow: hidden;
        }
        .cs-inner::before {
          content: '';
          position: absolute;
          width: 320px; height: 320px;
          top: -100px; right: -80px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(83,188,213,0.12) 0%, transparent 70%);
          pointer-events: none;
        }
        .cs-inner::after {
          content: '';
          position: absolute;
          width: 200px; height: 200px;
          bottom: -60px; left: 40px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(30,79,165,0.07) 0%, transparent 70%);
          pointer-events: none;
        }
        .cs-left {
          position: relative;
          z-index: 1;
        }
        .cs-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: 'Outfit', sans-serif;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.26em;
          text-transform: uppercase;
          color: #53BCD5;
          margin-bottom: 16px;
        }
        .cs-eyebrow::before {
          content: '';
          display: block;
          width: 20px; height: 1.5px;
          background: #53BCD5;
          border-radius: 1px;
        }
        .cs-heading {
          font-family: 'Outfit', sans-serif;
          font-size: clamp(26px, 3vw, 38px);
          font-weight: 700;
          color: #0f1c35;
          line-height: 1.18;
          letter-spacing: -0.02em;
          margin: 0 0 0px;
        }
        .cs-heading mark {
          background: linear-gradient(90deg, #1E4FA5, #53BCD5);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-decoration: none;
        }
        .cs-underline {
          display: block;
          width: 48px;
          height: 3px;
          background: linear-gradient(90deg, #1E4FA5, #53BCD5);
          border-radius: 2px;
          margin: 14px 0 20px;
        }
        .cs-body {
          font-size: 15px;
          color: #3d5278;
          line-height: 1.75;
          margin: 0;
        }
        .cs-badges {
          display: flex;
          align-items: center;
          gap: 18px;
          margin-top: 28px;
        }
        .cs-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          color: #3d5278;
          font-family: 'Outfit', sans-serif;
          font-weight: 600;
        }
        .cs-badge-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: linear-gradient(135deg, #1E4FA5, #53BCD5);
          flex-shrink: 0;
        }
        .cs-badge-sep {
          width: 1px; height: 16px;
          background: #000;
        }
        .cs-right {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
          flex-shrink: 0;
          position: relative;
          z-index: 1;
        }
        .cs-btn {
          background: linear-gradient(135deg, #1E4FA5, #2a62c2);
          color: #ffffff;
          border: none;
          border-radius: 100px;
          padding: 16px 40px;
          font-family: 'Outfit', sans-serif;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 0.03em;
          cursor: pointer;
          box-shadow: 0 6px 24px rgba(30,79,165,0.35);
          position: relative;
          overflow: hidden;
          transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s ease, filter 0.2s ease;
          white-space: nowrap;
        }
        .cs-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(255,255,255,0.10);
          opacity: 0;
          transition: opacity 0.2s ease;
        }
        .cs-btn:hover { transform: scale(1.06); filter: brightness(1.10); box-shadow: 0 10px 36px rgba(30,79,165,0.45); }
        .cs-btn:hover::after { opacity: 1; }
        .cs-btn:active { transform: scale(0.97); }
        .cs-note {
          font-family: 'Outfit', sans-serif;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #7a92b4;
        }
        @media (max-width: 780px) {
          .cs-inner { flex-direction: column; padding: 44px 32px; text-align: center; }
          .cs-left { max-width: 100%; }
          .cs-eyebrow, .cs-underline { margin-left: auto; margin-right: auto; }
          .cs-badges { justify-content: center; flex-wrap: wrap; }
        }
      `}</style>

      <section className="cs-section">
        <div className="cs-inner">

          <div className="cs-left">
            <h2 className="cs-heading">
              Let's Grow Your Business <mark>Together</mark>
            </h2>
            <span className="cs-underline" />
            <p className="cs-body">
              Whether you need high-quality products, reliable services, or have
              a custom requirement, our team at <strong>Pansora Global</strong> is here to
              support you every step of the way.
            </p>
            <div className="cs-badges">
              <div className="cs-badge"><span className="cs-badge-dot" />Quick Response</div>
              <div className="cs-badge-sep" />
              <div className="cs-badge"><span className="cs-badge-dot" />Custom Quotes</div>
              <div className="cs-badge-sep" />
              <div className="cs-badge"><span className="cs-badge-dot" />Expert Support</div>
            </div>
          </div>

          <div className="cs-right">
            <button className="cs-btn" onClick={() => navigate("/contact")}>
              Contact Us →
            </button>
          </div>

        </div>
      </section>
    </>
  );
}