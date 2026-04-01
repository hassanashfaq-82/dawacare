// src/AdminPanel/UploadProducts.js
import React, { useState, useEffect, useRef } from "react";
import { db } from "../firebase/firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, orderBy, query } from "firebase/firestore";
import { toast } from "react-toastify";

function UploadProducts() {
  const [discount, setDiscount] = useState("");
  const [productName, setProductName] = useState("");
  const [brandName, setBrandName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [description, setDescription] = useState("");
  const [usageInstructions, setUsageInstructions] = useState("");

  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize]       = useState(5);

  const PAGE_SIZE_OPTIONS = [5, 15, 25, 50, 100];

  const formRef = useRef(null);

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

  useEffect(() => { fetchProducts(); }, []);

  const resetForm = () => {
    setDiscount("");
    setProductName("");
    setBrandName("");
    setNewPrice("");
    setOldPrice("");
    setImageURL("");
    setDescription("");
    setUsageInstructions("");
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productName || !newPrice || !imageURL) {
      toast.error("Please fill required fields");
      return;
    }
    try {
      if (editingId) {
        await updateDoc(doc(db, "products", editingId), {
          discount,
          productName,
          brandName,
          newPrice: parseFloat(newPrice),
          oldPrice: parseFloat(oldPrice),
          productImage: imageURL,
          description,
          usageInstructions,
        });
        toast.success("Product updated");
      } else {
        await addDoc(collection(db, "products"), {
          discount,
          productName,
          brandName,
          newPrice: parseFloat(newPrice),
          oldPrice: parseFloat(oldPrice),
          productImage: imageURL,
          description,
          usageInstructions,
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
    setDiscount(product.discount || "");
    setProductName(product.productName || "");
    setBrandName(product.brandName || "");
    setNewPrice(product.newPrice || "");
    setOldPrice(product.oldPrice || "");
    setImageURL(product.productImage || "");
    setDescription(product.description || "");
    setUsageInstructions(product.usageInstructions || "");
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
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
  const paginated  = products.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="upload-page">

      {/* ── Form ── */}
      <div className={`upload-container${editingId ? " edit-mode" : ""}`} ref={formRef}>

        {editingId && (
          <div className="form-edit-banner">
            <span>
              <i className="fa-solid fa-pen-to-square"></i> You are editing a product
            </span>
            <button className="cancel-edit-btn" onClick={resetForm}>
              <i className="fa-solid fa-xmark"></i> Cancel Edit
            </button>
          </div>
        )}

        <h2>{editingId ? "Update Product" : "Upload Product"}</h2>

        <form className="upload-form" onSubmit={handleSubmit}>

          <div className="form-group">
            <label htmlFor="productName">Product Name *</label>
            <input id="productName" type="text" placeholder="Product name" value={productName}
              onChange={(e) => setProductName(e.target.value)} list="productOptions" />
            <datalist id="productOptions">
              {productOptions.map((n, i) => <option key={i} value={n} />)}
            </datalist>
          </div>

          <div className="form-group">
            <label htmlFor="brandName">Brand Name</label>
            <input id="brandName" type="text" placeholder="Brand name" value={brandName}
              onChange={(e) => setBrandName(e.target.value)} list="brandOptions" />
            <datalist id="brandOptions">
              {brandOptions.map((b, i) => <option key={i} value={b} />)}
            </datalist>
          </div>

          <div className="form-group">
            <label htmlFor="newPrice">New Price *</label>
            <input id="newPrice" type="number" placeholder="New price" value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)} list="newPriceOptions" />
            <datalist id="newPriceOptions">
              {newPriceOptions.map((p, i) => <option key={i} value={p} />)}
            </datalist>
          </div>

          <div className="form-group">
            <label htmlFor="oldPrice">Old Price</label>
            <input id="oldPrice" type="number" placeholder="Old price" value={oldPrice}
              onChange={(e) => setOldPrice(e.target.value)} list="oldPriceOptions" />
            <datalist id="oldPriceOptions">
              {oldPriceOptions.map((p, i) => <option key={i} value={p} />)}
            </datalist>
          </div>

          <div className="form-group">
            <label htmlFor="discount">Discount Badge</label>
            <input id="discount" type="text" value={discount}
              onChange={(e) => setDiscount(e.target.value)} placeholder="e.g. 10% OFF" />
          </div>

          <div className="form-group">
            <label htmlFor="imageURL">Product Image URL *</label>
            <input id="imageURL" type="text" value={imageURL}
              onChange={(e) => setImageURL(e.target.value)}
              placeholder="Paste image link here" list="imageOptions" />
            <datalist id="imageOptions">
              {imageOptions.map((u, i) => <option key={i} value={u} />)}
            </datalist>
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
            <label htmlFor="usageInstructions">Usage Instructions</label>
            <input id="usageInstructions" type="text" value={usageInstructions}
              onChange={(e) => setUsageInstructions(e.target.value)}
              placeholder="How to use this medicine" list="usageOptions" />
            <datalist id="usageOptions">
              {usageOptions.map((u, i) => <option key={i} value={u} />)}
            </datalist>
          </div>

          <div className="form-submit-row">
            <button type="submit">
              {editingId
                ? <><i className="fa-solid fa-floppy-disk"></i> Save Changes</>
                : <><i className="fa-solid fa-cloud-arrow-up"></i> Upload Product</>
              }
            </button>
          </div>

        </form>
      </div>

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
                  <th>Brand</th>
                  <th>Price</th>
                  <th>Description</th>
                  <th>Usage</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((product) => (
                  <tr key={product.id} className={editingId === product.id ? "row-being-edited" : ""}>
                    <td>
                      <img src={product.productImage} alt={product.productName}
                        className="product-thumb"
                        onError={(e) => { e.target.src = "https://via.placeholder.com/42"; }} />
                    </td>
                    <td data-label="Product" className="product-name-cell">{product.productName}</td>
                    <td data-label="Brand">{product.brandName || "—"}</td>
                    <td data-label="Price" className="price-new">₨{product.newPrice}</td>
                    <td data-label="Description" className="truncate-cell">{product.description || "—"}</td>
                    <td data-label="Usage" className="truncate-cell">{product.usageInstructions || "—"}</td>
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
            <button
              className="page-btn"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >«</button>
            <button
              className="page-btn"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >‹</button>
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
            <button
              className="page-btn"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >›</button>
            <button
              className="page-btn"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >»</button>
          </div>
          <div className="pagination-size">
            <label>Rows per page:</label>
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
            >
              {PAGE_SIZE_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
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