import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import CategoriesPage from "./Pages/CategoriesPage";
import ProductDetails from "./Pages/ProductDetails";
import SubCat from "./Pages/SubCat";
import Products from "./Pages/Products";
import Header from "./Components/Layout/Header";
import Navbar from "./Components/Layout/Navbar";

ReactDOM.createRoot(document.getElementById("root")).render(
  <>
   <Header />
        <Navbar />
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/categories" element={<CategoriesPage />} />
      <Route path="/productdetails/:id" element={<ProductDetails />} />
      <Route path="/categories/:id" element={<SubCat />} />
      <Route path="/products/:id" element={<Products />} />
    </Routes>
  </BrowserRouter>
  </>
);