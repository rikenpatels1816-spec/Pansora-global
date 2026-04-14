import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AllProducts.module.css";

const BASE_URL   = "https://apis.ganeshinfotech.org/api/Home";
const IMAGE_BASE = "https://pansoraglobal.ganeshinfotech.org/Item_Images/Item/";

/* Truncate to N words */
function truncate(text, wordLimit = 18) {
  if (!text) return "";
  const words = text.trim().split(/\s+/);
  return words.length <= wordLimit
    ? text
    : words.slice(0, wordLimit).join(" ") + "…";
}

/* ── Single product card ────────────────────────── */
function ProductCard({ item, index, onClick }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const imgSrc = item.Item_Images?.[0]
    ? IMAGE_BASE + item.Item_Images[0]
    : null;

  return (
    <div
      className={styles.card}
      style={{ "--i": index }}
      onClick={() => onClick(item.Itm_Code)}
    >
      {/* Image */}
      <div className={styles.imageWrap}>
        {!imgLoaded && imgSrc && <div className={styles.skeleton} />}

        {imgSrc ? (
          <img
            src={imgSrc}
            alt={item.Itm_Name}
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
      </div>

      {/* Body */}
      <div className={styles.body}>
        <h3 className={styles.productName}>{item.Itm_Name || "Unnamed"}</h3>

        {item.Itm_Desc && (
          <p className={styles.productDesc}>{truncate(item.Itm_Desc)}</p>
        )}

        <div className={styles.cardFooter}>
          <span className={styles.codeTag}>#{item.Itm_Code}</span>
          <span className={styles.arrow}>→</span>
        </div>
      </div>
    </div>
  );
}

/* ── Skeleton card ──────────────────────────────── */
function SkeletonCard({ index }) {
  return (
    <div className={styles.skeletonCard} style={{ animationDelay: `${index * 55}ms` }}>
      <div className={styles.skeletonImg} />
      <div className={styles.skeletonBody}>
        <div className={styles.skeletonLine} style={{ height: 14, width: "80%" }} />
        <div className={styles.skeletonLine} style={{ height: 12, width: "100%" }} />
        <div className={styles.skeletonLine} style={{ height: 12, width: "75%" }} />
        <div className={styles.skeletonLine} style={{ height: 12, width: "55%", marginTop: 4 }} />
      </div>
    </div>
  );
}

/* ── Page ───────────────────────────────────────── */
export default function AllProducts() {
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [query,    setQuery]    = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(`${BASE_URL}/Items`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });
        const data = await res.json();
        const list = Array.isArray(data) ? data : data?.data || [];
        setProducts(list);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load products.");
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  /* Live search filter */
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.Itm_Name?.toLowerCase().includes(q) ||
        p.Itm_Code?.toString().includes(q) ||
        p.Itm_Desc?.toLowerCase().includes(q)
    );
  }, [query, products]);

  const handleClick = (code) => navigate(`/productdetails/${code}`);

  return (
    <div className={styles.page}>

      {/* Breadcrumb */}

      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.heading}>
          <span>All Products</span>
        </h1>
      <nav className={styles.breadcrumb}>
        <button className={styles.breadcrumbLink} onClick={() => navigate("/")}>Home</button>
        <span className={styles.breadcrumbSep}>›</span>
        <span className={styles.breadcrumbCurrent}>All Products</span>
      </nav>
      </header>

      {/* Search */}
      {!loading && (
        <div className={styles.searchWrap}>
          <span className={styles.searchIcon}>⌕</span>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Search by name, code or description…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      )}

      {/* Error */}
      {error && <p className={styles.errorMsg}>{error}</p>}

      {/* Grid */}
      <div className={styles.grid}>
        {loading
          ? Array.from({ length: 12 }).map((_, i) => (
              <SkeletonCard key={i} index={i} />
            ))
          : filtered.length === 0
          ? <div className={styles.empty}>No products match your search.</div>
          : filtered.map((item, i) => (
              <ProductCard
                key={item.Itm_Code}
                item={item}
                index={i}
                onClick={handleClick}
              />
            ))
        }
      </div>
    </div>
  );
}