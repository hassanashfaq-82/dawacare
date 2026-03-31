// src/AdminPanel/BusinessInfo.js
import React, { useState, useEffect } from "react";
import { useSiteInfo, DEFAULT_SITE_INFO } from "../contexts/SiteInfoContext";
import { toast } from "react-toastify";

const SLIDE_LABELS = ["Slide 1", "Slide 2", "Slide 3"];

function BusinessInfo() {
  const { siteInfo, loading, saveSiteInfo } = useSiteInfo();

  const [logoURL, setLogoURL] = useState(DEFAULT_SITE_INFO.logoURL);
  const [footerLogoURL, setFooterLogoURL] = useState(DEFAULT_SITE_INFO.footerLogoURL);
  const [slides, setSlides] = useState(DEFAULT_SITE_INFO.slides);
  const [contact, setContact] = useState(DEFAULT_SITE_INFO.contact);
  const [saving, setSaving] = useState(false);

  // Sync local state when Firestore data loads
  useEffect(() => {
    if (!loading) {
      setLogoURL(siteInfo.logoURL);
      setFooterLogoURL(siteInfo.footerLogoURL);
      setSlides(siteInfo.slides);
      setContact(siteInfo.contact);
    }
  }, [loading, siteInfo]);

  const updateSlide = (index, field, value) => {
    setSlides((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveSiteInfo({ logoURL, footerLogoURL, slides, contact });
      toast.success("Business info saved successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save business info");
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
        <h2>Business Info</h2>
        <p style={{ color: "#888", marginBottom: "24px", fontSize: "14px" }}>
          Changes are saved to the database and reflected on the website immediately.
        </p>

        {/* ── App Logo ── */}
        <h3 style={{ marginBottom: "16px", color: "#d2222d", borderBottom: "2px solid #d2222d", paddingBottom: "6px" }}>
          <i className="fa-solid fa-star" style={{ marginRight: "8px" }}></i>
          App Logo
        </h3>

        <div
          style={{
            border: "1px solid #e0e0e0",
            borderRadius: "10px",
            padding: "20px",
            marginBottom: "28px",
            background: "#fafafa",
          }}
        >
          <div className="upload-form" style={{ display: "grid", gap: "12px" }}>
            <div className="form-group">
              <label>Logo Image URL</label>
              <input
                type="text"
                value={logoURL || ""}
                onChange={(e) => setLogoURL(e.target.value)}
                placeholder="Paste logo image link here"
              />
            </div>
            {logoURL && (
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "13px", color: "#888" }}>Preview (on header):</span>
                <div style={{ background: "#ffffff", border: "1px solid #e0e0e0", borderRadius: "8px", padding: "8px 16px", display: "flex", alignItems: "center" }}>
                  <img
                    src={logoURL}
                    alt="Logo preview"
                    style={{ height: "40px", maxWidth: "150px", objectFit: "contain" }}
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Footer Logo ── */}
        <h3 style={{ marginBottom: "16px", color: "#d2222d", borderBottom: "2px solid #d2222d", paddingBottom: "6px" }}>
          <i className="fa-solid fa-star-half-stroke" style={{ marginRight: "8px" }}></i>
          Footer Logo
        </h3>

        <div
          style={{
            border: "1px solid #e0e0e0",
            borderRadius: "10px",
            padding: "20px",
            marginBottom: "28px",
            background: "#fafafa",
          }}
        >
          <div className="upload-form" style={{ display: "grid", gap: "12px" }}>
            <div className="form-group">
              <label>Footer Logo Image URL</label>
              <input
                type="text"
                value={footerLogoURL || ""}
                onChange={(e) => setFooterLogoURL(e.target.value)}
                placeholder="Paste footer logo image link here"
              />
            </div>
            {footerLogoURL && (
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "13px", color: "#888" }}>Preview (on footer):</span>
                <div style={{ background: "#d32f2f", borderRadius: "8px", padding: "8px 16px", display: "flex", alignItems: "center" }}>
                  <img
                    src={footerLogoURL}
                    alt="Footer logo preview"
                    style={{ height: "40px", maxWidth: "150px", objectFit: "contain" }}
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Hero Slides ── */}
        <h3 style={{ marginBottom: "16px", color: "#d2222d", borderBottom: "2px solid #d2222d", paddingBottom: "6px" }}>
          <i className="fa-solid fa-image" style={{ marginRight: "8px" }}></i>
          Hero Section Slides
        </h3>

        {slides.map((slide, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #e0e0e0",
              borderRadius: "10px",
              padding: "20px",
              marginBottom: "20px",
              background: "#fafafa",
            }}
          >
            <h4 style={{ marginBottom: "14px", color: "#333" }}>
              <i className="fa-solid fa-layer-group" style={{ marginRight: "6px", color: "#d2222d" }}></i>
              {SLIDE_LABELS[index]}
            </h4>

            <div className="upload-form" style={{ display: "grid", gap: "12px" }}>
              <div className="form-group">
                <label>Tagline (small top text)</label>
                <input
                  type="text"
                  value={slide.tagline}
                  onChange={(e) => updateSlide(index, "tagline", e.target.value)}
                  placeholder="e.g. HealthCare sa mily Gi"
                />
              </div>

              <div className="form-group">
                <label>Main Heading</label>
                <input
                  type="text"
                  value={slide.title}
                  onChange={(e) => updateSlide(index, "title", e.target.value)}
                  placeholder="e.g. 100% Genuine Dwaai"
                />
              </div>

              <div className="form-group">
                <label>Heading Highlight (large span)</label>
                <input
                  type="text"
                  value={slide.bigSpan}
                  onChange={(e) => updateSlide(index, "bigSpan", e.target.value)}
                  placeholder="e.g. Ab Gar Bethey!"
                />
              </div>

              <div className="form-group">
                <label>Sub Description</label>
                <input
                  type="text"
                  value={slide.subtitle}
                  onChange={(e) => updateSlide(index, "subtitle", e.target.value)}
                  placeholder="e.g. Order Your Medicines Now"
                />
              </div>

              <div className="form-group">
                <label>Button Text</label>
                <input
                  type="text"
                  value={slide.buttonText}
                  onChange={(e) => updateSlide(index, "buttonText", e.target.value)}
                  placeholder="e.g. Upto 10% OFF"
                />
              </div>

              <div className="form-group">
                <label>Slide Image URL</label>
                <input
                  type="text"
                  value={slide.imageURL || ""}
                  onChange={(e) => updateSlide(index, "imageURL", e.target.value)}
                  placeholder="Paste image link here"
                />
                {slide.imageURL && (
                  <img
                    src={slide.imageURL}
                    alt="Slide preview"
                    style={{ marginTop: "8px", width: "80px", height: "80px", objectFit: "cover", borderRadius: "6px" }}
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                )}
              </div>
            </div>
          </div>
        ))}

        {/* ── Contact Info ── */}
        <h3 style={{ margin: "28px 0 16px", color: "#d2222d", borderBottom: "2px solid #d2222d", paddingBottom: "6px" }}>
          <i className="fa-solid fa-phone" style={{ marginRight: "8px" }}></i>
          Contact Information
        </h3>

        <div
          style={{
            border: "1px solid #e0e0e0",
            borderRadius: "10px",
            padding: "20px",
            background: "#fafafa",
          }}
        >
          <div className="upload-form" style={{ display: "grid", gap: "12px" }}>
            <div className="form-group">
              <label>Phone Number 1</label>
              <input
                type="text"
                value={contact.phone1}
                onChange={(e) => setContact((prev) => ({ ...prev, phone1: e.target.value }))}
                placeholder="e.g. +06323839204"
              />
            </div>

            <div className="form-group">
              <label>Phone Number 2</label>
              <input
                type="text"
                value={contact.phone2}
                onChange={(e) => setContact((prev) => ({ ...prev, phone2: e.target.value }))}
                placeholder="e.g. +06378010848"
              />
            </div>
          </div>
        </div>

        {/* ── Save Button ── */}
        <form className="upload-form" style={{ marginTop: "28px" }} onSubmit={handleSave}>
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

export default BusinessInfo;
