export const SET_LOGIN = "SET_LOGIN";
export const SET_LOGOUT = "SET_LOGOUT";
export const SET_USER = "SET_USER";
export const SET_CART = "SET_CART";
export const SET_ITEM_COUNT = "SET_ITEM_COUNT";

export const setLogin = (data) => ({
  type: SET_LOGIN,
  payload: data,
});

export const setLogout = (data) => ({
  type: SET_LOGOUT,
  payload: data,
});

export const setUser = (data) => ({
  type: SET_USER,
  payload: data,
});

export const setCart = (data) => ({
  type: SET_CART,
  payload: data,
});

export const setItemCount = (data) => {
  const items = data.items;

  let totalCount = 0;
  for (let i = 0; i < items.length; i++) {
    totalCount += items[i].quantity;
  }

  return {
    type: SET_ITEM_COUNT,
    payload: totalCount,
  };
};
