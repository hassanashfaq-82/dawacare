// src/AdminPanel/UploadProducts.js
import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, orderBy, query, writeBatch, deleteField } from "firebase/firestore";
import { toast } from "react-toastify";
import { useSale } from "../contexts/SaleContext";

function UploadProducts() {
  const { sale, discountLabel } = useSale();
  const [name, setName] = useState("");
  const [formula, setFormula] = useState("");
  const [type, setType] = useState("");
  const [price, setPrice] = useState("");
  const [retailPrice, setRetailPrice] = useState("");
  const [quantityPerPack, setQuantityPerPack] = useState("");
  const [manufacturedBy, setManufacturedBy] = useState("");
  const [picture, setPicture] = useState("");
  // discounts auto-derived from active sale
  const discounts = discountLabel;
  const [description, setDescription] = useState("");
  const [usage, setUsage] = useState("");

  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const PAGE_SIZE_OPTIONS = [5, 15, 25, 50, 100, 200, 400, 800, 1200, 1600];

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

  const fetchProducts = async () => {
    try {
      const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setProducts(list);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load products");
    }
  };

  useEffect(() => {
    fetchProducts();
    removeStockField();
  }, []);

  const removeStockField = async () => {
    try {
      const snapshot = await getDocs(collection(db, "products"));
      const docsWithStock = snapshot.docs.filter(d => d.data().stock !== undefined);
      if (docsWithStock.length === 0) return;
      const batch = writeBatch(db);
      docsWithStock.forEach(d => batch.update(d.ref, { stock: deleteField() }));
      await batch.commit();
    } catch (err) {
      console.error("Stock cleanup failed:", err);
    }
  };

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
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !price || !picture) {
      toast.error("Please fill required fields: Product Name, Price, Image URL");
      return;
    }
    try {
      const productData = {
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
      };

      if (editingId) {
        await updateDoc(doc(db, "products", editingId), productData);
        toast.success("Product updated");
      } else {
        await addDoc(collection(db, "products"), {
          ...productData,
          createdAt: new Date()
        });
        toast.success("Product uploaded successfully");
      }
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save product");
    }
  };

  const startEdit = (product) => {
    setEditingId(product.id);
    setName(product.name || "");
    setFormula(product.formula || "");
    setType(product.type || "");
    setPrice(product.price || "");
    setRetailPrice(product.retailPrice || "");
    setQuantityPerPack(product.quantityPerPack || "");
    setManufacturedBy(product.manufacturedBy || "");
    setPicture(product.picture || "");
    setDescription(product.description || "");
    setUsage(product.usage || "");
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "products", id));
      toast.success("Product deleted");
      setDeleteConfirmId(null);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete product");
    }
  };

  // ── Pagination ───────────────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(products.length / pageSize));
  const paginated = products.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="upload-page">

      {/* ── Edit Modal ── */}
      {editingId && (
        <div className="confirm-overlay" onClick={(e) => { if (e.target === e.currentTarget) resetForm(); }}>
          <div className="upload-container edit-mode" style={{ maxHeight: "90vh", overflowY: "auto" }}>

            <div className="form-edit-banner">
              <span>
                <i className="fa-solid fa-pen-to-square"></i> Editing Product
              </span>
              <button className="cancel-edit-btn" onClick={resetForm}>
                <i className="fa-solid fa-xmark"></i> Cancel
              </button>
            </div>

            <h2>Update Product</h2>

            <form className="upload-form" onSubmit={handleSubmit}>

              <div className="form-group">
                <label htmlFor="name">Product Name *</label>
                <input id="name" type="text" placeholder="Product name" value={name}
                  onChange={(e) => setName(e.target.value)} list="nameOptions" />
                <datalist id="nameOptions">
                  {nameOptions.map((n, i) => <option key={i} value={n} />)}
                </datalist>
              </div>

              <div className="form-group">
                <label htmlFor="formula">Formula</label>
                <input id="formula" type="text" placeholder="e.g. Paracetamol 500mg" value={formula}
                  onChange={(e) => setFormula(e.target.value)} />
              </div>

              <div className="form-group">
                <label htmlFor="type">Type</label>
                <input id="type" type="text" placeholder="e.g. Tablet, Syrup, Capsule" value={type}
                  onChange={(e) => setType(e.target.value)} list="typeOptions" />
                <datalist id="typeOptions">
                  {typeOptions.map((t, i) => <option key={i} value={t} />)}
                </datalist>
              </div>

              <div className="form-group">
                <label htmlFor="price">Price (Selling Price) *</label>
                <input id="price" type="number" placeholder="Selling price" value={price}
                  onChange={(e) => setPrice(e.target.value)} min="0" />
              </div>

              <div className="form-group">
                <label htmlFor="retailPrice">Retail Price (Original Price)</label>
                <input id="retailPrice" type="number" placeholder="Original/retail price" value={retailPrice}
                  onChange={(e) => setRetailPrice(e.target.value)} min="0" />
              </div>

              <div className="form-group">
                <label htmlFor="quantityPerPack">Quantity (Tabs/Pack)</label>
                <input id="quantityPerPack" type="number" placeholder="e.g. 10, 20, 100" value={quantityPerPack}
                  onChange={(e) => setQuantityPerPack(e.target.value)} min="0" />
              </div>

              <div className="form-group">
                <label htmlFor="manufacturedBy">Manufactured By</label>
                <input id="manufacturedBy" type="text" placeholder="Manufacturer / brand name" value={manufacturedBy}
                  onChange={(e) => setManufacturedBy(e.target.value)} list="manufacturedByOptions" />
                <datalist id="manufacturedByOptions">
                  {manufacturedByOptions.map((b, i) => <option key={i} value={b} />)}
                </datalist>
              </div>

              <div className="form-group">
                <label htmlFor="picture">Product Image URL *</label>
                <input id="picture" type="text" value={picture}
                  onChange={(e) => setPicture(e.target.value)}
                  placeholder="Paste image link here" list="pictureOptions" />
                <datalist id="pictureOptions">
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
                <label htmlFor="discounts">
                  Discounts / Sale Badge
                  {sale.isActive && (
                    <span style={{ marginLeft: "8px", fontSize: "11px", background: "#d2222d", color: "#fff", borderRadius: "4px", padding: "2px 7px", fontWeight: "600" }}>
                      Auto from Sale
                    </span>
                  )}
                </label>
                <input
                  id="discounts"
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
                <label htmlFor="description">Description</label>
                <input id="description" type="text" value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description about the medicine" list="descriptionOptions" />
                <datalist id="descriptionOptions">
                  {descriptionOptions.map((d, i) => <option key={i} value={d} />)}
                </datalist>
              </div>

              <div className="form-group">
                <label htmlFor="usage">Usage Instructions</label>
                <input id="usage" type="text" value={usage}
                  onChange={(e) => setUsage(e.target.value)}
                  placeholder="How to use this medicine" list="usageOptions" />
                <datalist id="usageOptions">
                  {usageOptions.map((u, i) => <option key={i} value={u} />)}
                </datalist>
              </div>

              <div className="form-submit-row model-save-btn-outer-div">
                <button type="submit" className="model-save-btn">
                  {editingId
                    ? <><i className="fa-solid fa-floppy-disk"></i> Save Changes</>
                    : <><i className="fa-solid fa-cloud-arrow-up"></i> Upload Product</>
                  }
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ── Product List ── */}
      <div className="products-list-container">
        <h2>
          All Products <span className="products-count">{products.length}</span>
        </h2>

        {products.length === 0 ? (
          <p className="no-products">No products uploaded yet.</p>
        ) : (
          <div className="table-scroll-wrapper">
            <table className="products-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Product Name</th>
                  <th>Formula</th>
                  <th>Type</th>
                  <th>Price</th>
                  <th>Retail Price</th>
                  <th>Qty/Pack</th>
                  <th>Manufactured By</th>
                  <th>Discounts</th>
                  <th>Description</th>
                  <th>Usage</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((product) => (
                  <tr key={product.id} className={editingId === product.id ? "row-being-edited" : ""}>
                    <td>
                      <img src={product.picture} alt={product.name}
                        className="product-thumb"
                        onError={(e) => { e.target.src = "https://via.placeholder.com/42"; }} />
                    </td>
                    <td data-label="Product Name" className="product-name-cell">{product.name}</td>
                    <td data-label="Formula" className="truncate-cell">{product.formula || "—"}</td>
                    <td data-label="Type">{product.type || "—"}</td>
                    <td data-label="Price" className="price-new">₨{product.price}</td>
                    <td data-label="Retail Price" className="price-old">₨{product.retailPrice || "—"}</td>
                    <td data-label="Qty/Pack">{product.quantityPerPack || "—"}</td>
                    <td data-label="Manufactured By">{product.manufacturedBy || "—"}</td>
                    <td data-label="Discounts">{product.discounts || "—"}</td>
                    <td data-label="Description" className="truncate-cell">{product.description || "—"}</td>
                    <td data-label="Usage" className="truncate-cell">{product.usage || "—"}</td>
                    <td data-label="Actions">
                      <div className="action-buttons">
                        <button className="edit-btn" onClick={() => startEdit(product)}>
                          <i className="fa-solid fa-pen"></i> Edit
                        </button>
                        <button className="delete-btn" onClick={() => setDeleteConfirmId(product.id)}>
                          <i className="fa-solid fa-trash"></i> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Pagination ── */}
      {products.length > 0 && (
        <div className="pagination-bar">
          <div className="pagination-info">
            Showing {Math.min((currentPage - 1) * pageSize + 1, products.length)}–{Math.min(currentPage * pageSize, products.length)} of {products.length}
          </div>
          <div className="pagination-controls">
            <button className="page-btn" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>«</button>
            <button className="page-btn" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>‹</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
              .reduce((acc, p, idx, arr) => {
                if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
                acc.push(p);
                return acc;
              }, [])
              .map((item, i) =>
                item === "..." ? (
                  <span key={`ellipsis-${i}`} className="page-ellipsis">…</span>
                ) : (
                  <button
                    key={item}
                    className={`page-btn${currentPage === item ? " active" : ""}`}
                    onClick={() => setCurrentPage(item)}
                  >{item}</button>
                )
              )}
            <button className="page-btn" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>›</button>
            <button className="page-btn" onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>»</button>
          </div>
          <div className="pagination-size">
            <label>Rows per page:</label>
            <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}>
              {PAGE_SIZE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      )}

      {/* ── Delete Modal ── */}
      {deleteConfirmId && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <div className="confirm-icon">
              <i className="fa-solid fa-triangle-exclamation"></i>
            </div>
            <h3>Delete Product?</h3>
            <p>This action cannot be undone.</p>
            <div className="confirm-actions">
              <button className="confirm-delete-btn" onClick={() => handleDelete(deleteConfirmId)}>
                <i className="fa-solid fa-trash"></i> Yes, Delete
              </button>
              <button className="cancel-btn" onClick={() => setDeleteConfirmId(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default UploadProducts;
