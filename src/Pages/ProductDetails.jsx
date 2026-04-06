import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./ProductDetails.module.css";
import { getProductById } from "../api/ProductApi";

const IMAGE_BASE = "http://192.168.1.131:88/Item_Images/Item/";

/* ── Loading skeleton ───────────────────────────── */
function LoadingSkeleton() {
  return (
    <div className={styles.loadingPage}>
      <div className={styles.loadingLayout}>
        <div className={styles.skeletonBox} style={{ aspectRatio: "1/1" }} />
        <div className={styles.skeletonLines}>
          <div className={styles.skeletonLine} style={{ width: "30%", height: 10 }} />
          <div className={styles.skeletonLine} style={{ width: "80%", height: 32, marginBottom: 8 }} />
          <div className={styles.skeletonLine} style={{ width: "100%", height: 12 }} />
          <div className={styles.skeletonLine} style={{ width: "90%",  height: 12 }} />
          <div className={styles.skeletonLine} style={{ width: "70%",  height: 12 }} />
          <div className={styles.skeletonLine} style={{ width: 140,    height: 48, borderRadius: 100, marginTop: 12 }} />
        </div>
      </div>
    </div>
  );
}

export default function ProductDetails() {
  const { id }     = useParams();
  const navigate   = useNavigate();

  const [product,   setProduct]   = useState(null);
  const [index,     setIndex]     = useState(0);
  const [animating, setAnimating] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);

  /* ── Fetch ── */
  useEffect(() => {
  if (!id) return;

  async function fetchProduct() {
    try {
      setLoading(true);
      const data = await getProductById(id);
      setProduct(data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch product");
    } finally {
      setLoading(false);
    }
  }

  fetchProduct();
}, [id]);

  const images    = Array.isArray(product?.Item_Images) ? product.Item_Images : [];
  const hasImages = images.length > 0;
  const hasMulti  = images.length > 1;

  const changeSlide = useCallback(
    (nextIndex) => {
      if (animating || images.length === 0) return;
      setAnimating(true);
      setImgLoaded(false);
      setTimeout(() => {
        setIndex(nextIndex);
        setAnimating(false);
      }, 220);
    },
    [animating, images.length]
  );

  const next = () => changeSlide((index + 1) % images.length);
  const prev = () => changeSlide((index - 1 + images.length) % images.length);
  const goTo = (i) => { if (i !== index) changeSlide(i); };

  const currentImage = hasImages ? IMAGE_BASE + images[index] : null;

  if (loading) return <LoadingSkeleton />;

  if (error) {
    return (
      <div className={styles.notFound}>
        <div className={styles.notFoundIcon}>⊟</div>
        <p className={styles.notFoundText}>{error}</p>
        <button className={styles.ctaBtn} style={{ marginTop: 16 }} onClick={() => navigate("/")}>
          Go Home
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className={styles.notFound}>
        <div className={styles.notFoundIcon}>⊟</div>
        <p className={styles.notFoundText}>Product not found</p>
      </div>
    );
  }

  const specs = Array.isArray(product?.Specifications) ? product.Specifications : [];

  /* ── UI ── */
  return (
    <div className={styles.page}>

      {/* Breadcrumb */}
      <nav className={styles.breadcrumb}>
        <button className={styles.breadcrumbLink} onClick={() => navigate("/")}>Home</button>
        <span className={styles.breadcrumbSep}>›</span>
        <button className={styles.breadcrumbLink} onClick={() => navigate("/categories")}>Categories</button>
        <span className={styles.breadcrumbSep}>›</span>
        <button className={styles.breadcrumbLink} onClick={() => navigate(-1)}>Products</button>
        <span className={styles.breadcrumbSep}>›</span>
        <span className={styles.breadcrumbCurrent}>{product?.Itm_Name || id}</span>
      </nav>

      {/* ── Main layout ── */}
      <div className={styles.layout}>

        {/* LEFT — carousel */}
        <div className={styles.leftPanel}>
          <div className={styles.carousel}>

            {/* Shimmer while loading image */}
            {!imgLoaded && <div className={styles.imgSkeleton} />}

            {currentImage ? (
              <img
                key={index}
                src={currentImage}
                alt={product.Itm_Name}
                className={`${styles.mainImage} ${
                  animating ? styles.imageFade : styles.imageVisible
                }`}
                onLoad={() => setImgLoaded(true)}
                onError={() => setImgLoaded(true)}
              />
            ) : (
              <div style={{
                display: "flex", flexDirection: "column",
                alignItems: "center", gap: 8,
                color: "var(--ink-muted)", fontFamily: "var(--font-mono)", fontSize: 12
              }}>
                <span style={{ fontSize: 36, opacity: 0.4 }}>⊟</span>
                <span style={{color: "var(--ink)"}}>No Image</span>
              </div>
            )}

            {/* Arrows — always visible */}
            {hasMulti && (
              <>
                <button className={`${styles.carouselBtn} ${styles.prevBtn}`} onClick={prev}>‹</button>
                <button className={`${styles.carouselBtn} ${styles.nextBtn}`} onClick={next}>›</button>
              </>
            )}

            {/* Dot indicators */}
            {hasMulti && (
              <div className={styles.dots}>
                {images.map((_, i) => (
                  <button
                    key={i}
                    className={`${styles.dot} ${i === index ? styles.dotActive : ""}`}
                    onClick={() => goTo(i)}
                    aria-label={`Image ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {hasMulti && (
            <div className={styles.thumbRow}>
              {images.map((img, i) => (
                <img
                  key={i}
                  src={IMAGE_BASE + img}
                  alt={`Thumbnail ${i + 1}`}
                  className={`${styles.thumb} ${i === index ? styles.activeThumb : ""}`}
                  onClick={() => goTo(i)}
                />
              ))}
            </div>
          )}
        </div>

        {/* RIGHT — details */}
        <div className={styles.rightPanel}>

          {/* SKU badge */}
          <div className={styles.codeBadge}>
            <span>SKU</span>
            <span>#{product?.Itm_Code || id}</span>
          </div>

          {/* Product name */}
          <h1 className={styles.productName}>
            {product?.Itm_Name || "Unnamed Product"}
          </h1>

          <hr className={styles.divider} />

          {/* Description */}
          <div>
            <p className={styles.descLabel}>Description</p>
            <p className={styles.desc}>
              {product?.Itm_Desc || "No description available for this product."}
            </p>
          </div>

          <hr className={styles.divider} />

          {/* CTA */}
          <div className={styles.ctaGroup}>
            <button className={styles.ctaBtn}>Get Quote</button>
            <button className={styles.shareBtn} title="Share">↗</button>
          </div>
        </div>
      </div>

      {/* ── Specifications table ── */}
      {specs.length > 0 && (
        <div className={styles.specSection}>
          <div className={styles.specHeader}>
            <h2 className={styles.specTitle}>Specifications</h2>
            <div className={styles.specLine} />
          </div>

          <table className={styles.specTable}>
            <thead>
              <tr>
                <th>Parameter</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {specs.map((spec, i) => (
                <tr key={i} style={{ "--row-i": i }}>
                  <td>{spec.Itm_Spec_Parameters_Name}</td>
                  <td>{spec.Itm_Spec_Values}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}