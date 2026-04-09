import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSubCategories } from "../api/ProductApi";
import styles from "./SubCat.module.css";

const IMAGE_BASE = "http://103.48.42.115/Pansora_Global/Item_Images/SubCategory/";

/* ── Single subcategory card ────────────────────── */
function SubCatCard({ sub, index, onNavigate }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const imgSrc = sub.ISC_Image1 ? IMAGE_BASE + sub.ISC_Image1 : null;

  return (
    <div
      className={styles.card}
      style={{ "--i": index }}
      onClick={() => onNavigate && onNavigate(sub.ISC_Code)}
    >
      {/* Image */}
      <div className={styles.imageWrap}>
        {imgSrc && !imgLoaded && <div className={styles.skeleton} />}

        {imgSrc ? (
          <img
            src={imgSrc}
            alt={sub.ISC_Name}
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
          <button className={styles.overlayBtn}>View Products →</button>
        </div>
      </div>

      {/* Body */}
      <div className={styles.body}>
        <h3 className={styles.catName}>{sub.ISC_Name}</h3>
        {sub.ISC_Desc && <p className={styles.catDesc}>{sub.ISC_Desc}</p>}

        <div className={styles.catFooter}>
          <span className={styles.arrow}>→</span>
        </div>
      </div>
    </div>
  );
}

/* ── Skeleton placeholder ───────────────────────── */
function SkeletonCard({ index }) {
  return (
    <div className={styles.skeletonCard} style={{ animationDelay: `${index * 70}ms` }}>
      <div className={styles.skeletonImg} />
      <div className={styles.skeletonBody}>
        <div className={styles.skeletonLine} style={{ height: 12, width: "35%" }} />
        <div className={styles.skeletonLine} style={{ height: 18, width: "80%" }} />
        <div className={styles.skeletonLine} style={{ height: 13, width: "60%" }} />
        <div className={styles.skeletonLine} style={{ height: 13, width: "45%", marginTop: 6 }} />
      </div>
    </div>
  );
}

/* ── Page ───────────────────────────────────────── */
export default function SubCat() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    getSubCategories(id)
      .then((data) => {
        const list =
          Array.isArray(data) ? data :
          data?.data          ? data.data :
          data?.Data          ? data.Data :
          [];
        setSubCategories(list);
      })
      .catch((err) => setError(err.message || "Failed to load."))
      .finally(() => setLoading(false));
  }, [id]);

  // Navigate to products page for this subcategory
  const handleCardClick = (subCode) => {
    navigate(`/products/${subCode}`);
  };

  return (
    <div className={styles.page}>

      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.heading}>
          <span>Sub Categories</span>
        </h1>
        <nav className={styles.breadcrumb}>
          <button className={styles.breadcrumbLink} onClick={() => navigate("/")}>
            Home
          </button>
          <span className={styles.breadcrumbSep}>›</span>
          <button className={styles.breadcrumbLink} onClick={() => navigate("/categories")}>
            Categories
          </button>
          <span className={styles.breadcrumbSep}>›</span>
          <span className={styles.breadcrumbCurrent}>Sub Categories</span>
        </nav>
      </header>

      {/* Error */}
      {error && <p className={styles.errorMsg}>{error}</p>}

      {/* Grid */}
      <div className={styles.grid}>
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} index={i} />)
          : subCategories.length === 0
          ? <div className={styles.empty}>No sub-categories found.</div>
          : subCategories.map((sub, i) => (
              <SubCatCard
                key={sub.ISC_Code}
                sub={sub}
                index={i}
                onNavigate={handleCardClick}
              />
            ))
        }
      </div>
    </div>
  );
}