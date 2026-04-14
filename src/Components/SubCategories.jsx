import React, { useEffect, useState } from "react";
import { getCategories } from "../api/ProductApi";
import { useNavigate } from "react-router-dom";

const IMAGE_BASE = "https://pansoraglobal.ganeshinfotech.org/Item_Images/Category/";

const bgColors = [
  "#fff9f0","#f0f7ff","#f0fff7","#fffbf0",
  "#fff0f7","#f0f0ff","#f0fbff","#fff0f0"
];

/* ── No-image placeholder ───────────────────────── */
function NoImagePlaceholder({ name }) {
  const initials = name
    ? name.trim().split(/\s+/).slice(0, 2).map((w) => w[0].toUpperCase()).join("")
    : "";

  return (
    <div style={{
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center" ,  gap: 8,
      color: "var(--ink-muted)", fontFamily: "var(--font-mono)", fontSize: 12
    }}>
      <span style={{ fontSize: 36, opacity: 0.4 }}>⊟</span>
      <span style={{ color: "var(--ink)" }}>No Image</span>
    </div>
  );
}

/* ── Skeleton shimmer ───────────────────────────── */
function ImgSkeleton() {
  return <div className="mq-img-skeleton" />;
}

/* ── Card ───────────────────────────────────────── */
const Card = ({ category, index }) => {
  const navigate = useNavigate();
  const [imgLoaded, setImgLoaded]   = useState(false);
  const [imgError,  setImgError]    = useState(false);

  const hasImage = Boolean(category?.IC_Image1) && !imgError;
  const imgSrc   = hasImage ? IMAGE_BASE + category.IC_Image1 : null;

  return (
    <div
      className="mq-card"
      style={{ "--bg": bgColors[index % bgColors.length] }}
      onClick={() => navigate(`/categories/${category.IC_Code}`)}
    >
      <div className="mq-img-wrap">
        {hasImage && !imgLoaded && <ImgSkeleton />}

        {hasImage ? (
          <img
            src={imgSrc}
            alt={category?.IC_Name}
            className={`mq-img ${imgLoaded ? "mq-img-loaded" : ""}`}
            onLoad={() => setImgLoaded(true)}
            onError={() => { setImgError(true); setImgLoaded(true); }}
          />
        ) : (
          <NoImagePlaceholder />
        )}
      </div>

      <div className="mq-info">
        <div className="mq-name">{category?.IC_Name}</div>
      </div>
    </div>
  );
};

/* ── Page ───────────────────────────────────────── */
export default function SubCat() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getCategories().then((data) => {
      setCategories(Array.isArray(data) ? data : []);
    });
  }, []);

  // Duplicate list so marquee loops seamlessly
  const items = [...categories, ...categories];

  return (
    <section className="section">
      <div className="section-label">
        <h2 className="sectionTitle">Categories</h2>
        <button className="see-all-btn" onClick={() => navigate("/categories")}>
          See All →
        </button>
      </div>

      <div className="marquee-wrap">
        <div className="marquee-track">
          {items.map((cat, i) => (
            <Card key={`${cat.IC_Code}-${i}`} category={cat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}