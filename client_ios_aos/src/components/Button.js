import React, { useContext } from "react";
import { TouchableOpacity, Text } from "react-native";
import themeContext from "../themeContext";

const Button = ({ title, onPress = () => {} }) => {
  // CSS
  const theme = useContext(themeContext);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={{
        height: 55,
        width: "100%",
        backgroundColor: "orange",
        marginVertical: 20,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ color: theme.bgDefault, fontWeight: "bold", fontSize: 18 }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;
