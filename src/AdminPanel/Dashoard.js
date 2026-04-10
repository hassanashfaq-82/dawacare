// src/adminpanel/Dashboard.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./Sidebar";
import DashboardHome from "./DashboardHome";
import Orders from "./Orders";
import Users from "./Users";
import ProductList from "./ProductList";
import AddProduct from "./AddProduct";
import ContentManagement from "./ContentManagement";
import ManageSale from "./ManageSale";
import ManageBrands from "./ManageBrands";
import StockManagement from "./StockManagement";
import BulkAddProduct from "./BulkAddProduct";

const Dashboard = () => {
  return (
    <div className="dashboard-container" style={{ display: "flex" }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="dashboard-content" style={{ flex: 1, padding: "20px" }}>
        <Routes>
          {/* Welcome/Home page */}
          <Route path="/" element={<DashboardHome />} />

          {/* Admin pages */}
          <Route path="orders" element={<Orders />} />
          <Route path="users" element={<Users />} />
          <Route path="ProductList" element={<ProductList />} />
          <Route path="AddProduct" element={<AddProduct />} />
          <Route path="StockManagement" element={<StockManagement />} />
          <Route path="BulkAddProduct" element={<BulkAddProduct />} />
          <Route path="ContentManagement" element={<ContentManagement />} />
          <Route path="ManageSale" element={<ManageSale />} />
          <Route path="ManageBrands" element={<ManageBrands />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;