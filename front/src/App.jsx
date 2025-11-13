import { Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar.jsx";
import Title from "./components/Title.jsx";
import Login from "./pages/Login.jsx";
import Logout from "./pages/Logout.jsx";
import Register from "./pages/Register.jsx";
import Products from "./pages/Products.jsx";
import AddProduct from "./pages/AddProduct.jsx";
import DeleteProduct from "./pages/DeleteProduct.jsx";
import UpdateProduct from "./pages/UpdateProduct.jsx";
import Profile from "./pages/Profile.jsx";
import ControlPanel from "./pages/ControlPanel.jsx";
import CartInfo from "./pages/CartInfo.jsx";
import ProductInfo from "./pages/ProductInfo.jsx";

function App() {
    return (
        <>
            <Navbar />

            <Routes>
                <Route path="/" element={<Title title="FastSells" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/register" element={<Register />} />
                <Route path="/products" element={<Products />} />
                <Route path="/add-product" element={<AddProduct />} />
                <Route path="/delete-product" element={<DeleteProduct />} />
                <Route path="/update-product" element={<UpdateProduct />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/control-panel" element={<ControlPanel />} />
                <Route path="/carts/:cartId" element={<CartInfo />} />
                <Route path="/products/:productId" element={<ProductInfo />} />
            </Routes>
        </>
    );
}

export default App;
