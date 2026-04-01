// src/Pages/CheckoutPage.js
import React, { useState } from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
// import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { db } from "../firebase/firebase";
import { toast } from "react-toastify";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const provinces = [
  "Punjab", "Sindh", "Khyber Pakhtunkhwa", "Balochistan",
  "Islamabad Capital Territory", "Gilgit-Baltistan", "Azad Jammu and Kashmir"
];

const citiesByProvince = {
  Punjab: ["Lahore", "Faisalabad", "Gujranwala"],
  Sindh: ["Karachi", "Hyderabad"],
  "Khyber Pakhtunkhwa": ["Peshawar", "Abbottabad"],
  Balochistan: ["Quetta", "Gwadar"],
  "Islamabad Capital Territory": ["Islamabad"],
  "Gilgit-Baltistan": ["Gilgit", "Skardu"],
  "Azad Jammu and Kashmir": ["Muzaffarabad", "Mirpur"]
};

const CheckoutPage = () => {
  // const navigate = useNavigate();
  const { cart: cartItems, clearCart } = useCart();

  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    street: "", address2: "", city: "", region: "", postalCode: "",
    country: "Pakistan", orderNotes: "", paymentMethod: "cod"
  });

  const [shippingRate] = useState(250);
  const [showCartItems, setShowCartItems] = useState(true);

  // Calculate totals
  const itemsTotal = cartItems.length > 0
    ? cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0)
    : 0;

  const grandTotal = itemsTotal + shippingRate;

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Complete order
  const completeOrder = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      toast.error("Cart is empty!");
      return;
    }

    try {
      const orderData = {
        customerDetails: formData,
        items: cartItems,
        subtotal: itemsTotal,
        shipping: shippingRate,
        total: grandTotal,
        status: "Pending",
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "orders"), orderData);

      toast.success("Order placed successfully! 🎉");

      clearCart();

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        street: "",
        address2: "",
        city: "",
        region: "",
        postalCode: "",
        country: "Pakistan",
        orderNotes: "",
        paymentMethod: "cod"
      });

    } catch (error) {
      console.error(error);
      toast.error("Failed to place order ❌");
    }
  };
  return (
    <>
      <Header />

      <form className="checkout-wrapper" onSubmit={completeOrder}>

        {/* LEFT SIDE */}
        <div className="checkout-left">
          <h2>Customer Details</h2>
          <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleInputChange} required />
          <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleInputChange} required />
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} required />
          <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleInputChange} required />

          <h2>Delivery Address</h2>
          <input type="text" name="street" placeholder="Street Address" value={formData.street} onChange={handleInputChange} required />
          <input type="text" name="address2" placeholder="Apartment, suite, etc [Optional]" value={formData.address2} onChange={handleInputChange} />
          <select name="region" value={formData.region} onChange={handleInputChange} required>
            <option value="">Select Province</option>
            {provinces.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <select name="city" value={formData.city} onChange={handleInputChange} required>
            <option value="">Select City</option>
            {formData.region && citiesByProvince[formData.region]?.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input type="text" name="postalCode" placeholder="Postal Code" value={formData.postalCode} onChange={handleInputChange} required />
          <textarea name="orderNotes" placeholder="Order Notes (Optional)" value={formData.orderNotes} onChange={handleInputChange} />

          <h2>Payment Method</h2>
          <div className="payment-method">
            <label>
              <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === 'cod'} onChange={handleInputChange} />
              Cash on Delivery (Rs. {shippingRate})
            </label>
            <label>
              <input type="radio" name="paymentMethod" value="bank" checked={formData.paymentMethod === 'bank'} onChange={handleInputChange} />
              Bank Deposit
            </label>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="checkout-right">
          {/* Cart Items Dropdown */}
          <div className="cart-items-header" onClick={() => setShowCartItems(prev => !prev)}>
            <h2 className=".cart-list"> <span>Cart Items   </span><FontAwesomeIcon icon={showCartItems ? faChevronUp : faChevronDown} style={{ cursor: "pointer" }} /></h2>
          </div>

          {showCartItems && (
            <div className="cart-items-list">
              {cartItems.length === 0 && <p>Your cart is empty</p>}
              {cartItems.map(item => (
                <div key={item.id} className="order-item">
                  <img src={item.picture} alt={item.name} />
                  <div>
                    <p>{item.name}</p>
                    <p>Qty: {item.quantity}</p>
                    <p>Rs. {item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <h2>Order Summary</h2>
          <p>Subtotal: Rs. {itemsTotal}</p>
          <p>Shipping: Rs. {shippingRate}</p>
          <h3>Total: Rs. {grandTotal}</h3>

          <button type="submit" className="complete-order-btn">Complete Order</button>
        </div>

      </form>

      <Footer />
    </>
  );
};

export default CheckoutPage;