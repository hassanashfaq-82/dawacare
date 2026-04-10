// src/AdminPanel/BulkAddProduct.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/firebase";
import { collection, addDoc } from "firebase/firestore";
import toast from "../utils/toast";
import { useSale } from "../contexts/SaleContext";

const nameOptions = [
  "Panadol Tablets 500mg", "Vitamin C 1000mg", "Glutamax Capsules",
  "Arinac Forte 400/60mg", "Ibuprofen 200mg"
];
const manufacturedByOptions = ["Pfizer", "GSK", "Abbott", "Sanofi", "Novartis"];
const typeOptions = ["Tablet", "Capsule", "Syrup", "Injection", "Cream", "Drops", "Sachet", "Inhaler"];
const pictureOptions = [
  "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=500",
  "https://images.unsplash.com/photo-1585435557343-3b092031a831?w=500",
  "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=500",
  "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=500"
];
const descriptionOptions = [
  "Pain relief tablets", "Vitamin supplement",
  "Joint support capsules", "Anti-inflammatory medication"
];
const usageOptions = [
  "Take 1 tablet daily", "Take 2 capsules after meals",
  "Apply topically twice a day", "Take with water"
];

const emptyProduct = () => ({
  name: "",
  formula: "",
  type: "",
  price: "",
  retailPrice: "",
  quantityPerPack: "",
  manufacturedBy: "",
  picture: "",
  description: "",
  usage: "",
  stockQuantity: "",
});

function BulkAddProduct() {
  const navigate = useNavigate();
  const { discountLabel } = useSale();
  const [products, setProducts] = useState([emptyProduct()]);
  const [loading, setLoading] = useState(false);
  const [submittedCount, setSubmittedCount] = useState(0);

  const updateField = (index, field, value) => {
    setProducts((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addNewRow = () => {
    setProducts((prev) => [...prev, emptyProduct()]);
  };

  const removeRow = (index) => {
    if (products.length === 1) return; // keep at least one
    setProducts((prev) => prev.filter((_, i) => i !== index));
  };

  const isRowValid = (p) =>
    p.name.trim() !== "" && p.price !== "" && p.picture.trim() !== "";

  const allValid = products.every(isRowValid);

  const handleSubmitAll = async () => {
    if (!allValid) {
      toast.error("Each product requires Name, Price, and Image URL.");
      return;
    }
    setLoading(true);
    setSubmittedCount(0);
    let successCount = 0;
    let failCount = 0;

    // Add all products concurrently for real-time sync
    const promises = products.map(async (p) => {
      try {
        await addDoc(collection(db, "products"), {
          name: p.name,
          formula: p.formula,
          type: p.type,
          price: parseFloat(p.price),
          retailPrice: parseFloat(p.retailPrice) || 0,
          quantityPerPack: p.quantityPerPack ? parseInt(p.quantityPerPack, 10) : 0,
          manufacturedBy: p.manufacturedBy,
          picture: p.picture,
          discounts: discountLabel,
          description: p.description,
          usage: p.usage,
          stockQuantity: p.stockQuantity ? parseInt(p.stockQuantity, 10) : 0,
          createdAt: new Date(),
        });
        successCount++;
        setSubmittedCount((c) => c + 1);
      } catch (err) {
        console.error("Failed to add:", p.name, err);
        failCount++;
      }
    });

    await Promise.all(promises);
    setLoading(false);

    if (failCount === 0) {
      toast.success(`${successCount} product${successCount !== 1 ? "s" : ""} added successfully!`);
      navigate(-1);
    } else {
      toast.error(`${successCount} added, ${failCount} failed. Check console for details.`);
    }
  };

  return (
    <div className="bulk-add-page">
      {/* ── Header ── */}
      <div className="bulk-add-header">
        <div className="bulk-add-title-row">
          <button
            className="bulk-back-btn"
            onClick={() => navigate(-1)}
            title="Back to Stock Management"
          >
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <div>
            <h1 className="bulk-add-title">Bulk Add Products</h1>
            <p className="bulk-add-subtitle">
              Add multiple products at once. All will be synced to Firebase in real-time.
            </p>
          </div>
        </div>
        <div className="bulk-add-actions">
          <span className="bulk-count-badge">{products.length} product{products.length !== 1 ? "s" : ""}</span>
          <button className="bulk-add-row-btn" onClick={addNewRow} disabled={loading}>
            <i className="fa-solid fa-plus"></i> Add Another Product
          </button>
          <button
            className="bulk-submit-btn"
            onClick={handleSubmitAll}
            disabled={loading || !allValid}
          >
            {loading
              ? <><i className="fa-solid fa-spinner fa-spin"></i> Submitting {submittedCount}/{products.length}...</>
              : <><i className="fa-solid fa-cloud-arrow-up"></i> Submit All ({products.length})</>
            }
          </button>
        </div>
      </div>

      {/* ── Product Forms ── */}
      <div className="bulk-forms-list">
        {products.map((product, index) => (
          <div key={index} className={`bulk-product-card ${!isRowValid(product) && product.name !== "" ? "bulk-card-invalid" : ""}`}>
            <div className="bulk-card-header">
              <span className="bulk-card-number">Product #{index + 1}</span>
              {isRowValid(product) && (
                <span className="bulk-card-valid-badge">
                  <i className="fa-solid fa-circle-check"></i> Ready
                </span>
              )}
              {products.length > 1 && (
                <button
                  className="bulk-remove-btn"
                  onClick={() => removeRow(index)}
                  disabled={loading}
                  title="Remove this product"
                >
                  <i className="fa-solid fa-trash"></i> Remove
                </button>
              )}
            </div>

            <div className="bulk-form-grid">
              {/* Name */}
              <div className="form-group">
                <label>Product Name *</label>
                <input
                  type="text"
                  value={product.name}
                  onChange={(e) => updateField(index, "name", e.target.value)}
                  list={`bulk-nameOptions-${index}`}
                  placeholder="Enter product name"
                />
                <datalist id={`bulk-nameOptions-${index}`}>
                  {nameOptions.map((n, i) => <option key={i} value={n} />)}
                </datalist>
              </div>

              {/* Formula */}
              <div className="form-group">
                <label>Formula</label>
                <input
                  type="text"
                  value={product.formula}
                  onChange={(e) => updateField(index, "formula", e.target.value)}
                  placeholder="e.g. Paracetamol 500mg"
                />
              </div>

              {/* Type */}
              <div className="form-group">
                <label>Type</label>
                <input
                  type="text"
                  value={product.type}
                  onChange={(e) => updateField(index, "type", e.target.value)}
                  list={`bulk-typeOptions-${index}`}
                  placeholder="e.g. Tablet, Syrup, Capsule"
                />
                <datalist id={`bulk-typeOptions-${index}`}>
                  {typeOptions.map((t, i) => <option key={i} value={t} />)}
                </datalist>
              </div>

              {/* Price */}
              <div className="form-group">
                <label>Price (Selling Price) *</label>
                <input
                  type="number"
                  value={product.price}
                  onChange={(e) => updateField(index, "price", e.target.value)}
                  placeholder="Enter selling price"
                  min="0"
                />
              </div>

              {/* Retail Price */}
              <div className="form-group">
                <label>Retail Price (Original Price)</label>
                <input
                  type="number"
                  value={product.retailPrice}
                  onChange={(e) => updateField(index, "retailPrice", e.target.value)}
                  placeholder="Enter original/retail price"
                  min="0"
                />
              </div>

              {/* Quantity Per Pack */}
              <div className="form-group">
                <label>Quantity (Tabs/Pack)</label>
                <input
                  type="number"
                  value={product.quantityPerPack}
                  onChange={(e) => updateField(index, "quantityPerPack", e.target.value)}
                  placeholder="e.g. 10, 20, 100"
                  min="0"
                />
              </div>

              {/* Manufactured By */}
              <div className="form-group">
                <label>Manufactured By</label>
                <input
                  type="text"
                  value={product.manufacturedBy}
                  onChange={(e) => updateField(index, "manufacturedBy", e.target.value)}
                  list={`bulk-brandOptions-${index}`}
                  placeholder="Manufacturer / brand name"
                />
                <datalist id={`bulk-brandOptions-${index}`}>
                  {manufacturedByOptions.map((b, i) => <option key={i} value={b} />)}
                </datalist>
              </div>

              {/* Stock Quantity */}
              <div className="form-group">
                <label>Stock Quantity</label>
                <input
                  type="number"
                  value={product.stockQuantity}
                  onChange={(e) => updateField(index, "stockQuantity", e.target.value)}
                  placeholder="Initial stock count (e.g. 50)"
                  min="0"
                />
              </div>

              {/* Image URL — full width */}
              <div className="form-group bulk-full-width">
                <label>Product Image URL *</label>
                <input
                  type="text"
                  value={product.picture}
                  onChange={(e) => updateField(index, "picture", e.target.value)}
                  list={`bulk-pictureOptions-${index}`}
                  placeholder="Paste image link here"
                />
                <datalist id={`bulk-pictureOptions-${index}`}>
                  {pictureOptions.map((u, i) => <option key={i} value={u} />)}
                </datalist>
                {product.picture && (
                  <img
                    src={product.picture}
                    alt="Preview"
                    className="product-thumb"
                    style={{ marginTop: "8px", width: "72px", height: "72px", objectFit: "cover", borderRadius: "6px" }}
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                )}
              </div>

              {/* Description — full width */}
              <div className="form-group bulk-full-width">
                <label>Description</label>
                <input
                  type="text"
                  value={product.description}
                  onChange={(e) => updateField(index, "description", e.target.value)}
                  list={`bulk-descOptions-${index}`}
                  placeholder="Brief description about the medicine"
                />
                <datalist id={`bulk-descOptions-${index}`}>
                  {descriptionOptions.map((d, i) => <option key={i} value={d} />)}
                </datalist>
              </div>

              {/* Usage — full width */}
              <div className="form-group bulk-full-width">
                <label>Usage Instructions</label>
                <input
                  type="text"
                  value={product.usage}
                  onChange={(e) => updateField(index, "usage", e.target.value)}
                  list={`bulk-usageOptions-${index}`}
                  placeholder="How to use this medicine"
                />
                <datalist id={`bulk-usageOptions-${index}`}>
                  {usageOptions.map((u, i) => <option key={i} value={u} />)}
                </datalist>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Bottom action bar ── */}
      <div className="bulk-bottom-bar">
        <button className="bulk-add-row-btn" onClick={addNewRow} disabled={loading}>
          <i className="fa-solid fa-plus"></i> Add Another Product
        </button>
        <button
          className="bulk-submit-btn"
          onClick={handleSubmitAll}
          disabled={loading || !allValid}
        >
          {loading
            ? <><i className="fa-solid fa-spinner fa-spin"></i> Submitting {submittedCount}/{products.length}...</>
            : <><i className="fa-solid fa-cloud-arrow-up"></i> Submit All ({products.length})</>
          }
        </button>
      </div>
    </div>
  );
}

export default BulkAddProduct;
