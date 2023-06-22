import React, { useContext } from "react";
import { View, Image } from "react-native";
import { REACT_APP_SERVER_URL } from "@env";
import themeContext from "../themeContext";

const ProductImage = ({ picturePath }) => {
  // CSS
  const theme = useContext(themeContext);

  return (
    <View
      style={{
        backgroundColor: theme.bgDefault,
        alignItems: "center",
        justifyContent: "center",
        weight: "100%",
      }}
    >
      {picturePath && (
        <Image
          source={{ url: `${REACT_APP_SERVER_URL}assets/${picturePath}` }}
          style={{ width: "90%", height: "80%" }}
        />
      )}
    </View>
  );
};

export default ProductImage;
