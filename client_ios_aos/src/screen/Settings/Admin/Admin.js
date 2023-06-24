import React, { useState, useContext } from "react";
import { StyleSheet, Text, View, Switch } from "react-native";
import { EventRegister } from "react-native-event-listeners";
import { useNavigation } from "@react-navigation/native";

const Admin = () => {
  const navigation = useNavigation();

  // CSS
  const [mode, setMode] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      <Text style={{ padding: 20 }}>Admin</Text>
    </View>
  );
};

export default Admin;
