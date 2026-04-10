import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { useCart } from "../contexts/CartContext";
import { useSale } from "../contexts/SaleContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import FeatureProducts from "../components/FeatureProducts";

const ProductDetailedView = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { sale } = useSale();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const getDiscountedPrice = (retailPrice) => {
    if (sale.isActive && sale.discountPercent > 0 && retailPrice) {
      return Math.round(retailPrice * (1 - sale.discountPercent / 100));
    }
    return null;
  };

  useEffect(() => {
    // Reset state when product changes
    window.scrollTo({ top: 0, behavior: "smooth" });
    setQuantity(1);

    const docRef = doc(db, "products", id);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setProduct({ id: docSnap.id, ...docSnap.data() });
      }
    }, (error) => {
      console.error("Error fetching product detail:", error);
    });

    return () => unsubscribe();
  }, [id]);

  if (!product) return <h2>Loading...</h2>;

  return (
    <>
      <Header />

      <div className="product-detail-container" style={{ marginTop: "100px" }}>
        {/* LEFT IMAGE */}
        <div className="product-detail-left">
          <img src={product.picture} alt={product.name} />
        </div>

        {/* RIGHT INFO */}
        <div className="product-detail-right">
          <h1>{product.name}</h1>
          <h3 className="brand">Manufactured By: {product.manufacturedBy}</h3>

          {(() => {
            const discountedPrice = getDiscountedPrice(product.retailPrice);
            return discountedPrice ? (
              <div className="price">
                <span className="new-price">Rs. {discountedPrice}</span>
                <span className="old-price">Rs. {product.retailPrice}</span>
              </div>
            ) : (
              <p className="price">Rs. {product.retailPrice || product.price}</p>
            );
          })()}

          {/* Medicine Specific Info */}
          <div className="medicine-info">
            {product.formula && <p><strong>Formula:</strong> {product.formula}</p>}
            {product.type && <p><strong>Type:</strong> {product.type}</p>}
            {product.quantityPerPack > 0 && <p><strong>Quantity (Tabs/Pack):</strong> {product.quantityPerPack}</p>}
          </div>

          {/* Description */}
          <div className="description">
            <h4>Description</h4>
            <p>{product.description}</p>
          </div>

          {/* Usage Instructions */}
          <div className="usage">
            <h4>Usage Instructions</h4>
            <p>{product.usage}</p>
          </div>

          {/* Quantity */}
          {!product.isOutOfStock && (
            <div className="quantity-box">
              <button
                onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
              >
                -
              </button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>
          )}

          {/* Add To Cart */}
          {product.isOutOfStock ? (
            <div className="product-oos-banner">
              <span className="product-oos-icon">⚠</span>
              <span>This product is currently <strong>Out of Stock</strong>. Please check back later.</span>
            </div>
          ) : (
            <button
              className="add-to-cart-btn"
              onClick={() => {
                const discountedPrice = getDiscountedPrice(product.retailPrice);
                addToCart({ ...product, price: discountedPrice ?? product.price, quantity });
              }}
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>

      <FeatureProducts />
      <Footer />
    </>
  );
};

export default ProductDetailedView;