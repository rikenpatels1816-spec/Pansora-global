import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation
} from "react-router-dom";

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
import Login from "./auth/Login";
import Profile from "./auth/Profile";

function AppContent({ categoriesData, companyData }) {
  const location = useLocation();

  // 🔥 hide on login
  const hideLayout = location.pathname === "/login";

  return (
    <>
      {!hideLayout && <Header />}
      {!hideLayout && <Navbar />}

      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/productdetails/:id" element={<ProductDetails />} />
        <Route path="/categories/:id" element={<SubCat />} />
        <Route path="/products/:id" element={<Products />} />
        <Route path="/products" element={<AllProducts />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>

      {!hideLayout && (
        <Footer categories={categoriesData} company={companyData} />
      )}
    </>
  );
}

function AppWrapper() {
  const [categoriesData, setCategoriesData] = useState([]);
  const [companyData, setCompanyData] = useState(null);

  useEffect(() => {
    fetchCategories();
    fetchCompany();
  }, []);

  async function fetchCategories() {
    try {
      const res = await fetch(
        "https://apis.ganeshinfotech.org/api/Home/categories",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        }
      );

      const data = await res.json();
      setCategoriesData(data?.data || []);
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
          body: JSON.stringify({}),
        }
      );

      const data = await res.json();
      const comp = data?.data?.[0] || {};
      setCompanyData(comp);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <BrowserRouter>
      <AppContent
        categoriesData={categoriesData}
        companyData={companyData}
      />
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <AppWrapper />
);