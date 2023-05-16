import { createSlice } from "@reduxjs/toolkit";

// https://redux-toolkit.js.org/api/createSlice

// useSelector()
const initialState = {
  mode: "light",
  user: null,
  token: null,
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
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
    },
    // setFollowers: (state, action) => {
    //   if (state.user) {
    //     state.user.followers = action.payload.user.followers;
    //   } else {
    //     console.error("user have no followers");
    //   }
    // },
    setFollowing: (state, action) => {
      if (state.user) {
        state.user = action.payload.user;
      } else {
        console.error("user do no have following");
      }
    },
    setProducts: (state, action) => {
      state.products = action.payload.products;
    },
    setProduct: (state, action) => {
      const updatedProducts = state.products.map((product) => {
        if (product._id === action.payload.product._id)
          return action.payload.product;
        return product;
      });
      state.products = updatedProducts;
    },
  },
});

export const {
  setMode,
  setLogin,
  setLogout,
  setFollowers,
  setFollowing,
  setProducts,
  setProduct,
} = authSlice.actions;
export default authSlice.reducer;
