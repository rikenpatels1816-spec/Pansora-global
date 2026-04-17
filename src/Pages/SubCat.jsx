import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSubCategories } from "../api/ProductApi";
import styles from "./SubCat.module.css";

const IMAGE_BASE = "https://pansoraglobal.ganeshinfotech.org/Item_Images/SubCategory/";

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
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    async function fetchCategoryName() {
      try {
        const res = await fetch(
          "https://apis.ganeshinfotech.org/api/Home/categories",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({})
          }
        );

        const data = await res.json();

        const categories = Array.isArray(data)
          ? data
          : data?.data || [];

        // 🔥 find matching category
        const matched = categories.find(cat => String(cat.IC_Code) === String(id));

        if (matched) {
          setCategoryName(matched.IC_Name);
        }

      } catch (err) {
        console.error(err);
      }
    }

    fetchCategoryName();
  }, [id]);

  useEffect(() => {
    setLoading(true);
    setError(null);

    getSubCategories(id)
      .then((data) => {
        const list =
          Array.isArray(data) ? data :
            data?.data ? data.data :
              data?.Data ? data.Data :
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
          <span>{categoryName || "Sub Categories"}</span>
        </h1>

        <nav className={styles.breadcrumb}>
          <button onClick={() => navigate("/")}>Home</button>

          <span>›</span>

          <button onClick={() => navigate("/categories")}>
            Categories
          </button>

          <span>›</span>

          <span className={styles.breadcrumbCurrent}>
            {categoryName || "Sub Categories"}
          </span>
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