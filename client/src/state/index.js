import { createSlice } from "@reduxjs/toolkit";

// https://redux-toolkit.js.org/api/createSlice

// useSelector()
const initialState = {
  mode: "light",
  token: null,
  user: null,
  products: [],
};

// useDispatch()
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setLogin: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    setLogout: (state) => {
      state.token = null;
      state.user = null;
    },
    setUser: (state, action) => {
      state.user = action.payload.user;
    },
    setProducts: (state, action) => {
      state.products = action.payload.products;
    },
    setProduct: (state, action) => {
      const updatedProducts = state.products.map((p) => {
        if (p._id === action.payload.product._id) return action.payload.product;
        return p;
      });
      state.products = updatedProducts;
    },
  },
});

export const {
  setMode,
  setLogin,
  setLogout,
  setUser,
  setProducts,
  setProduct,
} = authSlice.actions;
export default authSlice.reducer;
