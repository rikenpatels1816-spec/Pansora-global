import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./ProductDetails.module.css";

const IMAGE_BASE = "http://192.168.1.131:88/Item_Images/Item/";

export default function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [loading, setLoading] = useState(true);

  /* 🔥 FETCH PRODUCT */
  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch("http://192.168.1.131:3000/api/Home/Items", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            Itm_Code: id
          })
        });

        const data = await res.json();

        console.log("PRODUCT DETAILS:", data);

        const productData = Array.isArray(data)
          ? data[0]
          : data?.data?.[0] || data;

        setProduct(productData);
        setIndex(0);
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  /* 🔄 LOADING */
  if (loading) {
    return (
      <div style={{ padding: 40 }}>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ padding: 40 }}>
        <p>No product found</p>
      </div>
    );
  }

  /* 🔥 SAFE DATA */
  const images = Array.isArray(product?.Item_Images)
    ? product.Item_Images
    : [];

  const hasImages = images.length > 0;

  /* 🔁 CAROUSEL */
  const next = () => {
    if (!hasImages) return;
    setAnimating(true);
    setTimeout(() => {
      setIndex((prev) => (prev + 1) % images.length);
      setAnimating(false);
    }, 200);
  };

  const prev = () => {
    if (!hasImages) return;
    setAnimating(true);
    setTimeout(() => {
      setIndex((prev) => (prev - 1 + images.length) % images.length);
      setAnimating(false);
    }, 200);
  };

  const currentImage = hasImages
    ? IMAGE_BASE + images[index]
    : "https://via.placeholder.com/400";

  return (
    <div className={styles.container}>
      
      {/* LEFT: IMAGE */}
      <div className={styles.left}>
        <div className={styles.carousel}>
          <img
            src={currentImage}
            alt={product.Itm_Name}
            className={`${styles.mainImage} ${
              animating ? styles.imageFade : ""
            }`}
          />

          {hasImages && images.length > 1 && (
            <>
              <button className={styles.prev} onClick={prev}>‹</button>
              <button className={styles.next} onClick={next}>›</button>
            </>
          )}
        </div>

        {/* THUMBNAILS */}
        {hasImages && (
          <div className={styles.thumbRow}>
            {images.map((img, i) => (
              <img
                key={i}
                src={IMAGE_BASE + img}
                className={`${styles.thumb} ${
                  i === index ? styles.activeThumb : ""
                }`}
                onClick={() => setIndex(i)}
                alt=""
              />
            ))}
          </div>
        )}
      </div>

      {/* RIGHT: DETAILS */}
      <div className={styles.right}>
        <h1>{product?.Itm_Name || "No Name"}</h1>

        <p className={styles.desc}>
          {product?.Itm_Desc || "No description available"}
        </p>

        <button className={styles.cta}>
          Get Quote
        </button>
      </div>

      {/* SPECIFICATIONS */}
      {Array.isArray(product?.Specifications) &&
        product.Specifications.length > 0 && (
          <div className={styles.specSection}>
            <h2>Specifications</h2>

            <table className={styles.table}>
              <tbody>
                {product.Specifications.map((spec, i) => (
                  <tr key={i}>
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