import { createSlice } from "@reduxjs/toolkit";

// https://redux-toolkit.js.org/api/createSlice

// useSelector()
const initialState = {
  mode: "light",
  token: null,
  loggedInUser: null,
  user: null,
  products: [],
  searchProducts: [],
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
      state.loggedInUser = action.payload.loggedInUser;
    },
    setLogout: (state) => {
      state.token = null;
      state.loggedInUser = null;
    },
    setLoggedInUser: (state, action) => {
      state.loggedInUser = action.payload.loggedInUser;
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
    setSearchProducts: (state, action) => {
      state.searchProducts = action.payload.searchProducts;
    },
    setCart: (state, action) => {
      state.cart = action.payload.cart;
    },
    setCartToNull: (state) => {
      state.cart = null;
      state.itemCount = 0;
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
  setLoggedInUser,
  setUser,
  setProducts,
  setProduct,
  setSearchProducts,
  setCart,
  setCartToNull,
  setItemCount,
} = authSlice.actions;
export default authSlice.reducer;
