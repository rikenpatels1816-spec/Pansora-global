import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductsBySubCategory } from "../api/ProductApi";
import styles from "./Products.module.css";

const IMAGE_BASE = "https://pansoraglobal.ganeshinfotech.org/Item_Images/Item/";

/* Truncate to ~50 words */
function truncateWords(text, wordLimit = 50) {
  if (!text) return "";
  const words = text.trim().split(/\s+/);
  if (words.length <= wordLimit) return text;
  return words.slice(0, wordLimit).join(" ") + "…";
}

function ProductCard({ product, index, onNavigate }) {
  const images     = Array.isArray(product.Item_Images) ? product.Item_Images : [];
  const hasImages  = images.length > 0;
  const hasMulti   = images.length > 1;

  const [imgIndex,  setImgIndex]  = useState(0);
  const [animating, setAnimating] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [expanded,  setExpanded]  = useState(false);

  const desc      = product.Itm_Desc || "";
  const shortDesc = truncateWords(desc, 50);
  const needsMore = desc.trim().split(/\s+/).length > 50;

  /* Carousel helpers */
  const changeSlide = useCallback(
    (getNext) => {
      if (animating || !hasMulti) return;
      setAnimating(true);
      setImgLoaded(false);
      setTimeout(() => {
        setImgIndex(getNext);
        setAnimating(false);
      }, 220);
    },
    [animating, hasMulti]
  );

  const goNext = (e) => {
    e.stopPropagation();
    changeSlide((p) => (p + 1) % images.length);
  };
  const goPrev = (e) => {
    e.stopPropagation();
    changeSlide((p) => (p - 1 + images.length) % images.length);
  };
  const goTo = (e, i) => {
    e.stopPropagation();
    if (i === imgIndex) return;
    changeSlide(() => i);
  };

  const currentSrc = hasImages ? IMAGE_BASE + images[imgIndex] : null;

  /* Read-more toggle — stop propagation so card click doesn't fire */
  const toggleExpand = (e) => {
    e.stopPropagation();
    setExpanded((v) => !v);
  };

  return (
    <div
      className={styles.card}
      style={{ "--i": index }}
      onClick={() => onNavigate(product.Itm_Code)}
    >
      {/* ── Carousel ── */}
      <div className={styles.carousel}>
        {/* Skeleton */}
        {(!imgLoaded || animating) && <div className={styles.skeleton} />}

        {currentSrc ? (
          <img
            key={imgIndex}
            src={currentSrc}
            alt={product.Itm_Name}
            className={`${styles.carouselImg} ${
              animating ? styles.imgFade : imgLoaded ? styles.imgVisible : styles.imgHidden
            }`}
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgLoaded(true)}
          />
        ) : (
          <div className={styles.noImg}>
            <div className={styles.noImgIcon}>⊟</div>
            <span>No image</span>
          </div>
        )}

        {/* Arrows — only when multiple images */}
        {hasMulti && (
          <>
            <button className={`${styles.arrowBtn} ${styles.prevArrow}`} onClick={goPrev}>‹</button>
            <button className={`${styles.arrowBtn} ${styles.nextArrow}`} onClick={goNext}>›</button>
          </>
        )}

        {/* Dots */}
        {hasMulti && (
          <div className={styles.dots}>
            {images.map((_, i) => (
              <button
                key={i}
                className={`${styles.dot} ${i === imgIndex ? styles.dotActive : ""}`}
                onClick={(e) => goTo(e, i)}
                aria-label={`Image ${i + 1}`}
              />
            ))}
          </div>
        )}

      </div>

      {/* ── Body ── */}
      <div className={styles.body}>
        <h3 className={styles.productName}>{product.Itm_Name || "Unnamed Product"}</h3>

        {/* Description with read-more */}
        {desc && (
          <div className={styles.descWrap}>
            <p className={`${styles.desc} ${expanded ? "" : styles.descClamped}`}>
              {expanded ? desc : shortDesc}
            </p>
            {needsMore && (
              <button className={styles.readMoreBtn} onClick={toggleExpand}>
                {expanded ? "Show less" : "Read more"}
                <i className={`${styles.readMoreChevron} ${expanded ? styles.readMoreChevronOpen : ""}`}>
                  ▾
                </i>
              </button>
            )}
          </div>
        )}

        {/* Footer */}
        <div className={styles.cardFooter}>
          <span className={styles.codeTag}>#{product.Itm_Code}</span>
          <span className={styles.arrow}>→</span>
        </div>
      </div>
    </div>
  );
}

/* ── Skeleton card ──────────────────────────────── */
function SkeletonCard({ index }) {
  return (
    <div className={styles.skeletonCard} style={{ animationDelay: `${index * 70}ms` }}>
      <div className={styles.skeletonImg} />
      <div className={styles.skeletonBody}>
        <div className={styles.skeletonLine} style={{ height: 12, width: "35%" }} />
        <div className={styles.skeletonLine} style={{ height: 18, width: "80%" }} />
        <div className={styles.skeletonLine} style={{ height: 13, width: "100%" }} />
        <div className={styles.skeletonLine} style={{ height: 13, width: "85%" }} />
        <div className={styles.skeletonLine} style={{ height: 13, width: "60%" }} />
      </div>
    </div>
  );
}

/* ── Page ───────────────────────────────────────── */
export default function Products() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    getProductsBySubCategory(id)
      .then((data) => {
        const list =
          Array.isArray(data) ? data :
          data?.data          ? data.data :
          data?.Data          ? data.Data :
          [];
        setProducts(list);
      })
      .catch((err) => setError(err.message || "Failed to load."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleCardClick = (itemCode) => {
    navigate(`/productdetails/${itemCode}`);
  };

  return (
    <div className={styles.page}>

      {/* Breadcrumb */}

      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.heading}>
          <span>Products</span>
        </h1>
      <nav className={styles.breadcrumb}>
        <button className={styles.breadcrumbLink} onClick={() => navigate("/")}>Home</button>
        <span className={styles.breadcrumbSep}>›</span>
        <button className={styles.breadcrumbLink} onClick={() => navigate("/categories")}>Categories</button>
        <span className={styles.breadcrumbSep}>›</span>
        <button className={styles.breadcrumbLink} onClick={() => navigate(-1)}>Sub Categories</button>
        <span className={styles.breadcrumbSep}>›</span>
        <span className={styles.breadcrumbCurrent}>Products</span>
      </nav>
      </header>

      {/* Error */}
      {error && <p className={styles.errorMsg}>{error}</p>}

      {/* Grid */}
      <div className={styles.grid}>
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} index={i} />)
          : products.length === 0
          ? <div className={styles.empty}>No products found.</div>
          : products.map((product, i) => (
              <ProductCard
                key={product.Itm_Code}
                product={product}
                index={i}
                onNavigate={handleCardClick}
              />
            ))
        }
      </div>
    </div>
  );
}