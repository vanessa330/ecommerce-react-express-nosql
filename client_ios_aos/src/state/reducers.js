import {
  SET_LOGIN,
  SET_LOGOUT,
  SET_USER,
  SET_CART,
  SET_ITEM_COUNT,
} from "./action";

const initialState = {
  token: null,
  loggedInUser: null,
  cart: null,
  itemCount: 0,
};

function authReducer(state = initialState, action) {
  switch (action.type) {
    case SET_LOGIN:
      return {
        ...state,
        token: action.payload.token,
        loggedInUser: action.payload.loggedInUser,
      };
    case SET_LOGOUT:
      return {
        ...state,
        token: null,
        loggedInUser: null,
      };
    case SET_USER:
      return {
        ...state,
        loggedInUser: action.payload,
      };
    case SET_CART:
      return {
        ...state,
        cart: action.payload,
      };
    case SET_ITEM_COUNT:
      return {
        ...state,
        itemCount: action.payload,
      };
    default:
      return state;
  }
}

export default authReducer;
