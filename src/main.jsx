import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import CategoriesPage from "./Pages/CategoriesPage";
import ProductDetails from "./Pages/ProductDetails";
import SubCat from "./Pages/SubCat";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/categories" element={<CategoriesPage />} />
      <Route path="/productdetails/:id" element={<ProductDetails />} />
      <Route path="/categories/:id" element={<SubCat />} />
    </Routes>
  </BrowserRouter>
);