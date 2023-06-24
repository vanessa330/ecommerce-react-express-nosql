import React, { useContext } from "react";
import { Text, TouchableOpacity, View, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { REACT_APP_SERVER_URL } from "@env";
import themeContext from "../themeContext";

const ProductWidget = ({ id, productName, price, quantity, picturePath }) => {
  const navigation = useNavigation();

  // CSS
  const theme = useContext(themeContext);

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("PRODUCT DETAILS", { productId: id });
      }}
    >
      <View
        style={{
          backgroundColor: theme.bgDefault,
          borderRadius: 15,
          marginVertical: 15,
          paddingVertical: 20,
          paddingHorizontal: 20,
        }}
      >
        <Text
          style={{
            paddingVertical: 15,
            color: theme.fontDefault,
            fontSize: 20,
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
              paddingVertical: 15,
            }}
          >
            <Image
              style={{
                width: 250,
                height: 250,
              }}
              source={{ uri: `${REACT_APP_SERVER_URL}assets/${picturePath}` }}
            />
          </View>
        )}

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingVertical: 15,
            paddingHorizontal: 15,
            backgroundColor: theme.bgDefault,
          }}
        >
          <Text
            style={{
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
      </View>
    </TouchableOpacity>
  );
};

export default ProductWidget;
