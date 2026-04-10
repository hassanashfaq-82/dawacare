// src/AdminPanel/StockManagement.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/firebase";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  writeBatch,
} from "firebase/firestore";
import toast from "../utils/toast";

const PAGE_SIZE_OPTIONS = [5, 15, 25, 50, 100, 200];

function StockManagement() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [updatingId, setUpdatingId] = useState(null);

  // ── Real-time product listener ──────────────────────────────
  useEffect(() => {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        setProducts(list);
      },
      (err) => {
        console.error(err);
        toast.error("Failed to load products");
      }
    );
    return () => unsubscribe();
  }, []);

  // ── Individual stock toggle ─────────────────────────────────
  const setStockStatus = async (productId, isOutOfStock) => {
    setUpdatingId(productId);
    try {
      const productRef = doc(db, "products", productId);
      await writeBatch(db).update(productRef, { isOutOfStock }).commit();
      toast.success(
        isOutOfStock ? "Marked as Out of Stock" : "Marked as In Stock"
      );
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    } finally {
      setUpdatingId(null);
    }
  };





  // ── Derived stats ───────────────────────────────────────────
  const totalCount = products.length;
  const outOfStockCount = products.filter((p) => p.isOutOfStock).length;
  const inStockCount = totalCount - outOfStockCount;



  // ── Filter by search ────────────────────────────────────────
  const filtered = products.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  // ── Reset page when search changes ─────────────────────────
  useEffect(() => {
    setCurrentPage(1);
  }, [search, pageSize]);

  // ── Pagination ──────────────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="stock-management-page">
      <div className="stock-title-row">
        <h1 className="stock-title">Stock Management</h1>
        <button
          className="bulk-add-data-btn"
          onClick={() => navigate("../BulkAddProduct")}
        >
          <i className="fa-solid fa-layer-group"></i> Add Bulk Data
        </button>
      </div>

      {/* ── Summary Cards ── */}
      <div className="stock-stats-grid">
        <div className="stock-stat-card total">
          <div className="stock-stat-label">Total Medicines</div>
          <div className="stock-stat-value">{totalCount}</div>
        </div>
        <div className="stock-stat-card in-stock">
          <div className="stock-stat-label">In Stock</div>
          <div className="stock-stat-value">{inStockCount}</div>
        </div>
        <div className="stock-stat-card out-of-stock">
          <div className="stock-stat-label">Out of Stock</div>
          <div className="stock-stat-value">{outOfStockCount}</div>
        </div>
      </div>



      {/* ── Search ── */}
      <div className="stock-search-bar">
        <input
          type="text"
          className="stock-search-input"
          placeholder="Search medicine by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button
            className="stock-clear-search"
            onClick={() => setSearch("")}
          >
            ✕
          </button>
        )}
      </div>

      {/* ── Table ── */}
      <div className="table-scroll-wrapper">
        <table className="products-table stock-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Medicine Name</th>
              <th>Type</th>
              <th>Brand</th>
              <th>Price</th>
              <th>Stock Qty</th>
              <th>Stock Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan="8" className="no-results">
                  {search ? "No medicines match your search." : "No medicines found."}
                </td>
              </tr>
            ) : (
              paginated.map((product) => (
                <tr
                  key={product.id}
                  className={product.isOutOfStock ? "stock-row-out" : ""}
                >
                  <td>
                    <img
                      src={product.picture}
                      alt={product.name}
                      className="product-thumb"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/42";
                      }}
                    />
                  </td>
                  <td data-label="Medicine Name" className="product-name-cell">
                    {product.name}
                  </td>
                  <td data-label="Type">{product.type || "—"}</td>
                  <td data-label="Brand">{product.manufacturedBy || "—"}</td>
                  <td data-label="Price">₨{product.price || "—"}</td>
                  <td data-label="Stock Qty">
                    <span className="stock-qty-chip">
                      {typeof product.stockQuantity === "number"
                        ? product.stockQuantity
                        : 0}
                    </span>
                  </td>
                  <td data-label="Stock Status">
                    <span
                      className={`stock-badge ${product.isOutOfStock
                          ? "stock-badge-out"
                          : "stock-badge-in"
                        }`}
                    >
                      {product.isOutOfStock ? "Out of Stock" : "In Stock"}
                    </span>
                  </td>
                  <td data-label="Actions">
                    <div className="stock-action-btns">
                      <button
                        className="stock-btn stock-btn-in"
                        disabled={!product.isOutOfStock || updatingId === product.id}
                        onClick={() => setStockStatus(product.id, false)}
                      >
                        {updatingId === product.id && !product.isOutOfStock ? "..." : "In Stock"}
                      </button>
                      <button
                        className="stock-btn stock-btn-out"
                        disabled={product.isOutOfStock || updatingId === product.id}
                        onClick={() => setStockStatus(product.id, true)}
                      >
                        {updatingId === product.id && product.isOutOfStock ? "..." : "Out of Stock"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ── */}
      {filtered.length > 0 && (
        <div className="pagination-bar">
          <div className="pagination-info">
            Showing{" "}
            {Math.min((currentPage - 1) * pageSize + 1, filtered.length)}–
            {Math.min(currentPage * pageSize, filtered.length)} of{" "}
            {filtered.length}
          </div>
          <div className="pagination-controls">
            <button
              className="page-btn"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              «
            </button>
            <button
              className="page-btn"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              ‹
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (p) =>
                  p === 1 ||
                  p === totalPages ||
                  Math.abs(p - currentPage) <= 1
              )
              .reduce((acc, p, idx, arr) => {
                if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
                acc.push(p);
                return acc;
              }, [])
              .map((item, i) =>
                item === "..." ? (
                  <span key={`ellipsis-${i}`} className="page-ellipsis">
                    …
                  </span>
                ) : (
                  <button
                    key={item}
                    className={`page-btn${currentPage === item ? " active" : ""
                      }`}
                    onClick={() => setCurrentPage(item)}
                  >
                    {item}
                  </button>
                )
              )}
            <button
              className="page-btn"
              onClick={() =>
                setCurrentPage((p) => Math.min(totalPages, p + 1))
              }
              disabled={currentPage === totalPages}
            >
              ›
            </button>
            <button
              className="page-btn"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              »
            </button>
          </div>
          <div className="pagination-size">
            <label>Rows per page:</label>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              {PAGE_SIZE_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}

export default StockManagement;
