import React, { useEffect, useState } from 'react'
import styles from './TopProducts.module.css'
import { getTopSelling } from '../api/ProductApi'
import { useNavigate } from "react-router-dom";

function ProductCard({ product, rank }) {
  const navigate = useNavigate();

  const [imgLoaded, setImgLoaded] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [index, setIndex] = useState(0)
  const [animating, setAnimating] = useState(false)
  const [adding, setAdding] = useState(false)   // ✅ FIXED
  const [added, setAdded] = useState(false)     // ✅ USED

  const IMAGE_BASE = "https://pansoraglobal.ganeshinfotech.org/Item_Images/Item/"

  const images = product?.Item_Images || []
  const hasImages = images.length > 0

  const next = (e) => {
    e.stopPropagation()
    setAnimating(true)
    setTimeout(() => {
      setIndex((prev) => (prev + 1) % images.length)
      setAnimating(false)
    }, 200)
  }

  const prev = (e) => {
    e.stopPropagation()
    setAnimating(true)
    setTimeout(() => {
      setIndex((prev) => (prev - 1 + images.length) % images.length)
      setAnimating(false)
    }, 200)
  }

  useEffect(() => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  if (!user) return;

  fetch(`https://apis.ganeshinfotech.org/api/wishlist/GetWishlist/${user.Cust_Code}`)
    .then(res => res.json())
    .then(data => {
      const exists = data?.data?.some(
        item => item.Itm_Code === product.Itm_Code
      );
      setAdded(exists);
    })
    .catch(() => {});
}, [product.Itm_Code]);

  async function handleWishList() {
    if (adding) return;

    const user = JSON.parse(sessionStorage.getItem("user"));

    if (!user || !user.Cust_Code) {
      navigate("/login");
      return;
    }

    try {
      setAdding(true);

      if (added) {
        const res = await fetch(
          `https://apis.ganeshinfotech.org/api/wishlist/RemoveWishList`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              Cust_Code: user.Cust_Code,
              Itm_Code: product?.Itm_Code,
            }),
          }
        );

        const data = await res.json();

        if (data?.success) {
          setAdded(false);
          window.dispatchEvent(new Event("wishlistUpdated"));
        }

      } else {
        // 🤍 ADD TO WISHLIST
        const res = await fetch(
          `https://apis.ganeshinfotech.org/api/wishlist/AddToWishList`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              Cust_Code: user.Cust_Code,
              Itm_Code: product?.Itm_Code,
            }),
          }
        );

        const data = await res.json();

        if (data?.success) {
          setAdded(true);
          window.dispatchEvent(new Event("wishlistUpdated"));
        } else {
          setAdded(true); // already exists case
        }
      }

    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  }

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
          onLoad={() => setImgLoaded(true)} // ✅ FIXED
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
            className={`${styles.heartBtn} ${added ? styles.heartBtnAdded : ''}`}
            onClick={(e) => {
              e.stopPropagation()
              handleWishList()
            }}
            title={added ? "Remove from wishlist" : "Add to wishlist"}
            disabled={adding}
          >
            <svg
              className={styles.heartIcon}
              width="22"
              height="22"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 21C12 21 3 14.5 3 8.5C3 5.42 5.42 3 8.5 3C10.24 3 11.91 3.81 13 5.08C14.09 3.81 15.76 3 17.5 3C20.58 3 23 5.42 23 8.5C23 14.5 12 21 12 21Z"
                className={adding ? styles.heartAdding : added ? styles.heartFilled : styles.heartEmpty}
              />
            </svg>
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
        setProducts(list.slice(0, 8))
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  return (
    <section className={styles.section} id='top-selling'>
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