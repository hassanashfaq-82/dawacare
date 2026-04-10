import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link, useSearchParams } from "react-router-dom";
import { db } from "../firebase/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { useCart } from "../contexts/CartContext";
import { useSale } from "../contexts/SaleContext";

const Products = () => {
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();
  const { sale } = useSale();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";

  const getDiscountedPrice = (retailPrice) => {
    if (sale.isActive && sale.discountPercent > 0 && retailPrice) {
      return Math.round(retailPrice * (1 - sale.discountPercent / 100));
    }
    return null;
  };

  useEffect(() => {
    const productsRef = collection(db, "products");
    const q = query(productsRef, orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const productsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productsData);
    }, (error) => {
      console.error("Error fetching products:", error);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <Header />

      <div className="content" style={{ margin: "100px 0px" }}>
        <h1
          style={{
            textAlign: "center",
            margin: "30px 0px",
            fontSize: "42px",
            color: "#d2222d",
          }}
        >
          {searchQuery ? `Results for "${searchQuery}"` : "OUR ALL PRODUCTS"}
        </h1>

        <div className="products-container">
          {products.filter(p =>
            !searchQuery || p.name?.toLowerCase().includes(searchQuery.toLowerCase())
          ).map((product) => (
            <Link
              to={`/product/${product.id}`}   // ✅ ONLY CHANGE
              style={{ textDecoration: "none" }}
              key={product.id}
            >
              <div className="product-card">
                <div className="card-image-box">
                  {sale.isActive && sale.discountPercent > 0 && (
                    <span className="discount-badge">{sale.discountPercent}%</span>
                  )}
                  <img src={product.picture} alt={product.name} />
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

                  {product.isOutOfStock ? (
                    <button className="add-to-cart-btn add-to-cart-btn--oos" disabled>
                      Out of Stock
                    </button>
                  ) : (
                    <button
                      className="add-to-cart-btn"
                      onClick={(e) => {
                        e.preventDefault();
                        const discountedPrice = getDiscountedPrice(product.retailPrice);
                        addToCart({ ...product, price: discountedPrice ?? product.price });
                      }}
                    >
                      Add To Cart
                    </button>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Products;