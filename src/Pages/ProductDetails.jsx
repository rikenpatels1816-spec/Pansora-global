import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../api/ProductApi";
import styles from "./ProductDetails.module.css";

const IMAGE_BASE = "http://192.168.1.131:3000/Item_Images/Item/";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    getProductById(id).then(setProduct);
  }, [id]);

  if (!product) return <p style={{ padding: 40 }}>Loading...</p>;

  const images = product.Item_Images || [];

  const next = () => {
    setIndex((prev) => (prev + 1) % images.length);
  };

  const prev = () => {
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className={styles.container}>
      
      {/* LEFT: IMAGE */}
      <div className={styles.left}>
        <div className={styles.carousel}>
          <img
            src={
              images.length
                ? IMAGE_BASE + images[index]
                : "https://via.placeholder.com/400"
            }
            className={styles.mainImage}
            alt={product.Itm_Name}
          />

          {images.length > 1 && (
            <>
              <button className={styles.prev} onClick={prev}>‹</button>
              <button className={styles.next} onClick={next}>›</button>
            </>
          )}
        </div>

        {/* THUMBNAILS */}
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
      </div>

      {/* RIGHT: DETAILS */}
      <div className={styles.right}>
        <h1>{product.Itm_Name}</h1>

        <p className={styles.desc}>
          {product.Itm_Desc}
        </p>

        <button className={styles.cta}>
          Get Quote
        </button>
      </div>

      {/* SPECIFICATIONS */}
      <div className={styles.specSection}>
        <h2>Specifications</h2>

        <table className={styles.table}>
          <tbody>
            {product.Specifications?.map((spec, i) => (
              <tr key={i}>
                <td>{spec.Itm_Spec_Parameters_Name}</td>
                <td>{spec.Itm_Spec_Values}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}