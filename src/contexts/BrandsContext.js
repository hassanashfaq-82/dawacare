// src/contexts/BrandsContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import { doc, onSnapshot, setDoc } from "firebase/firestore";

const BrandsContext = createContext(null);

export function BrandsProvider({ children }) {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ref = doc(db, "siteSettings", "brands");
    const unsubscribe = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setBrands(Array.isArray(data.brands) ? data.brands : []);
      } else {
        setBrands([]);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const saveBrands = async (newBrands) => {
    const ref = doc(db, "siteSettings", "brands");
    await setDoc(ref, { brands: newBrands }, { merge: true });
  };

  return (
    <BrandsContext.Provider value={{ brands, loading, saveBrands }}>
      {children}
    </BrandsContext.Provider>
  );
}

export function useBrands() {
  return useContext(BrandsContext);
}
