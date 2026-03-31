import React, { useEffect, useState } from "react";
import { getCategories } from "../api/ProductApi";
import { useNavigate } from "react-router-dom";

const icons = ["🎨","⚡","🌿","📈","🎬","🤖","✈️","🚀"];

const bgColors = [
  '#fff9f0','#f0f7ff','#f0fff7','#fffbf0',
  '#fff0f7','#f0f0ff','#f0fbff','#fff0f0'
];

const Card = ({ name, index }) => (
  <div
    className="mq-card"
    style={{ background: bgColors[index % bgColors.length] }}
  >
    <div className="mq-icon">{icons[index % icons.length]}</div>
    <div>
      <div className="mq-name">{name}</div>
      <div className="mq-count">Category</div>
    </div>
  </div>
);

export default function Marquee() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate(); // ✅ FIXED

  useEffect(() => {
    async function fetchData() {
      const data = await getCategories();
      setCategories(data);
    }
    fetchData();
  }, []);

  const row1 = [...categories, ...categories];
  const row2 = [...categories.slice(2), ...categories, ...categories.slice(0,2)];

  return (
    <section className="section" id="type2">
      <div className="section-label">
        <h2 className="section-title">Categories</h2>
        <p className="section-sub">
          Live data from API — infinite scroll
        </p>

        <button
          className="see-all-btn"
          onClick={() => navigate("/categories")}
        >
          See All →
        </button>
      </div>

      <div className="marquee-wrap">
        <div className="marquee-track">
          {row1.map((cat, i) => (
            <Card key={i} name={cat} index={i} />
          ))}
        </div>
      </div>

      <div className="marquee-wrap">
        <div className="marquee-track2">
          {row2.map((cat, i) => (
            <Card key={i} name={cat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}