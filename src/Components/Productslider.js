import React, { useEffect, useRef, useState } from "react";
import Swiper from "swiper";
import { Link } from "react-router-dom";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import { db } from "../firebase/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

// ✅ Import Cart Context
import { useCart } from "../contexts/CartContext";
import { useSale } from "../contexts/SaleContext";

// ✅ Font Awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";

function Productslider() {
  const swiperRef = useRef(null);
  const swiperInstance = useRef(null);
  const [products, setProducts] = useState([]);

  // ✅ Get addToCart from context
  const { addToCart } = useCart();
  const { sale } = useSale();

  const getDiscountedPrice = (retailPrice) => {
    if (sale.isActive && sale.discountPercent > 0 && retailPrice) {
      return Math.round(retailPrice * (1 - sale.discountPercent / 100));
    }
    return null;
  };

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);

      const productList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setProducts(productList);
    };

    fetchProducts();
  }, []);

  // Swiper
  useEffect(() => {
    if (swiperRef.current) {
      swiperInstance.current = new Swiper(swiperRef.current, {
        modules: [Autoplay, Pagination],
        slidesPerView: 3,
        spaceBetween: 30,
        loop: true,
        autoplay: {
          delay: 2500,
          disableOnInteraction: false,
        },
        pagination: {
          el: ".product-pagination",
          clickable: true,
        },
        breakpoints: {
          0: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
        },
      });
    }

    return () => {
      if (swiperInstance.current) {
        swiperInstance.current.destroy(true, true);
      }
    };
  }, [products]);

  return (
    <div className="product-section">
      {/* HEADER */}
      <div className="deals-header">
        <h2 className="deals-title">
          Today Best Deal
          <span className="highlight big-span"> For You!</span>
        </h2>
        <Link to="/products" className="see-all">
          <p>See All</p>
          <svg
            width="15"
            height="13"
            viewBox="0 0 15 13"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.8223 7.10248C14.1659 6.75882 14.1659 6.20163 13.8223 5.85797L8.22197 0.257686C7.87831 -0.0859759 7.32112 -0.085976 6.97746 0.257686C6.6338 0.601347 6.6338 1.15853 6.97746 1.50219L11.9555 6.48023L6.97746 11.4583C6.6338 11.8019 6.6338 12.3591 6.97746 12.7028C7.32112 13.0464 7.87831 13.0464 8.22197 12.7028L13.8223 7.10248ZM0 6.48022L0 7.36022L13.2 7.36023L13.2 6.48023L13.2 5.60023L0 5.60022L0 6.48022Z"
              fill="#D2222D"
            />
          </svg>
        </Link>
      </div>

      {/* SWIPER */}
      <div className="swiper product-swiper" ref={swiperRef}>
        <div className="swiper-wrapper">
          {products.map((product) => (
            <div className="swiper-slide shrink-slide" key={product.id}>
              <div className="product-card">
                <div className="card-image-box">
                  {sale.isActive && sale.discountPercent > 0 && (
                    <span className="discount-badge">{sale.discountPercent}%</span>
                  )}
                  <img src={product.picture} alt={product.name} />

                  {/* ✅ Add to cart icon button */}
                  <button
                    className="add-cart-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      const discountedPrice = getDiscountedPrice(product.retailPrice);
                      addToCart({ ...product, price: discountedPrice ?? product.price });
                    }}
                  >
                    <FontAwesomeIcon icon={faCartShopping} />
                  </button>
                </div>

                <div className="card-info">
                  <div className="rating">★ ★ ★ ★</div>
                  <h4 className="product-name">{product.name}</h4>
                  <p className="brand-name">{product.manufacturedBy}</p>

                  <div className="price-container">
                    {getDiscountedPrice(product.retailPrice) ? (
                      <>
                        <span className="new-price">Rs. {getDiscountedPrice(product.retailPrice)}</span>
                        <span className="old-price">Rs. {product.retailPrice}</span>
                      </>
                    ) : (
                      <span className="new-price">Rs. {product.price}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default Productslider;