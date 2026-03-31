import React, { useEffect, useState } from "react";
import { getCategories } from "../api/ProductApi";
import '../assets/Css/Common.css'

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const data = await getCategories();
      setCategories(data);
    }
    fetchData();
  }, []);

  return (
    <div style={{ padding: "40px" }}>
      <h1>All Categories</h1>

      <div className="cat-grid">
        {categories.map((cat, index) => (
          <div key={index} className="cat-card">
            {cat}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage;