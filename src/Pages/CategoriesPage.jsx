import React, { useEffect, useState } from "react";
import { getCategories } from "../api/ProductApi";
import "../assets/Css/Common.css";

const IMAGE_BASE = "http://192.168.1.131:3000/Item_Images/Category/";

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

      {categories.length === 0 ? (
        <p>Loading categories...</p>
      ) : (
        <div className="cat-grid">
          {categories.map((cat) => (
            <div key={cat.IC_Code} className="cat-card">
              <h3>{cat.IC_Name}</h3>
              <p>{cat.IC_Desc || "No description available"}</p>

              {cat.IC_Image1 && (
                <img
                  src={`${IMAGE_BASE}${cat.IC_Image1}`}
                  alt={cat.IC_Name}
                  className="cat-img"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;