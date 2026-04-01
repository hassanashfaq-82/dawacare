// src/AdminPanel/AddProduct.js
import React, { useState } from "react";
import { db } from "../firebase/firebase";
import { collection, addDoc } from "firebase/firestore";
import { toast } from "react-toastify";
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

function AddProduct() {
  const { sale, discountLabel } = useSale();
  const [name, setName] = useState("");
  const [formula, setFormula] = useState("");
  const [type, setType] = useState("");
  const [price, setPrice] = useState("");
  const [retailPrice, setRetailPrice] = useState("");
  const [quantityPerPack, setQuantityPerPack] = useState("");
  const [manufacturedBy, setManufacturedBy] = useState("");
  const [picture, setPicture] = useState("");
  const [description, setDescription] = useState("");
  const [usage, setUsage] = useState("");
  const [loading, setLoading] = useState(false);

  // Auto-derive discounts from active sale
  const discounts = discountLabel;

  const resetForm = () => {
    setName("");
    setFormula("");
    setType("");
    setPrice("");
    setRetailPrice("");
    setQuantityPerPack("");
    setManufacturedBy("");
    setPicture("");
    setDescription("");
    setUsage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !price || !picture) {
      toast.error("Please fill required fields: Product Name, Price, Image URL");
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, "products"), {
        name,
        formula,
        type,
        price: parseFloat(price),
        retailPrice: parseFloat(retailPrice) || 0,
        quantityPerPack: quantityPerPack ? parseInt(quantityPerPack, 10) : 0,
        manufacturedBy,
        picture,
        discounts,
        description,
        usage,
        createdAt: new Date()
      });
      toast.success("Product added successfully");
      resetForm();
    } catch (error) {
      console.error(error);
      toast.error("Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-page">
      <div className="upload-container">
        <h2>Add New Product</h2>

        <form className="upload-form" onSubmit={handleSubmit}>

          <div className="form-group">
            <label htmlFor="ap-name">Product Name *</label>
            <input id="ap-name" type="text" value={name}
              onChange={(e) => setName(e.target.value)}
              list="ap-nameOptions" placeholder="Enter product name" />
            <datalist id="ap-nameOptions">
              {nameOptions.map((n, i) => <option key={i} value={n} />)}
            </datalist>
          </div>

          <div className="form-group">
            <label htmlFor="ap-formula">Formula</label>
            <input id="ap-formula" type="text" value={formula}
              onChange={(e) => setFormula(e.target.value)}
              placeholder="e.g. Paracetamol 500mg" />
          </div>

          <div className="form-group">
            <label htmlFor="ap-type">Type</label>
            <input id="ap-type" type="text" value={type}
              onChange={(e) => setType(e.target.value)}
              list="ap-typeOptions" placeholder="e.g. Tablet, Syrup, Capsule" />
            <datalist id="ap-typeOptions">
              {typeOptions.map((t, i) => <option key={i} value={t} />)}
            </datalist>
          </div>

          <div className="form-group">
            <label htmlFor="ap-price">Price (Selling Price) *</label>
            <input id="ap-price" type="number" value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter selling price" min="0" />
          </div>

          <div className="form-group">
            <label htmlFor="ap-retailPrice">Retail Price (Original Price)</label>
            <input id="ap-retailPrice" type="number" value={retailPrice}
              onChange={(e) => setRetailPrice(e.target.value)}
              placeholder="Enter original/retail price" min="0" />
          </div>

          <div className="form-group">
            <label htmlFor="ap-quantityPerPack">Quantity (Tabs/Pack)</label>
            <input id="ap-quantityPerPack" type="number" value={quantityPerPack}
              onChange={(e) => setQuantityPerPack(e.target.value)}
              placeholder="e.g. 10, 20, 100" min="0" />
          </div>

          <div className="form-group">
            <label htmlFor="ap-manufacturedBy">Manufactured By</label>
            <input id="ap-manufacturedBy" type="text" value={manufacturedBy}
              onChange={(e) => setManufacturedBy(e.target.value)}
              list="ap-manufacturedByOptions" placeholder="Manufacturer / brand name" />
            <datalist id="ap-manufacturedByOptions">
              {manufacturedByOptions.map((b, i) => <option key={i} value={b} />)}
            </datalist>
          </div>

          <div className="form-group">
            <label htmlFor="ap-picture">Product Image URL *</label>
            <input id="ap-picture" type="text" value={picture}
              onChange={(e) => setPicture(e.target.value)}
              placeholder="Paste image link here" list="ap-pictureOptions" />
            <datalist id="ap-pictureOptions">
              {pictureOptions.map((u, i) => <option key={i} value={u} />)}
            </datalist>
            {picture && (
              <img
                src={picture}
                alt="Preview"
                className="product-thumb"
                style={{ marginTop: "8px", width: "80px", height: "80px", objectFit: "cover", borderRadius: "6px" }}
                onError={(e) => { e.target.style.display = "none"; }}
              />
            )}
          </div>

          <div className="form-group">
            <label htmlFor="ap-discounts">
              Discounts / Sale Badge
              {sale.isActive && (
                <span style={{ marginLeft: "8px", fontSize: "11px", background: "#d2222d", color: "#fff", borderRadius: "4px", padding: "2px 7px", fontWeight: "600" }}>
                  Auto from Sale
                </span>
              )}
            </label>
            <input
              id="ap-discounts"
              type="text"
              value={discounts}
              readOnly
              disabled
              placeholder={sale.isActive ? discountLabel || "No sale active" : "No active sale — go to Manage Sale"}
              style={{ background: "#f5f5f5", color: "#888", cursor: "not-allowed" }}
            />
            {sale.isActive
              ? <small style={{ color: "#d2222d", marginTop: "4px", display: "block" }}>Discount is set globally via <strong>Manage Sale</strong>.</small>
              : <small style={{ color: "#aaa", marginTop: "4px", display: "block" }}>Enable a sale from <strong>Manage Sale</strong> to auto-fill this.</small>
            }
          </div>

          <div className="form-group">
            <label htmlFor="ap-description">Description</label>
            <input id="ap-description" type="text" value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description about the medicine"
              list="ap-descriptionOptions" />
            <datalist id="ap-descriptionOptions">
              {descriptionOptions.map((d, i) => <option key={i} value={d} />)}
            </datalist>
          </div>

          <div className="form-group">
            <label htmlFor="ap-usage">Usage Instructions</label>
            <input id="ap-usage" type="text" value={usage}
              onChange={(e) => setUsage(e.target.value)}
              placeholder="How to use this medicine" list="ap-usageOptions" />
            <datalist id="ap-usageOptions">
              {usageOptions.map((u, i) => <option key={i} value={u} />)}
            </datalist>
          </div>

          <div className="form-submit-row">
            <button type="submit" disabled={loading}>
              {loading
                ? <><i className="fa-solid fa-spinner fa-spin"></i> Adding...</>
                : <><i className="fa-solid fa-plus"></i> Add Product</>
              }
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default AddProduct;
