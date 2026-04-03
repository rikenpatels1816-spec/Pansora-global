import React, { useEffect, useState } from "react";
import { getCategories } from "../api/ProductApi";
import styles from "./CategoriesPage.module.css";

const IMAGE_BASE = "http://192.168.1.131:88/Item_Images/Category/";

/* ── Single category card ───────────────────────── */
function CategoryCard({ cat, index }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const hasImage = Boolean(cat.IC_Image1);

  return (
    <div
      className={styles.card}
      style={{ "--i": index }}
    >
      <div className={styles.imageWrap}>
        {hasImage && !imgLoaded && <div className={styles.skeleton} />}

        {hasImage ? (
          <img
            src={`${IMAGE_BASE}${cat.IC_Image1}`}
            alt={cat.IC_Name}
            className={`${styles.img} ${imgLoaded ? styles.imgLoaded : ""}`}
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgLoaded(true)}
          />
        ) : (
          <div className={styles.noImg}>
            <div className={styles.noImgIcon}>⊟</div>
            <span>No image</span>
          </div>
        )}

        <div className={styles.overlay}>
          <button className={styles.overlayBtn}>Browse Products →</button>
        </div>
      </div>

      <div className={styles.body}>
        <h3 className={styles.catName}>{cat.IC_Name}</h3>

        {cat.IC_Desc && (
          <p className={styles.catDesc}>{cat.IC_Desc}</p>
        )}
      </div>
    </div>
  );
}

function SkeletonCard({ index }) {
  return (
    <div
      className={styles.skeletonCard}
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <div className={styles.skeletonImg} />
      <div className={styles.skeletonBody}>
        <div className={styles.skeletonLine} style={{ height: 12, width: "35%" }} />
        <div className={styles.skeletonLine} style={{ height: 18, width: "80%" }} />
        <div className={styles.skeletonLine} style={{ height: 13, width: "60%" }} />
        <div
          className={styles.skeletonLine}
          style={{ height: 13, width: "45%", marginTop: 6 }}
        />
      </div>
    </div>
  );
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getCategories();
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h2 className={styles.sectionTitle}>All Categories</h2>
      </header>

      {error && (
        <p style={{ textAlign: "center", color: "#e8394b", marginBottom: 32 }}>
          Failed to load categories: {error}
        </p>
      )}

      <div className={styles.grid}>
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} index={i} />
            ))
          : categories.length === 0
          ? (
            <div className={styles.empty}>No categories found.</div>
          )
          : categories.map((cat, i) => (
              <CategoryCard key={cat.IC_Code} cat={cat} index={i} />
            ))
        }
      </div>
    </div>
  );
}