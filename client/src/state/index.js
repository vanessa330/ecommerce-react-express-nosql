import { createSlice } from "@reduxjs/toolkit";

// https://redux-toolkit.js.org/api/createSlice

// useSelector()
const initialState = {
  mode: "light",
  token: null,
  user: null,
  products: [],
  cart: null,
  itemCount: 0,
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
    setCart: (state, action) => {
      state.cart = action.payload.cart;
    },
    setItemCount: (state, action) => {
      const items = action.payload.items;
      let totalCount = 0;
      for (let i = 0; i < items.length; i++) {
        totalCount += items[i].quantity;
      }
      state.itemCount = totalCount;
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
  setCart,
  setItemCount,
} = authSlice.actions;
export default authSlice.reducer;
