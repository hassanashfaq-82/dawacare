// src/Components/SaleMarquee.js
import React from "react";
import { useSale } from "../contexts/SaleContext";

function SaleMarquee() {
  const { sale, saleLoading } = useSale();

  // Don't render if no active sale or still loading
  if (saleLoading || !sale.isActive || !sale.discountPercent) return null;

  const formattedStart = sale.startDate
    ? new Date(sale.startDate).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })
    : null;
  const formattedEnd = sale.endDate
    ? new Date(sale.endDate).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })
    : null;

  const saleTitle = sale.label || "Special Sale";
  const discountText = `${sale.discountPercent}% OFF`;

  // Build the marquee item text
  const item = (
    <span className="marquee-item">
      <i className="fa-solid fa-tag marquee-icon"></i>
      <strong>{saleTitle}</strong>
      &nbsp;—&nbsp;
      <span className="marquee-discount">{discountText}</span>
      {formattedStart && formattedEnd && (
        <span className="marquee-dates">
          &nbsp;·&nbsp;{formattedStart} — {formattedEnd}
        </span>
      )}
      <span className="marquee-sep">✦</span>
    </span>
  );

  // Repeat items to fill the marquee track
  const items = Array.from({ length: 8 }, (_, i) => (
    <React.Fragment key={i}>{item}</React.Fragment>
  ));

  return (
    <div className="sale-marquee-bar">
      <div className="marquee-track">
        <div className="marquee-content">
          {items}
        </div>
        <div className="marquee-content" aria-hidden="true">
          {items}
        </div>
      </div>
    </div>
  );
}

export default SaleMarquee;
