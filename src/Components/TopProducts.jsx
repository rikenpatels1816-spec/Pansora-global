import React, { useEffect, useState } from 'react'
import styles from './TopProducts.module.css'
import { getTopSelling } from '../api/ProductApi'
import { useNavigate } from "react-router-dom";

function ProductCard({ product, rank }) {
  const navigate = useNavigate(); // ✅ ADD THIS

  const [imgLoaded, setImgLoaded] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [index, setIndex] = useState(0)
  const [animating, setAnimating] = useState(false);

  const IMAGE_BASE = "http://192.168.1.131:88/Item_Images/Item/";

  const images = product?.Item_Images || []
  const hasImages = images.length > 0

  const next = (e) => {
    e.stopPropagation(); // ✅ prevent navigation
    setAnimating(true);
    setTimeout(() => {
      setIndex((prev) => (prev + 1) % images.length);
      setAnimating(false);
    }, 200);
  };

  const prev = (e) => {
    e.stopPropagation(); // ✅ prevent navigation
    setAnimating(true);
    setTimeout(() => {
      setIndex((prev) => (prev - 1 + images.length) % images.length);
      setAnimating(false);
    }, 200);
  };

  const currentImage = hasImages
    ? IMAGE_BASE + images[index]
    : "https://via.placeholder.com/200"

  return (
    <div
      className={`${styles.card} ${hovered ? styles.cardHovered : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}

      onClick={() => navigate(`/productdetails/${product.Itm_Code}`)}
      style={{ cursor: "pointer" }}
    >
      {/* Rank */}
      <div className={styles.rankBadge}>
        <span className={styles.rankNum}>#{product.Itm_Code}</span>
      </div>

      {/* IMAGE */}
      <div className={styles.imageWrap}>
        {!imgLoaded && <div className={styles.imgSkeleton} />}

        <img
          src={currentImage}
          alt={product.Itm_Name}
          className={`${styles.image} 
            ${animating ? styles.imageSlide : styles.imageActive}`}
        />

        {/* Buttons */}
        {hasImages && images.length > 1 && (
          <>
            <button className={styles.prevBtn} onClick={prev}>‹</button>
            <button className={styles.nextBtn} onClick={next}>›</button>
          </>
        )}
      </div>

      {/* Content */}
      <div className={styles.content}>
        <h3 className={styles.title}>
          {product?.Itm_Name
            ? product.Itm_Name.length > 50
              ? product.Itm_Name.slice(0, 50) + "..."
              : product.Itm_Name
            : "No Name"}
        </h3>

        <div className={styles.footer}>
          <button
            className={styles.addBtn}
            onClick={(e) => {
              e.stopPropagation(); // ✅ prevent navigation
              console.log("Get Quote clicked");
            }}
          >
            Get Quote
          </button>
        </div>
      </div>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className={styles.skeletonCard}>
      <div className={styles.skeletonImg} />
      <div className={styles.skeletonContent}>
        <div className={styles.skeletonLine} style={{ width: '40%' }} />
        <div className={styles.skeletonLine} style={{ width: '90%' }} />
        <div className={styles.skeletonLine} style={{ width: '70%' }} />
      </div>
    </div>
  )
}

export default function TopProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getTopSelling()
      .then(data => {
        const list = Array.isArray(data) ? data : []
        setProducts(list.slice(0, 8)) // no rating sort now
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.sectionTitle}>Our Top Selling Products</h2>
      </div>

      {error && (
        <div className={styles.error}>
          Failed to load products: {error}
        </div>
      )}

      <div className={styles.grid}>
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          : products.map((product, i) => (
              <ProductCard
                key={product.Itm_Code}
                product={product}
                rank={i + 1}
              />
            ))}
      </div>
    </section>
  )
}