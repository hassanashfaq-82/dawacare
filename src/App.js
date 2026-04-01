import "./App.css";
import { Routes, Route } from "react-router-dom";
import { SiteInfoProvider } from "./contexts/SiteInfoContext";
import { SaleProvider } from "./contexts/SaleContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "./Pages/Home";
import About from "./Pages/About";
import Products from "./Pages/Products";
import ProductDetailedView from "./Pages/ProductDetailedView";
import CheckoutPage from "./Pages/CheckoutPage";
import Login from "./Pages/Login";
import ProtectedRoute from "./Components/ProtectedRoute";
// Admin panel
import Dashboard from "./AdminPanel/Dashoard";
// Cart
import Cart from "./Components/Cart";

function App() {
  return (
    <SiteInfoProvider>
    <SaleProvider>
    <div className="App">

      <ToastContainer
        position="top-right"
        autoClose={4000}
        newestOnTop
        pauseOnHover
        theme="colored"
      />

      <Routes>

        <Route
          path="/"
          element={
            <div className="website-layout">
              <Cart />
              <Home />
            </div>
          }
        />

        <Route
          path="/about"
          element={
            <div className="website-layout">
              <Cart />
              <About />
            </div>
          }
        />

        <Route
          path="/products"
          element={
            <div className="website-layout">
              <Cart />
              <Products />
            </div>
          }
        />

        <Route
          path="/product/:id"
          element={
            <div className="website-layout">
              <Cart />
              <ProductDetailedView />
            </div>
          }
        />

        <Route
          path="/checkout"
          element={
            <div className="website-layout">
              <Cart />
              <CheckoutPage />
            </div>
          }
        />

        <Route
          path="/login"
          element={
            <div className="website-layout">
              <Login />
            </div>
          }
        />

        {/* Protected Admin Route */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

      </Routes>

    </div>
    </SaleProvider>
    </SiteInfoProvider>
  );
}

export default App;