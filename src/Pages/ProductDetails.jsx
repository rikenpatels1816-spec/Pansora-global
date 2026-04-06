import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./ProductDetails.module.css";

const IMAGE_BASE = "http://192.168.1.131:88/Item_Images/Item/";

function LoadingSkeleton() {
  return <div>Loading...</div>;
}

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ───────── FETCH FIXED ───────── */
  useEffect(() => {
    if (!id) return;

    async function fetchProduct() {
      setLoading(true);
      setError(null);

      try {
        console.log("Fetching ID:", id);

        // ✅ FIX: Send ID in URL (NOT body)
        const res = await fetch(
          `http://192.168.1.131:3000/api/Home/Items?Itm_Code=${id}`
        );

        const data = await res.json();
        console.log("API Response:", data);

        let productData = null;

        if (Array.isArray(data)) {
          productData = data[0];
        } else if (data?.data) {
          productData = Array.isArray(data.data)
            ? data.data[0]
            : data.data;
        } else {
          productData = data;
        }

        if (!productData) {
          setError("Product not found");
        } else {
          setProduct(productData);
        }

        setIndex(0);
        setImgLoaded(false);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch product");
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  /* ───────── CAROUSEL ───────── */
  const images = Array.isArray(product?.Item_Images)
    ? product.Item_Images
    : [];

  const changeSlide = useCallback(
    (getNext) => {
      if (animating || images.length === 0) return;

      setAnimating(true);
      setImgLoaded(false);

      setTimeout(() => {
        setIndex((prev) => getNext(prev));
        setAnimating(false);
      }, 200);
    },
    [animating, images.length]
  );

  const next = () => changeSlide((prev) => (prev + 1) % images.length);
  const prev = () =>
    changeSlide((prev) => (prev - 1 + images.length) % images.length);

  const currentImage =
    images.length > 0 ? IMAGE_BASE + images[index] : null;

  /* ───────── STATES ───────── */
  if (loading) return <LoadingSkeleton />;

  if (error) {
    return (
      <div style={{ padding: 40 }}>
        <h2>{error}</h2>
        <button onClick={() => navigate("/")}>Go Home</button>
      </div>
    );
  }

  if (!product) {
    return <h2>Product not found</h2>;
  }

  const specs = Array.isArray(product?.Specifications)
    ? product.Specifications
    : [];

  /* ───────── UI ───────── */
  return (
    <div className={styles.page}>
      {/* Breadcrumb */}
      <nav>
        <button onClick={() => navigate("/")}>Home</button> ›
        <button onClick={() => navigate(-1)}> Back</button> ›
        <span>{product?.Itm_Name || id}</span>
      </nav>

      <div className={styles.layout}>
        {/* LEFT */}
        <div>
          {currentImage ? (
            <img
              src={currentImage}
              alt={product.Itm_Name}
              style={{ width: 300 }}
              onLoad={() => setImgLoaded(true)}
            />
          ) : (
            <p>No Image</p>
          )}

          {images.length > 1 && (
            <div>
              <button onClick={prev}>Prev</button>
              <button onClick={next}>Next</button>
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div>
          <h1>{product?.Itm_Name || "Unnamed Product"}</h1>

          <p>{product?.Itm_Desc || "No description available"}</p>

          <p>
            <b>SKU:</b> {product?.Itm_Code || id}
          </p>

          <button>Get Quote</button>
        </div>
      </div>

      {/* SPECS */}
      {specs.length > 0 && (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Parameter</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {specs.map((spec, i) => (
              <tr key={i}>
                <td>{spec.Itm_Spec_Parameters_Name}</td>
                <td>{spec.Itm_Spec_Values}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}