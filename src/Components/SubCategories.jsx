import React, { useEffect, useState } from "react";
import { getCategories } from "../api/ProductApi";
import { useNavigate } from "react-router-dom";

const IMAGE_BASE = "http://192.168.1.131:88/Item_Images/Category/";

const bgColors = [
  "#fff9f0","#f0f7ff","#f0fff7","#fffbf0",
  "#fff0f7","#f0f0ff","#f0fbff","#fff0f0"
];

const Card = ({ category, index }) => {
  const navigate = useNavigate();

  return (
    <div
      className="mq-card"
      style={{ background: bgColors[index % bgColors.length] }}
      onClick={() => navigate(`/categories/${category.IC_Code}`)} // ✅ NAV
    >
      <div className="mq-img-wrap">
        <img
          src={
            category?.IC_Image1
              ? IMAGE_BASE + category.IC_Image1
              : "https://via.placeholder.com/100"
          }
          alt={category?.IC_Name}
          className="mq-img"
        />
      </div>

      <div>
        <div className="mq-name">{category?.IC_Name}</div>
        <div className="mq-count">Category</div>
      </div>
    </div>
  );
};

export default function SubCat() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  const safeCategories = Array.isArray(categories) ? categories : [];

  return (
    <section className="section">
      <div className="section-label">
        <h2 className="sectionTitle">Categories</h2>

        <button
          className="see-all-btn"
          onClick={() => navigate("/categories")}
        >
          See All →
        </button>
      </div>

      <div className="marquee-wrap">
        <div className="marquee-track">
        {safeCategories.map((cat, i) => (
          <Card key={cat.IC_Code} category={cat} index={i} />
        ))}
      </div>
      </div>
    </section>
  );
}