import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase"; // apna firebase config
import "./AdminPanel.css";

const DashboardHome = () => {
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);

  // 🔹 Real-time fetch total products
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "products"), (snapshot) => {
      setTotalProducts(snapshot.size); // total documents in products
    });

    return () => unsubscribe(); // cleanup
  }, []);

  // 🔹 Real-time fetch total orders
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "orders"), (snapshot) => {
      setTotalOrders(snapshot.size);
      const pending = snapshot.docs.filter(doc => doc.data().status === "pending").length;
      setPendingOrders(pending);
    });

    return () => unsubscribe();
  }, []);

  // 🔹 Real-time fetch total users
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      setTotalUsers(snapshot.size);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="dashboard-home">
      <h1>Welcome to Dawacare Admin Panel</h1>
      <p className="subtitle">Here you can manage products, orders, and users.</p>

      <div className="stats-container">
        <div className="stat-card">
          <h3>Total Products</h3>
          <p>{totalProducts}</p>
        </div>
        <div className="stat-card">
          <h3>Total Orders</h3>
          <p>{totalOrders}</p>
        </div>
        <div className="stat-card">
          <h3>Total Users</h3>
          <p>{totalUsers}</p>
        </div>
        <div className="stat-card">
          <h3>Pending Orders</h3>
          <p>{pendingOrders}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;