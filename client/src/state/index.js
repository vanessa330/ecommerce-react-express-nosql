import { createSlice } from "@reduxjs/toolkit";

// https://redux-toolkit.js.org/api/createSlice

// useSelector()
const initialState = {
  mode: "light",
  token: null,
  loggedInUser: null,
  productIds: [],
  cart: null,
  itemCount: 0,
  searchProducts: [],
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
    setProductIds: (state, action) => {
      state.productIds = action.payload.productIds;
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
  setProductIds,
  setSearchProducts,
  setCart,
  setCartToNull,
  setItemCount,
} = authSlice.actions;
export default authSlice.reducer;
