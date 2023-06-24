import React, { useEffect, useContext, useMemo } from "react";
import { Text, ScrollView, SafeAreaView, View } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { setCart, setItemCount } from "../../state/action";
import axios from "axios";
import { REACT_APP_SERVER_URL } from "@env";
import themeContext from "../../themeContext";
import Button from "../../components/Button";
import CartItems from "./CartItem";

const Cart = () => {
  const dispatch = useDispatch();

  // User details from Redux state
  const loggedInUserId = useSelector((state) => state.loggedInUser?._id);

  // Cart details from Redux state
  const cart = useSelector((state) => state.cart);
  const cartId = cart ? cart._id : "";
  const items = cart ? cart.items : [];

  // CSS
  const theme = useContext(themeContext);

  const getCart = async () => {
    try {
      const res = await axios.get(`${REACT_APP_SERVER_URL}cart/${cartId}`);

      const data = res.data;
      if (res.status === 200) {
        dispatch(setCart(data));
        dispatch(setItemCount(data));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const updatedCartUserId = async () => {
    try {
      const res = await axios.patch(`${REACT_APP_SERVER_URL}cart/${cartId}`, {
        userId: loggedInUserId,
      });

      if (res.status === 200) {
        dispatch(setCart(data));
        dispatch(setItemCount(data));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const checkOut = async () => {
    try {
      // const res = await axios.post(
      //   `${REACT_APP_SERVER_URL}create-checkout-session`,
      //   {
      //     id: cart._id,
      //     userId: loggedInUserId || "",
      //   }
      // );
      // if (res.status === 303) {
      //   navigation.navigate("HOME");
      //   getCart();
      // }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getCart();
    if (loggedInUserId) updatedCartUserId();
    // eslint-disable-next-line
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.bgDefault,
        paddingHorizontal: 20,
      }}
    >
      <ScrollView>
        {!items ? (
          <Text
            style={{
              paddingVertical: 10,
              paddingHorizontal: 20,
              color: theme.fontDefault,
              fontSize: 15,
            }}
          >
            Your wishlist is empty...
          </Text>
        ) : (
          <>
            {items.map((item) => {
              return (
                <CartItems
                  key={item.productId}
                  productId={item.productId}
                  productName={item.productName}
                  quantity={item.quantity}
                  price={item.price}
                  total={item.total}
                  // picturePath={item.picturePath}
                />
              );
            })}
            <Button title="CHECKOUT" onPress={checkOut} />
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default Cart;
