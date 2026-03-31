import React, { useEffect, useState } from 'react'
import styles from './TopProducts.module.css'
import { getProducts } from '../api/ProductApi'

function StarRating({ rate }) {
  return (
    <div className={styles.stars}>
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} viewBox="0 0 20 20" className={styles.star}>
          <defs>
            <linearGradient id={`star-grad-${i}-${rate}`}>
              <stop offset={`${Math.min(1, Math.max(0, rate - i + 1)) * 100}%`} stopColor="#f59e0b" />
              <stop offset={`${Math.min(1, Math.max(0, rate - i + 1)) * 100}%`} stopColor="#d1d5db" />
            </linearGradient>
          </defs>
          <path
            fill={`url(#star-grad-${i}-${rate})`}
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
          />
        </svg>
      ))}
    </div>
  )
}

function ProductCard({ product, rank }) {
  const [imgLoaded, setImgLoaded] = useState(false)
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className={`${styles.card} ${hovered ? styles.cardHovered : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Rank badge */}
      <div className={styles.rankBadge}>
        <span className={styles.rankNum}>#{rank}</span>
      </div>

      {/* Image */}
      <div className={styles.imageWrap}>
        {!imgLoaded && <div className={styles.imgSkeleton} />}
        <img
          src={product.image}
          alt={product.title}
          className={`${styles.image} ${imgLoaded ? styles.imageVisible : ''}`}
          onLoad={() => setImgLoaded(true)}
        />
        <div className={styles.imageOverlay}>
          <button className={styles.quickView}>Quick View</button>
        </div>
      </div>

      {/* Content */}
      <div className={styles.content}>
        <span className={styles.category}>{product.category}</span>
        <h3 className={styles.title}>{product.title}</h3>

        <div className={styles.ratingRow}>
          <StarRating rate={product.rating.rate} />
          <span className={styles.ratingCount}>({product.rating.count})</span>
        </div>

        <div className={styles.footer}>
          <span className={styles.price}>${product.price.toFixed(2)}</span>
          <button className={styles.addBtn}>Add to Cart</button>
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
        <div className={styles.skeletonLine} style={{ width: '40%', height: 12 }} />
        <div className={styles.skeletonLine} style={{ width: '90%', height: 16 }} />
        <div className={styles.skeletonLine} style={{ width: '70%', height: 16 }} />
        <div className={styles.skeletonLine} style={{ width: '30%', height: 20 }} />
      </div>
    </div>
  )
}

export default function TopProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getProducts()
      .then(data => {
        const sorted = [...data]
          .sort((a, b) => b.rating.rate - a.rating.rate)
          .slice(0, 8)
        setProducts(sorted)
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
        <span className={styles.sectionNum}>03 — Products</span>
        <h2 className={styles.sectionTitle}>Top Selling Products</h2>
        <p className={styles.sectionSub}>Ranked by customer rating & popularity</p>
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
              <ProductCard key={product.id} product={product} rank={i + 1} />
            ))}
      </div>
    </section>
  )
}
