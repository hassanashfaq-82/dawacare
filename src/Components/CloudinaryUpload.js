// src/components/CloudinaryUpload.js
// Reusable Cloudinary image uploader.
// Props:
//   value       – current image URL (string)
//   onChange    – called with the new URL string after upload
//   label       – field label text  (default: "Image")
//   required    – shows * on label  (default: false)
//   previewStyle – extra style object applied to the preview <img>
//   previewShape – "square" | "circle" | "wide"  (default: "square")
//   id          – unique id for the file input (required when using multiple on same page)

import React, { useRef, useState } from "react";

const CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

function CloudinaryUpload({
  value = "",
  onChange,
  label = "Image",
  required = false,
  previewStyle = {},
  previewShape = "square",
  id = "cloudinary-upload",
}) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);

  const uploadFile = async (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    setUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      // Use XMLHttpRequest to track progress
      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(
          "POST",
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`
        );

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            setProgress(Math.round((e.loaded / e.total) * 100));
          }
        };

        xhr.onload = () => {
          if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            onChange(data.secure_url);
            resolve();
          } else {
            reject(new Error("Upload failed"));
          }
        };

        xhr.onerror = () => reject(new Error("Network error"));
        xhr.send(formData);
      });
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      alert("Image upload failed. Please check your Cloudinary config in .env");
    } finally {
      setUploading(false);
      setProgress(0);
      // Reset input so the same file can be re-selected if needed
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleFileChange = (e) => {
    uploadFile(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    uploadFile(file);
  };

  const handleRemove = () => {
    onChange("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const shapeClass =
    previewShape === "circle"
      ? "cu-preview-circle"
      : previewShape === "wide"
      ? "cu-preview-wide"
      : "cu-preview-square";

  return (
    <div className="cu-wrapper">
      {/* Label */}
      <label className="cu-label" htmlFor={id}>
        {label}
        {required && <span className="cu-required">*</span>}
      </label>

      {/* Drop zone / trigger area */}
      <div
        className={`cu-dropzone${dragOver ? " cu-dropzone-active" : ""}${uploading ? " cu-dropzone-uploading" : ""}`}
        onClick={() => !uploading && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && !uploading && inputRef.current?.click()}
      >
        {uploading ? (
          <div className="cu-uploading">
            <i className="fa-solid fa-spinner fa-spin cu-spin-icon"></i>
            <span className="cu-uploading-text">Uploading… {progress}%</span>
            <div className="cu-progress-bar">
              <div className="cu-progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        ) : value ? (
          <div className="cu-has-image">
            <img
              src={value}
              alt="Uploaded preview"
              className={`cu-preview-img ${shapeClass}`}
              style={previewStyle}
              onError={(e) => { e.target.style.display = "none"; }}
            />
            <div className="cu-image-actions">
              <span className="cu-change-hint">
                <i className="fa-solid fa-arrow-up-from-bracket"></i> Replace
              </span>
              <button
                type="button"
                className="cu-remove-btn"
                onClick={(e) => { e.stopPropagation(); handleRemove(); }}
                title="Remove image"
              >
                <i className="fa-solid fa-trash"></i>
              </button>
            </div>
          </div>
        ) : (
          <div className="cu-empty">
            <i className="fa-solid fa-cloud-arrow-up cu-upload-icon"></i>
            <span className="cu-upload-text">Click to upload or drag & drop</span>
            <span className="cu-upload-hint">PNG, JPG, WEBP, SVG supported</span>
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </div>
  );
}

export default CloudinaryUpload;
