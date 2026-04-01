import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useCart } from "../contexts/CartContext";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import FeatureProducts from "../Components/FeatureProducts";

const ProductDetailedView = () => {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      const docRef = doc(db, "products", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setProduct({ id: docSnap.id, ...docSnap.data() });
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) return <h2>Loading...</h2>;

  return (
    <>
      <Header />

      <div style={{ margin: "100px 0px" }} className="product-detail-container">
        {/* LEFT IMAGE */}
        <div className="product-detail-left">
          <img src={product.picture} alt={product.name} />
        </div>

        {/* RIGHT INFO */}
        <div className="product-detail-right">
          <h1>{product.name}</h1>
          <h3 className="brand">Manufactured By: {product.manufacturedBy}</h3>

          <p className="price">Rs. {product.price}</p>

          {/* Medicine Specific Info */}
          <div className="medicine-info">
            {product.formula && <p><strong>Formula:</strong> {product.formula}</p>}
            {product.type && <p><strong>Type:</strong> {product.type}</p>}
            {product.quantityPerPack > 0 && <p><strong>Quantity (Tabs/Pack):</strong> {product.quantityPerPack}</p>}
            {product.discounts && <p><strong>Discounts:</strong> {product.discounts}</p>}
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
          <div className="quantity-box">
            <button
              onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
            >
              -
            </button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)}>+</button>
          </div>

          {/* Add To Cart */}
          <button
            className="add-to-cart-btn"
            onClick={() => addToCart({ ...product, quantity })}
          >
            Add to Cart
          </button>
        </div>
      </div>

      <FeatureProducts />
      <Footer />
    </>
  );
};

export default ProductDetailedView;