import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import MyOrders from "./pages/MyOrders";
import ProductDetails from "./pages/ProductDetails";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/cart" element={<Cart />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/admin" element={<Admin />} />

        <Route
          path="/checkout" element={<Checkout />} />


        <Route path="/myorders" element={<MyOrders />}
        />
        <Route
          path="/product/:id"
          element={<ProductDetails />}
        />

      </Routes>

    </BrowserRouter>

  );

}


export default App;