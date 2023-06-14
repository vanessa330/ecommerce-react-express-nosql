import { useMemo } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme.js";
import Navbar from "./components/Navbar.jsx";
import HomePage from "./scenes/homePage";
import LoginPage from "./scenes/loginPage/index.jsx";
import ProfilePage from "./scenes/profilePage/index.jsx";
import ProductDetailPage from "./scenes/productDetailPage/index.jsx";
import CartPage from "./scenes/cartPage/index.jsx";
import SearchPage from "./scenes/searchPage/index.jsx";
import SuccessPayment from "./scenes/cartPage/SuccessPayment.jsx";
import AdminPanel from "./scenes/adminPanel/index.jsx";
import ProductForm from "./scenes/adminPanel/ProductForm.jsx";
import WishlistPage from "./scenes/wishlistPage/index.jsx";

function App() {
  /* REDUX : grab the state */
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return (
    <div className="App">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Navbar />
          <Routes>
            {/* For user */}
            <Route path="/" element={<HomePage />} />
            <Route path="/auth" element={<LoginPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/cart/success" element={<SuccessPayment />} />
            {/* For admin */}
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/admin/add" element={<ProductForm />} />
            <Route path="/admin/edit/:productId" element={<ProductForm />} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
