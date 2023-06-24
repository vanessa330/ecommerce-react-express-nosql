import React, { useState, useEffect, useContext } from "react";
import { Text, ScrollView, View, Image, Alert } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { setCart, setUser } from "../../state/action";
import { useRoute } from "@react-navigation/native";
import axios from "axios";
import { REACT_APP_SERVER_URL } from "@env";
import themeContext from "../../themeContext";
import { MaterialIcons } from "@expo/vector-icons";
import Button from "../../components/Button";

const ProductDetails = () => {
  const dispatch = useDispatch();

  // Product details
  const route = useRoute();
  const id = route.params?.productId;
  const [product, setProduct] = useState(null);

  // User details from Redux state
  const loggedInUserId = useSelector((state) => state.loggedInUser?._id);
  const cartId = useSelector((state) => state.cart?._id);

  // CSS
  const theme = useContext(themeContext);

  // Connect to the server
  const getProduct = async () => {
    try {
      const res = await axios.get(`${REACT_APP_SERVER_URL}products/${id}`);
      const data = res.data;

      if (res.status === 200) {
        setProduct(data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const likeProduct = async () => {
    if (!loggedInUserId) {
      Alert.alert("You must be logged in first.");
    }
    try {
      const res = await axios.patch(
        `${REACT_APP_SERVER_URL}products/${id}/like`,
        {
          userId: loggedInUserId,
        }
      );
      const data = res.data;

      if (res.status === 200) {
        setProduct(data.updatedProduct);
        dispatch(setUser(data.updatedUser));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const addItemToCart = async () => {
    try {
      const res = await axios.post(`${REACT_APP_SERVER_URL}cart/add/${id}`, {
        id: cartId,
      });
      const data = res.data;

      if (res.status === 201) {
        dispatch(setCart(data));
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getProduct();
    // eslint-disable-next-line
  }, []);

  if (!product) {
    return null;
  } else {
    const { productName, price, quantity, picturePath, description, likes } =
      product;
    const isLiked = null || Boolean(likes[loggedInUserId]);

    return (
      <ScrollView
        contentContainerStyle={{
          borderRadius: 15,
          backgroundColor: theme.bgDefault,
          paddingHorizontal: 20,
          paddingVertical: 20,
        }}
      >
        <Text
          style={{
            color: theme.fontDefault,
            fontSize: 25,
            fontWeight: "bold",
          }}
        >
          {productName}
        </Text>

        {picturePath && (
          <View
            style={{
              backgroundColor: theme.bgDefault,
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 20,
            }}
          >
            <Image
              style={{
                width: 300,
                height: 280,
              }}
              source={{
                uri: `${REACT_APP_SERVER_URL}assets/${picturePath}`,
              }}
            />
          </View>
        )}

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 20,
            paddingVertical: 15,
          }}
        >
          <Text
            style={{
              color: theme.fontDefault,
              fontSize: 18,
              fontWeight: 500,
            }}
          >
            Price :
          </Text>
          <Text
            style={{
              color: theme.fontAlt,
              fontSize: 18,
              fontWeight: 500,
            }}
          >
            $ {price.toFixed(2)}
          </Text>
        </View>

        <View
          style={{
            paddingHorizontal: 20,
            paddingVertical: 15,
          }}
        >
          <Text
            style={{
              color: theme.fontDefault,
              fontSize: 18,
              fontWeight: 500,
              paddingVertical: 15,
            }}
          >
            Description :
          </Text>
          <Text
            style={{
              color: theme.fontAlt,
              fontSize: 18,
            }}
          >
            {description}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: theme.bgDefault,
            paddingHorizontal: 20,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: theme.bgDefault,
            }}
          >
            {isLiked ? (
              <MaterialIcons
                name="favorite"
                size={28}
                color="orange"
                onPress={likeProduct}
              />
            ) : (
              <MaterialIcons
                name="favorite-border"
                size={28}
                color="orange"
                onPress={likeProduct}
              />
            )}

            <Text
              style={{
                color: theme.fontAlt,
                fontSize: 18,
                fontWeight: 500,
                paddingHorizontal: 15,
              }}
            >
              {Object.keys(likes).length}
            </Text>
          </View>
        </View>

        <View
          style={{
            backgroundColor: theme.bgDefault,
            paddingHorizontal: 20,
            paddingVertical: 20,
          }}
        >
          {quantity > 0 ? (
            <Button title="ADD TO CART" onPress={addItemToCart} />
          ) : (
            <Text
              style={{
                color: "red",
                fontSize: 18,
                fontWeight: "bold",
              }}
            >
              Out Of Stock
            </Text>
          )}
        </View>
      </ScrollView>
    );
  }
};

export default ProductDetails;
