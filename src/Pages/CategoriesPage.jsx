import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCategories, getSubCategories } from "../api/ProductApi";
import styles from "./CategoriesPage.module.css";

const IMAGE_BASE_CAT = "https://pansoraglobal.ganeshinfotech.org/Item_Images/Category/";
const IMAGE_BASE_SUB = "https://pansoraglobal.ganeshinfotech.org/Item_Images/SubCategory/";

/* ── Single item card ───────────────────────────── */
function ItemCard({ item, index, isSubCat, onClick }) {
  const [imgLoaded, setImgLoaded] = useState(false);

  const name    = isSubCat ? item.ISC_Name  : item.IC_Name;
  const desc    = isSubCat ? item.ISC_Desc  : item.IC_Desc;
  const code    = isSubCat ? item.ISC_Code  : item.IC_Code;
  const rawImg  = isSubCat ? item.ISC_Image1 : item.IC_Image1;
  const imgSrc  = rawImg
    ? (isSubCat ? IMAGE_BASE_SUB : IMAGE_BASE_CAT) + rawImg
    : null;

  return (
    <div
      className={styles.card}
      style={{ "--i": index }}
      onClick={() => onClick && onClick(code)}
    >
      {/* Image */}
      <div className={styles.imageWrap}>
        {imgSrc && !imgLoaded && <div className={styles.skeleton} />}

        {imgSrc ? (
          <img
            src={imgSrc}
            alt={name}
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
          <button className={styles.overlayBtn}>
            {isSubCat ? "View Products →" : "Browse →"}
          </button>
        </div>
      </div>

      {/* Body */}
      <div className={styles.body}>
        <h3 className={styles.catName}>{name}</h3>
        {desc && <p className={styles.catDesc}>{desc}</p>}

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
export default function CategoryPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const isSubCat = Boolean(id);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const res = isSubCat
          ? await getSubCategories(id)
          : await getCategories();

        const list =
          Array.isArray(res)  ? res :
          res?.data           ? res.data :
          res?.Data           ? res.Data :
          [];

        setData(list);
      } catch (err) {
        console.error(err);
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  // Navigate into a category → subcategory page
  const handleCardClick = (code) => {
    if (!isSubCat) {
      navigate(`/categories/${code}`);
    }
    // If already in subcategory, you could navigate to products here
  };

  return (
    <div className={styles.page}>

      {/* Breadcrumb */}

      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.heading}>
          <span>{isSubCat ? "Sub Categories" : "Categories"}</span>
        </h1> 
      <nav className={styles.breadcrumb}>
        <button className={styles.breadcrumbLink} onClick={() => navigate("/")}>
          Home
        </button>
        <span className={styles.breadcrumbSep}>›</span>
        {isSubCat ? (
          <>
            <button className={styles.breadcrumbLink} onClick={() => navigate("/categories")}>
              Categories
            </button>
            <span className={styles.breadcrumbSep}>›</span>
            <span className={styles.breadcrumbCurrent}>Sub Categories</span>
          </>
        ) : (
          <span className={styles.breadcrumbCurrent}>Categories</span>
        )}
      </nav>
      </header>

      {/* Error */}
      {error && (
        <p className={styles.errorMsg}>Failed to load: {error}</p>
      )}

      {/* Grid */}
      <div className={styles.grid}>
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} index={i} />)
          : data.length === 0
          ? <div className={styles.empty}>No items found.</div>
          : data.map((item, i) => (
              <ItemCard
                key={isSubCat ? item.ISC_Code : item.IC_Code}
                item={item}
                index={i}
                isSubCat={isSubCat}
                onClick={handleCardClick}
              />
            ))
        }
      </div>
    </div>
  );
}