// src/AdminPanel/AddProduct.js
import React, { useState } from "react";
import { db } from "../firebase/firebase";
import { collection, addDoc } from "firebase/firestore";
import { toast } from "react-toastify";

const productOptions = [
  "Panadol Tablets 500mg", "Vitamin C 1000mg", "Glutamax Capsules",
  "Arinac Forte 400/60mg", "Ibuprofen 200mg"
];
const brandOptions = ["Pfizer", "GSK", "Abbott", "Sanofi", "Novartis"];
const imageOptions = [
  "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=500",
  "https://images.unsplash.com/photo-1585435557343-3b092031a831?w=500",
  "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=500",
  "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=500"
];
const newPriceOptions = [300, 320, 350, 400, 450, 500];
const oldPriceOptions = [360, 380, 420, 480, 550, 600];
const descriptionOptions = [
  "Pain relief tablets", "Vitamin supplement",
  "Joint support capsules", "Anti-inflammatory medication"
];
const usageOptions = [
  "Take 1 tablet daily", "Take 2 capsules after meals",
  "Apply topically twice a day", "Take with water"
];

function AddProduct() {
  const [discount, setDiscount] = useState("");
  const [productName, setProductName] = useState("");
  const [brandName, setBrandName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [description, setDescription] = useState("");
  const [usageInstructions, setUsageInstructions] = useState("");
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setDiscount("");
    setProductName("");
    setBrandName("");
    setNewPrice("");
    setOldPrice("");
    setImageURL("");
    setDescription("");
    setUsageInstructions("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productName || !newPrice || !imageURL) {
      toast.error("Please fill required fields");
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, "products"), {
        discount,
        productName,
        brandName,
        newPrice: parseFloat(newPrice),
        oldPrice: parseFloat(oldPrice) || 0,
        productImage: imageURL,
        description,
        usageInstructions,
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
            <label htmlFor="ap-productName">Product Name *</label>
            <input id="ap-productName" type="text" value={productName}
              onChange={(e) => setProductName(e.target.value)}
              list="ap-productOptions" placeholder="Enter product name" />
            <datalist id="ap-productOptions">
              {productOptions.map((n, i) => <option key={i} value={n} />)}
            </datalist>
          </div>

          <div className="form-group">
            <label htmlFor="ap-brandName">Brand Name</label>
            <input id="ap-brandName" type="text" value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              list="ap-brandOptions" placeholder="Enter brand name" />
            <datalist id="ap-brandOptions">
              {brandOptions.map((b, i) => <option key={i} value={b} />)}
            </datalist>
          </div>

          <div className="form-group">
            <label htmlFor="ap-newPrice">New Price *</label>
            <input id="ap-newPrice" type="number" value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              list="ap-newPriceOptions" placeholder="Enter selling price" />
            <datalist id="ap-newPriceOptions">
              {newPriceOptions.map((p, i) => <option key={i} value={p} />)}
            </datalist>
          </div>

          <div className="form-group">
            <label htmlFor="ap-oldPrice">Old Price</label>
            <input id="ap-oldPrice" type="number" value={oldPrice}
              onChange={(e) => setOldPrice(e.target.value)}
              list="ap-oldPriceOptions" placeholder="Enter original price" />
            <datalist id="ap-oldPriceOptions">
              {oldPriceOptions.map((p, i) => <option key={i} value={p} />)}
            </datalist>
          </div>

          <div className="form-group">
            <label htmlFor="ap-discount">Discount Badge</label>
            <input id="ap-discount" type="text" value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              placeholder="e.g. 10% OFF" />
          </div>

          <div className="form-group">
            <label htmlFor="ap-imageURL">Product Image URL *</label>
            <input id="ap-imageURL" type="text" value={imageURL}
              onChange={(e) => setImageURL(e.target.value)}
              placeholder="Paste image link here" list="ap-imageOptions" />
            <datalist id="ap-imageOptions">
              {imageOptions.map((u, i) => <option key={i} value={u} />)}
            </datalist>
            {imageURL && (
              <img
                src={imageURL}
                alt="Preview"
                className="product-thumb"
                style={{ marginTop: "8px", width: "80px", height: "80px", objectFit: "cover", borderRadius: "6px" }}
                onError={(e) => { e.target.style.display = "none"; }}
              />
            )}
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
            <label htmlFor="ap-usageInstructions">Usage Instructions</label>
            <input id="ap-usageInstructions" type="text" value={usageInstructions}
              onChange={(e) => setUsageInstructions(e.target.value)}
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
