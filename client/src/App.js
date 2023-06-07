import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme.js";
import HomePage from "./scenes/homePage";
import LoginPage from "./scenes/loginPage/index.jsx";
import ProfilePage from "./scenes/profilePage/index.jsx";
import ProductInfoPage from "./scenes/productInfoPage/index.jsx";
import CartPage from "./scenes/cartPage/index.jsx";
import ManageAccountPage from "./scenes/manageAccountPage/index.jsx";
import ProductFormPage from "./scenes/manageAccountPage/ProductFormPage.jsx";

function App() {
  /* REDUX : grab the state */
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return (
    <div className="App">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path="/auth" element={<LoginPage />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/profile/:userId" element={<ProfilePage />} />
            <Route path="/product/:id" element={<ProductInfoPage />} />
            <Route path="/manage" element={<ManageAccountPage />} />
            <Route path="/productform" element={<ProductFormPage />} />
            <Route path="/productform/:productId" element={<ProductFormPage />} />
            <Route path="/cart" element={<CartPage />} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
