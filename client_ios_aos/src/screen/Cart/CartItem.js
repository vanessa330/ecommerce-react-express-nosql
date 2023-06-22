import React, { useContext } from "react";
import { Text, View } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { setCart, setItemCount } from "../../state/action";
import axios from "axios";
import { REACT_APP_SERVER_URL } from "@env";
import themeContext from "../../themeContext";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";

const CartItem = ({
  productId,
  productName,
  quantity,
  price,
  total,
  // picturePath,
}) => {
  const dispatch = useDispatch();

  // Cart details from Redux state
  const cart = useSelector((state) => state.cart);
  const cartId = cart ? cart._id : "";

  // CSS
  const theme = useContext(themeContext);

  const addItemToCart = async () => {
    try {
      const res = await axios.post(
        `${REACT_APP_SERVER_URL}cart/add/${productId}`,
        {
          id: cartId,
        }
      );
      const data = res.json();
      console.log(data)

      if (res.status === 201) {
        dispatch(setCart(data));
        dispatch(setItemCount(data));
        handleUpdateCart();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const subtractItem = async () => {
    try {
      const res = await axios.patch(
        `${REACT_APP_SERVER_URL}cart/subtract/${productId}`,
        {
          id: cartId,
        }
      );
      const data = res.json();

      if (res.status === 200) {
        dispatch(setCart(data));
        dispatch(setItemCount(data));
        handleUpdateCart();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View
      style={{
        backgroundColor: theme.bgAlt,
        borderRadius: 8,
        paddingVertical: 15,
        paddingHorizontal: 15,
        marginVertical: 10,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: theme.bgAlt,
          paddingVertical: 10,
        }}
      >
        <Text
          style={{
            color: theme.fontDefault,
            fontSize: 18,
            fontWeight: "bold",
          }}
        >
          {productName}
        </Text>

        <Text
          style={{
            color: theme.fontAlt,
            fontSize: 13,
            fontWeight: "bold",
          }}
        >
          ${price.toFixed(2)} / unit
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: theme.bgAlt,
          paddingVertical: 10,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: theme.bgAlt,
            paddingHorizontal: 10,
          }}
        >
          <FontAwesome
            name="minus-circle"
            size={24}
            color="orange"
            onPress={subtractItem}
          />
          <Text
            style={{
              color: theme.fontAlt,
              fontSize: 20,
              fontWeight: "bold",
              paddingHorizontal: 20,
            }}
          >
            {quantity}
          </Text>
          <Ionicons
            name="md-add-circle"
            size={24}
            color="orange"
            onPress={addItemToCart}
          />
        </View>
        <Text
          style={{
            color: theme.fontDefault,
            fontSize: 18,
            fontWeight: "bold",
          }}
        >
          $ {total.toFixed(2)}
        </Text>
      </View>
    </View>
  );
};

export default CartItem;
