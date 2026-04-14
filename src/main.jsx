import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App";
import CategoriesPage from "./Pages/CategoriesPage";
import ProductDetails from "./Pages/ProductDetails";
import SubCat from "./Pages/SubCat";
import Products from "./Pages/Products";
import Header from "./Components/Layout/Header";
import Navbar from "./Components/Layout/Navbar";
import AllProducts from "./Pages/AllProducts";
import ContactUs from "./Pages/ContactUs";
import AboutUs from "./Pages/AboutUs";
import Footer from "./Components/Layout/Footer";

function AppWrapper() {
  const [categoriesData, setCategoriesData] = useState([]);
  const [companyData, setCompanyData] = useState(null);

  useEffect(() => {
    fetchCategories();
    fetchCompany();
  }, []);

  async function fetchCategories() {
    try {
      const res = await fetch("https://apis.ganeshinfotech.org/api/Home/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      const data = await res.json();
      const list = Array.isArray(data) ? data : data?.data || [];
      setCategoriesData(list);
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchCompany() {
  try {
    const res = await fetch(
      "https://apis.ganeshinfotech.org/api/Home/company",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({})
      }
    );

    const data = await res.json();

    console.log("Company API RAW:", data);

    const comp = data?.data?.[0] || {};

    setCompanyData(comp);

  } catch (err) {
    console.error("Company fetch error:", err);
  }
}

  return (
    <BrowserRouter>
      <Header />
      <Navbar />

      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/productdetails/:id" element={<ProductDetails />} />
        <Route path="/categories/:id" element={<SubCat />} />
        <Route path="/products/:id" element={<Products />} />
        <Route path="/products" element={<AllProducts />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/about" element={<AboutUs />} />
      </Routes>
      <Footer categories={categoriesData} company={companyData} />
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <AppWrapper />
);