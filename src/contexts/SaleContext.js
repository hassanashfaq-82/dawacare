// src/contexts/SaleContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import { doc, onSnapshot, setDoc } from "firebase/firestore";

const SaleContext = createContext(null);

export const DEFAULT_SALE = {
  isActive: false,
  discountPercent: 0,
  label: "",
  startDate: "",
  endDate: "",
};

export function SaleProvider({ children }) {
  const [sale, setSale] = useState(DEFAULT_SALE);
  const [saleLoading, setSaleLoading] = useState(true);

  useEffect(() => {
    const ref = doc(db, "siteSettings", "saleInfo");
    const unsubscribe = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        setSale({ ...DEFAULT_SALE, ...snap.data() });
      } else {
        setSale(DEFAULT_SALE);
      }
      setSaleLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const saveSale = async (newSale) => {
    const ref = doc(db, "siteSettings", "saleInfo");
    await setDoc(ref, newSale, { merge: true });
  };

  // Compute effective discount label e.g. "15% OFF"
  const discountLabel = sale.isActive && sale.discountPercent > 0
    ? `${sale.discountPercent}% OFF`
    : "";

  return (
    <SaleContext.Provider value={{ sale, saleLoading, saveSale, discountLabel }}>
      {children}
    </SaleContext.Provider>
  );
}

export function useSale() {
  return useContext(SaleContext);
}
