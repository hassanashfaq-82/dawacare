// src/AdminPanel/ManageSale.js
import React, { useState, useEffect } from "react";
import { useSale } from "../contexts/SaleContext";
import { toast } from "react-toastify";
import { db } from "../firebase/firebase";
import { collection, getDocs, writeBatch, doc, getDoc, setDoc } from "firebase/firestore";

function ManageSale() {
  const { sale, saleLoading, saveSale } = useSale();

  const [isActive, setIsActive] = useState(false);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [label, setLabel] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!saleLoading) {
      setIsActive(sale.isActive || false);
      setDiscountPercent(sale.discountPercent || 0);
      setLabel(sale.label || "");
      setStartDate(sale.startDate || "");
      setEndDate(sale.endDate || "");
    }
  }, [saleLoading, sale]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (discountPercent < 0 || discountPercent > 100) {
      toast.error("Discount must be between 0 and 100");
      return;
    }
    if (isActive && startDate && endDate && startDate > endDate) {
      toast.error("Start date must be before end date");
      return;
    }
    setSaving(true);
    try {
      const newDiscountPercent = Number(discountPercent);
      await saveSale({ isActive, discountPercent: newDiscountPercent, label, startDate, endDate });

      // Bulk-update all products' discounts field in Firebase
      const newDiscountLabel = isActive && newDiscountPercent > 0 ? `${newDiscountPercent}% OFF` : "";
      const snapshot = await getDocs(collection(db, "products"));
      const batch = writeBatch(db);
      snapshot.docs.forEach((productDoc) => {
        batch.update(doc(db, "products", productDoc.id), { discounts: newDiscountLabel });
      });
      await batch.commit();

      // Sync hero slides' buttonText in Firebase when sale is active
      if (newDiscountLabel) {
        const siteRef = doc(db, "siteSettings", "businessInfo");
        const siteSnap = await getDoc(siteRef);
        if (siteSnap.exists()) {
          const siteData = siteSnap.data();
          const updatedSlides = (siteData.slides || []).map((slide) => ({
            ...slide,
            heroCTAButtonText: newDiscountLabel,
          }));
          await setDoc(siteRef, { ...siteData, slides: updatedSlides }, { merge: true });
        }
      }

      toast.success("Sale settings saved and all products updated");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save sale settings");
    } finally {
      setSaving(false);
    }
  };

  if (saleLoading) {
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
        <h2>Manage Sale</h2>
        <p style={{ color: "#888", marginBottom: "24px", fontSize: "14px" }}>
          Configure the site-wide sale. The discount is applied automatically to all product badges and the marquee banner.
        </p>

        {/* Live Preview */}
        <div className="sale-preview-banner" style={{
          background: isActive ? "linear-gradient(90deg, #d2222d, #ff6b35)" : "#e0e0e0",
          color: isActive ? "#fff" : "#999",
          borderRadius: "10px",
          padding: "16px 24px",
          marginBottom: "28px",
          textAlign: "center",
          fontSize: "18px",
          fontWeight: "700",
          letterSpacing: "1px",
          transition: "all 0.3s ease",
        }}>
          {isActive ? (
            <>
              <i className="fa-solid fa-tag" style={{ marginRight: "8px" }}></i>
              {label || "Special Sale"} — {discountPercent}% OFF
              {startDate && endDate && (
                <span style={{ fontSize: "13px", fontWeight: "400", marginLeft: "12px", opacity: 0.9 }}>
                  ({startDate} to {endDate})
                </span>
              )}
            </>
          ) : (
            <span><i className="fa-solid fa-tag" style={{ marginRight: "8px" }}></i>No Active Sale</span>
          )}
        </div>

        <form className="upload-form" onSubmit={handleSave}>

          {/* Toggle */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            padding: "16px 20px",
            background: "#fafafa",
            border: "1px solid #e0e0e0",
            borderRadius: "10px",
            marginBottom: "20px",
          }}>
            <label className="sale-toggle-label" style={{ fontWeight: "600", fontSize: "15px", flex: 1 }}>
              <i className="fa-solid fa-percent" style={{ marginRight: "8px", color: "#d2222d" }}></i>
              Sale Active
            </label>
            <div
              className={`sale-toggle${isActive ? " on" : ""}`}
              onClick={() => setIsActive(!isActive)}
              style={{
                width: "52px",
                height: "28px",
                borderRadius: "14px",
                background: isActive ? "#d2222d" : "#ccc",
                cursor: "pointer",
                position: "relative",
                transition: "background 0.25s",
                flexShrink: 0,
              }}
            >
              <span style={{
                position: "absolute",
                top: "4px",
                left: isActive ? "26px" : "4px",
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                background: "#fff",
                transition: "left 0.25s",
                boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
              }} />
            </div>
            <span style={{ fontSize: "13px", color: isActive ? "#d2222d" : "#999", fontWeight: "600", minWidth: "32px" }}>
              {isActive ? "ON" : "OFF"}
            </span>
          </div>

          {/* Discount Percent */}
          <div className="form-group">
            <label htmlFor="ms-discount">
              <i className="fa-solid fa-percent" style={{ marginRight: "6px", color: "#d2222d" }}></i>
              Discount Percentage
            </label>
            <input
              id="ms-discount"
              type="number"
              min="0"
              max="100"
              value={discountPercent}
              onChange={(e) => setDiscountPercent(e.target.value)}
              placeholder="e.g. 15"
              disabled={!isActive}
            />
            {isActive && discountPercent > 0 && (
              <small style={{ color: "#d2222d", marginTop: "4px", display: "block" }}>
                Badge will show: <strong>{discountPercent}% OFF</strong>
              </small>
            )}
          </div>

          {/* Sale Label */}
          <div className="form-group">
            <label htmlFor="ms-label">
              <i className="fa-solid fa-tag" style={{ marginRight: "6px", color: "#d2222d" }}></i>
              Sale Label / Title
            </label>
            <input
              id="ms-label"
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Summer Sale, Eid Special, Flash Sale"
              disabled={!isActive}
            />
          </div>

          {/* Dates */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div className="form-group">
              <label htmlFor="ms-start">
                <i className="fa-solid fa-calendar-day" style={{ marginRight: "6px", color: "#d2222d" }}></i>
                Start Date
              </label>
              <input
                id="ms-start"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                disabled={!isActive}
              />
            </div>

            <div className="form-group">
              <label htmlFor="ms-end">
                <i className="fa-solid fa-calendar-xmark" style={{ marginRight: "6px", color: "#d2222d" }}></i>
                End Date
              </label>
              <input
                id="ms-end"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                disabled={!isActive}
              />
            </div>
          </div>

          {/* Info box */}
          <div style={{
            background: "#fff8e1",
            border: "1px solid #ffe082",
            borderRadius: "8px",
            padding: "14px 16px",
            marginBottom: "8px",
            fontSize: "13px",
            color: "#795548",
            lineHeight: "1.6",
          }}>
            <i className="fa-solid fa-circle-info" style={{ marginRight: "6px", color: "#f9a825" }}></i>
            <strong>How it works:</strong> When sale is active, the discount percentage is automatically applied to all product discount badges and the marquee banner on the homepage. The discount field in Add Product &amp; Edit Product forms is auto-filled and disabled.
          </div>

          <div className="form-submit-row save-sale-btn-outer-div">
            <button type="submit" disabled={saving} className="save-sale-btn">
              {saving
                ? <><i className="fa-solid fa-spinner fa-spin"></i> Saving...</>
                : <><i className="fa-solid fa-floppy-disk"></i> Save Sale Settings</>
              }
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default ManageSale;
