import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { db } from "../firebase/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

import { useCart } from "../contexts/CartContext";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";

function FeatureProducts() {
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);

      const productList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setProducts(productList);
    };

    fetchProducts();
  }, []);

  return (
    <div className="product-section">

      {/* Header */}
      <div className="deals-header">
        <h2 className="deals-title">
          Feature <span className="big-span highlight">Products</span>
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

      {/* Products Grid */}
      <div className="products-grid">
        {products.map((product) => (
          <div className="product-card" key={product.id}>

            <div className="card-image-box">
              <span className="discount-badge">{product.discount}</span>
              <img src={product.productImage} alt={product.productName} />

              <button
                className="add-cart-btn"
                onClick={(e) => {
                  e.preventDefault();
                  addToCart(product);
                }}
              >
                <FontAwesomeIcon icon={faCartShopping} />
              </button>
            </div>

            <div className="card-info">
              <div className="rating">★ ★ ★ ★</div>
              <h4 className="product-name">{product.productName}</h4>
              <p className="brand-name">{product.brandName}</p>

              <div className="price-container">
                <span className="new-price">Rs. {product.newPrice}</span>
                <span className="old-price">Rs. {product.oldPrice}</span>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}

export default FeatureProducts;
