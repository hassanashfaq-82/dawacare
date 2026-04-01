// src/AdminPanel/ManageBrands.js
import React, { useState, useEffect } from "react";
import { useBrands } from "../contexts/BrandsContext";
import { toast } from "react-toastify";

function ManageBrands() {
  const { brands, loading, saveBrands } = useBrands();
  const [localBrands, setLocalBrands] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading) {
      setLocalBrands(brands);
    }
  }, [loading, brands]);

  const handleAdd = () => {
    setLocalBrands((prev) => [
      ...prev,
      { id: Date.now().toString(), name: "", logoUrl: "", order: prev.length },
    ]);
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

        <h3 style={{ marginBottom: "16px", color: "#d2222d", borderBottom: "2px solid #d2222d", paddingBottom: "6px" }}>
          <i className="fa-solid fa-tags" style={{ marginRight: "8px" }}></i>
          Featured Brands
        </h3>

        {localBrands.length === 0 && (
          <div style={{ border: "1px dashed #e0e0e0", borderRadius: "10px", padding: "24px", textAlign: "center", color: "#aaa", marginBottom: "20px" }}>
            <i className="fa-solid fa-circle-info" style={{ marginRight: "6px" }}></i>
            No brands added yet. Click "Add Brand" to get started.
          </div>
        )}

        {localBrands.map((brand, index) => (
          <div
            key={brand.id}
            style={{
              border: "1px solid #e0e0e0",
              borderRadius: "10px",
              padding: "20px",
              marginBottom: "16px",
              background: "#fafafa",
            }}
          >
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

            <div className="upload-form" style={{ display: "grid", gap: "12px" }}>
              <div className="form-group">
                <label>Brand Name</label>
                <input
                  type="text"
                  value={brand.name}
                  onChange={(e) => handleChange(index, "name", e.target.value)}
                  placeholder="e.g. Pfizer"
                />
              </div>

              <div className="form-group">
                <label>Brand Logo URL</label>
                <input
                  type="text"
                  value={brand.logoUrl}
                  onChange={(e) => handleChange(index, "logoUrl", e.target.value)}
                  placeholder="Paste logo image link here"
                />
              </div>

              {brand.logoUrl && (
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ fontSize: "13px", color: "#888" }}>Preview:</span>
                  <div style={{ background: "#ffffff", border: "1px solid #e0e0e0", borderRadius: "50%", width: "70px", height: "70px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                    <img
                      src={brand.logoUrl}
                      alt={brand.name || "Brand logo"}
                      style={{ width: "55px", height: "55px", objectFit: "contain" }}
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(brand.name || "B")}&background=d2222d&color=fff&size=55&bold=true&rounded=true`;
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        <div style={{ display: "flex", justifyContent: "center" }}>
          <button
            type="button"
            onClick={handleAdd}
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
          <button type="submit" disabled={saving}>
            {saving
              ? <><i className="fa-solid fa-spinner fa-spin"></i> Saving...</>
              : <><i className="fa-solid fa-floppy-disk"></i> Save Changes</>
            }
          </button>
        </form>
      </div>
    </div>
  );
}

export default ManageBrands;
