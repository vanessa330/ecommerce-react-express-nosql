import React, { useState, useContext } from "react";
import { StyleSheet, Text, View, Switch } from "react-native";
import { EventRegister } from "react-native-event-listeners";
import { useNavigation } from "@react-navigation/native";

const MyOrder = () => {
  const navigation = useNavigation();

  // CSS
  const [mode, setMode] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      <Text>MyOrder</Text>
    </View>
  );
};

export default MyOrder;
