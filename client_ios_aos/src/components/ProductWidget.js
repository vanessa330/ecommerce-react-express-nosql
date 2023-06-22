import React, { useContext } from "react";
import { Text, TouchableOpacity, View, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ProductImage from "./ProductImage";
import themeContext from "../themeContext";

const ProductWidget = ({ id, productName, price, quantity, picturePath }) => {
  const navigation = useNavigation();

  // CSS
  const theme = useContext(themeContext);

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={{
        backgroundColor: theme.bgDefault,
        borderRadius: 15,
        margin: 15,
      }}
      onPress={() => {
        navigation.navigate("PRODUCT DETAILS", { productId: id });
      }}
    >
      <Text
        style={{
          paddingVertical: 10,
          paddingHorizontal: 20,
          color: theme.fontDefault,
          fontSize: 20,
          fontWeight: "bold",
        }}
      >
        {productName}
      </Text>

      {picturePath && <ProductImage picturePath={picturePath} />}

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 20,
        }}
      >
        <Text
          style={{
            paddingRight: 10,
            color: theme.fontAlt,
            fontSize: 18,
            fontWeight: "bold",
          }}
        >
          $ {price.toFixed(2)}
        </Text>

        {quantity > 0 ? (
          <Text style={{ color: "green", fontSize: 18, fontWeight: "bold" }}>
            In Stock
          </Text>
        ) : (
          <Text style={{ color: "red", fontSize: 18, fontWeight: "bold" }}>
            Out Of Stock
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default ProductWidget;
