import React, { useContext, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import themeContext from "../themeContext";
import { TextInput } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const Input = ({ label, error, password, onFocus = () => {}, ...props }) => {
  // CSS
  const theme = useContext(themeContext);
  const [isFocused, setIsFocused] = useState(false);
  const [hidePassword, setHidePassword] = useState(password);

  return (
    <View style={{ marginBottom: 20, backgroundColor: theme.bgDefault }}>
      <Text
        style={{
          marginVertical: 5,
          fontSize: 14,
          color: theme.fontAlt,
        }}
      >
        {label}
      </Text>

      <View
        style={[
          { backgroundColor: theme.bgAlt },
          { flexDirection: "row" },
          { alignContent: "center" },
          { borderBottomColor: isFocused ? "orange" : theme.bgAlt },
        ]}
      >
        <TextInput
          {...props}
          autoCorrect={false}
          onFocus={() => {
            onFocus();
            setIsFocused(true);
          }}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={hidePassword}
          style={{
            color: theme.fontDefault,
            backgroundColor: theme.bgAlt,
            flex: 1,
            borderBottomColor: isFocused ? "orange" : theme.bgAlt,
          }}
        />

        {password && (
          <Icon
            onPress={() => setHidePassword(!hidePassword)}
            name={hidePassword ? "eye-outline" : "eye-off-outline"}
            style={{
              fontSize: 22,
              color: theme.fontAlt,
              paddingVertical: 15,
            }}
          />
        )}
      </View>
    </View>
  );
};

export default Input;
