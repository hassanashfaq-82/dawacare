// src/components/Cart.js
import React from "react";
import { useCart } from "../contexts/CartContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faTrash,
  faCartShopping,
  faCircleMinus,
  faCirclePlus,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

function Cart() {
  const {
    cart,
    removeFromCart,
    clearCart,
    increaseQuantity,
    decreaseQuantity,
    totalQuantity,
    totalPrice,
    isCartOpen,
    setIsCartOpen,
  } = useCart();

  return (
    <>
      {/* Overlay */}
      {isCartOpen && (
        <div
          className="cart-overlay active"
          onClick={() => setIsCartOpen(false)}
        ></div>
      )}

      <div className={`cart-drawer ${isCartOpen ? "open" : ""}`}>
        {/* Header */}
        <div className="cart-header">
          <h3>
            <FontAwesomeIcon icon={faCartShopping} /> Your Cart ({totalQuantity})
          </h3>
          <button className="close-btn" onClick={() => setIsCartOpen(false)}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="empty-cart-wrapper">
            <div className="empty-cart-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="60"
                height="60"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#d2222d"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4z"
                />
              </svg>
            </div>
            <p className="empty-cart">Your cart is empty!</p>
            <small>Add products to get started.</small>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="cart-items">
              {cart.map((item) => (
                <div className="cart-item" key={item.id}>
                  <img src={item.picture} alt={item.name} />

                  <div className="cart-item-info">
                    <h4>{item.name}</h4>
                    <p className="cart-item-price">
                      Rs. {item.price}
                    </p>

                    {/* Quantity Controls */}
                    <div className="cart-qty-controls">
                      <button
                        className="cart-qty-btn"
                        onClick={() => decreaseQuantity(item.id)}
                        title="Decrease"
                      >
                        <FontAwesomeIcon icon={faCircleMinus} />
                      </button>
                      <span className="cart-qty-value">{item.quantity}</span>
                      <button
                        className="cart-qty-btn"
                        onClick={() => increaseQuantity(item.id)}
                        title="Increase"
                      >
                        <FontAwesomeIcon icon={faCirclePlus} />
                      </button>
                    </div>
                  </div>

                  <div className="cart-item-right">
                    <p className="cart-item-subtotal">
                      Rs. {item.price * item.quantity}
                    </p>
                    <button
                      className="remove-btn"
                      onClick={() => removeFromCart(item.id)}
                      title="Remove item"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="cart-summary">
              <div className="cart-summary-row">
                <span>Total Items</span>
                <span>{totalQuantity}</span>
              </div>
              <div className="cart-summary-row total">
                <span>Total Price</span>
                <span>Rs. {totalPrice}</span>
              </div>

              <button className="clear-btn" onClick={clearCart}>
                <FontAwesomeIcon icon={faTrash} /> Remove All
              </button>

              <Link
                to="/checkout"
                className="checkout-btn"
                onClick={() => setIsCartOpen(false)}
              >
                Proceed to Checkout
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Cart;
