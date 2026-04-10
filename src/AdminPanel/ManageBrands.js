// src/AdminPanel/ManageBrands.js
import React, { useState, useEffect } from "react";
import { useBrands } from "../contexts/BrandsContext";
import toast from "../utils/toast";
import CloudinaryUpload from "../components/CloudinaryUpload";

const EMPTY_MODAL = { name: "", logoUrl: "" };

function ManageBrands() {
  const { brands, loading, saveBrands } = useBrands();
  const [localBrands, setLocalBrands] = useState([]);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState(EMPTY_MODAL);

  const isAllBrandsValid = localBrands.every(b => b.name.trim() !== "" && b.logoUrl.trim() !== "");
  const isModalValid = modalData.name.trim() !== "" && modalData.logoUrl.trim() !== "";

  useEffect(() => {
    if (!loading) {
      setLocalBrands(brands);
    }
  }, [loading, brands]);

  const openModal = () => {
    setModalData(EMPTY_MODAL);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalData(EMPTY_MODAL);
  };

  const handleModalSave = () => {
    if (!modalData.name.trim()) {
      toast.error("Brand name is required");
      return;
    }
    if (!modalData.logoUrl.trim()) {
      toast.error("Brand logo URL is required");
      return;
    }
    setLocalBrands((prev) => [
      ...prev,
      { id: Date.now().toString(), name: modalData.name.trim(), logoUrl: modalData.logoUrl.trim(), order: prev.length },
    ]);
    closeModal();
  };

  const handleChange = (index, field, value) => {
    setLocalBrands((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleDelete = (index) => {
    setLocalBrands((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMoveUp = (index) => {
    if (index === 0) return;
    setLocalBrands((prev) => {
      const updated = [...prev];
      [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
      return updated.map((b, i) => ({ ...b, order: i }));
    });
  };

  const handleMoveDown = (index) => {
    if (index === localBrands.length - 1) return;
    setLocalBrands((prev) => {
      const updated = [...prev];
      [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
      return updated.map((b, i) => ({ ...b, order: i }));
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const ordered = localBrands.map((b, i) => ({ ...b, order: i }));
      await saveBrands(ordered);
      toast.success("Brands saved successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save brands");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="upload-page">
        <div className="upload-container">
          <p style={{ textAlign: "center", padding: "40px" }}>
            <i className="fa-solid fa-spinner fa-spin"></i> Loading...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="upload-page">
      <div className="upload-container">
        <h2>Manage Brands</h2>
        <p style={{ color: "#888", marginBottom: "24px", fontSize: "14px" }}>
          Add or remove featured brands shown in the carousel on the home page. Changes are reflected immediately after saving.
        </p>

        <div className="mb-section-header">
          <h3 style={{ margin: 0, color: "#d2222d" }}>
            <i className="fa-solid fa-tags" style={{ marginRight: "8px" }}></i>
            Featured Brands
          </h3>
          <button
            type="button"
            onClick={openModal}
            style={{
              background: "#fff",
              border: "2px dashed #d2222d",
              borderRadius: "10px",
              padding: "6px 16px",
              cursor: "pointer",
              color: "#d2222d",
              fontWeight: "600",
              fontSize: "13px",
            }}
          >
            <i className="fa-solid fa-plus" style={{ marginRight: "6px" }}></i>
            Add Brand
          </button>
        </div>

        {localBrands.length === 0 && (
          <div style={{ border: "1px dashed #e0e0e0", borderRadius: "10px", padding: "24px", textAlign: "center", color: "#aaa", marginBottom: "20px" }}>
            <i className="fa-solid fa-circle-info" style={{ marginRight: "6px" }}></i>
            No brands added yet. Click "Add Brand" to get started.
          </div>
        )}

        {localBrands.map((brand, index) => (
          <div key={brand.id} className="mb-brand-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <h4 style={{ margin: 0, color: "#333" }}>
                <i className="fa-solid fa-certificate" style={{ marginRight: "6px", color: "#d2222d" }}></i>
                Brand {index + 1}
              </h4>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  type="button"
                  onClick={() => handleMoveUp(index)}
                  disabled={index === 0}
                  style={{
                    background: "none",
                    border: "1px solid #ddd",
                    borderRadius: "6px",
                    padding: "4px 10px",
                    cursor: index === 0 ? "not-allowed" : "pointer",
                    color: index === 0 ? "#ccc" : "#555",
                  }}
                  title="Move up"
                >
                  <i className="fa-solid fa-chevron-up"></i>
                </button>
                <button
                  type="button"
                  onClick={() => handleMoveDown(index)}
                  disabled={index === localBrands.length - 1}
                  style={{
                    background: "none",
                    border: "1px solid #ddd",
                    borderRadius: "6px",
                    padding: "4px 10px",
                    cursor: index === localBrands.length - 1 ? "not-allowed" : "pointer",
                    color: index === localBrands.length - 1 ? "#ccc" : "#555",
                  }}
                  title="Move down"
                >
                  <i className="fa-solid fa-chevron-down"></i>
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(index)}
                  style={{
                    background: "#fff0f0",
                    border: "1px solid #f5c6cb",
                    borderRadius: "6px",
                    padding: "4px 10px",
                    cursor: "pointer",
                    color: "#d2222d",
                  }}
                  title="Delete brand"
                >
                  <i className="fa-solid fa-trash"></i>
                </button>
              </div>
            </div>

            <div className="mb-brand-fields">
              <div className="form-group" style={{ margin: 0, width: "100%" }}>
                <label>Brand Name</label>
                <input
                  type="text"
                  value={brand.name}
                  onChange={(e) => handleChange(index, "name", e.target.value)}
                  placeholder="e.g. Pfizer"
                  style={{ width: "100%" }}
                />
              </div>

              <div style={{ width: "100%" }}>
                <CloudinaryUpload
                  id={`mb-logo-${brand.id}`}
                  label="Brand Logo"
                  required
                  value={brand.logoUrl}
                  onChange={(url) => handleChange(index, "logoUrl", url)}
                  previewShape="circle"
                />
              </div>
            </div>
          </div>
        ))}

        <div style={{ display: "flex", justifyContent: "center" }}>
          <button
            type="button"
            onClick={openModal}
            style={{
              maxWidth: "fit-content",
              background: "#fff",
              border: "2px dashed #d2222d",
              borderRadius: "10px",
              padding: "12px 24px",
              cursor: "pointer",
              color: "#d2222d",
              fontWeight: "600",
              width: "100%",
              marginBottom: "24px",
            }}
          >
            <i className="fa-solid fa-plus" style={{ marginRight: "8px" }}></i>
            Add Brand
          </button>
        </div>

        <form className="upload-form" onSubmit={handleSave}>
          <button type="submit" disabled={saving || !isAllBrandsValid}>
            {saving
              ? <><i className="fa-solid fa-spinner fa-spin"></i> Saving...</>
              : <><i className="fa-solid fa-floppy-disk"></i> Save Changes</>
            }
          </button>
        </form>
      </div>

      {/* Add Brand Modal */}
      {modalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "14px",
              padding: "32px",
              width: "100%",
              maxWidth: "460px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h3 style={{ margin: 0, color: "#d2222d" }}>
                <i className="fa-solid fa-plus" style={{ marginRight: "8px" }}></i>
                Add New Brand
              </h3>
              <button
                type="button"
                onClick={closeModal}
                style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#888", lineHeight: 1 }}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label>Brand Name <span style={{ color: "#d2222d" }}>*</span></label>
                <input
                  type="text"
                  value={modalData.name}
                  onChange={(e) => setModalData((d) => ({ ...d, name: e.target.value }))}
                  placeholder="e.g. Pfizer"
                  autoFocus
                  style={{ width: "100%" }}
                />
              </div>

              <CloudinaryUpload
                id="mb-modal-logo"
                label="Brand Logo"
                required
                value={modalData.logoUrl}
                onChange={(url) => setModalData((d) => ({ ...d, logoUrl: url }))}
                previewShape="circle"
              />
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "28px", justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={closeModal}
                style={{
                  background: "#f5f5f5",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "10px 20px",
                  cursor: "pointer",
                  color: "#555",
                  fontWeight: "500",
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleModalSave}
                disabled={!isModalValid}
                style={{
                  background: "#d2222d",
                  border: "none",
                  borderRadius: "8px",
                  padding: "10px 24px",
                  cursor: "pointer",
                  color: "#fff",
                  fontWeight: "600",
                }}
              >
                <i className="fa-solid fa-plus" style={{ marginRight: "6px" }}></i>
                Add Brand
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageBrands;
