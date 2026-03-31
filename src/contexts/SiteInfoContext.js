// src/contexts/SiteInfoContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import { doc, onSnapshot, setDoc } from "firebase/firestore";

const SiteInfoContext = createContext(null);

export const DEFAULT_SITE_INFO = {
  logoURL: "/assets/Images/Frame 8.png",
  footerLogoURL: "/assets/Images/footer logo.png",
  slides: [
    {
      tagline: "HealthCare sa mily Gi",
      title: "100% Genuine Dwaai",
      bigSpan: "Ab Gar Bethey!",
      subtitle: "Order Your Medicines Now",
      buttonText: "Upto 10% OFF",
      imageURL: "/assets/Images/steptodown.com322394 2.png",
    },
    {
      tagline: "HealthCare sa mily Gi",
      title: "100% Genuine Dwaai",
      bigSpan: "Ab Gar Bethey!",
      subtitle: "Order Your Medicines Now",
      buttonText: "Upto 10% OFF",
      imageURL: "/assets/Images/steptodown.com322394 2.png",
    },
    {
      tagline: "Fast & Reliable Delivery",
      title: "Your Health,",
      bigSpan: "Our Priority!",
      subtitle: "Get Medicines Delivered in 24hrs",
      buttonText: "Shop Now",
      imageURL: "/assets/Images/steptodown.com322394 2.png",
    },
  ],
  contact: {
    phone1: "+06323839204",
    phone2: "+06378010848",
  },
};

export function SiteInfoProvider({ children }) {
  const [siteInfo, setSiteInfo] = useState(DEFAULT_SITE_INFO);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ref = doc(db, "siteSettings", "businessInfo");
    const unsubscribe = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setSiteInfo({
          logoURL: data.logoURL || DEFAULT_SITE_INFO.logoURL,
          footerLogoURL: data.footerLogoURL || DEFAULT_SITE_INFO.footerLogoURL,
          slides: data.slides || DEFAULT_SITE_INFO.slides,
          contact: data.contact || DEFAULT_SITE_INFO.contact,
        });
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const saveSiteInfo = async (newInfo) => {
    const ref = doc(db, "siteSettings", "businessInfo");
    await setDoc(ref, newInfo, { merge: true });
  };

  return (
    <SiteInfoContext.Provider value={{ siteInfo, loading, saveSiteInfo }}>
      {children}
    </SiteInfoContext.Provider>
  );
}

export function useSiteInfo() {
  return useContext(SiteInfoContext);
}
