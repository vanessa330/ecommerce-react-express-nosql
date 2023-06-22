import React, { useState, useContext } from "react";
import { Text, View, Switch, SafeAreaView } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { setLogout } from "../../state/action";
import { useNavigation } from "@react-navigation/native";
import { EventRegister } from "react-native-event-listeners";
import themeContext from "../../themeContext";

const Settings = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  // User details from Redux state
  const loggedInUser = useSelector((state) => state.loggedInUser);

  // CSS
  const theme = useContext(themeContext);
  const [mode, setMode] = useState(false);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.bgDefault,
      }}
    >
      {loggedInUser && (
        <Text
          style={{
            padding: 20,
            color: theme.fontDefault,
            fontSize: 20,
            fontWeight: 500,
          }}
          onPress={() => navigation.navigate(`MY ORDER`)}
        >
          My Order
        </Text>
      )}

      {loggedInUser?.role === "admin" && (
        <Text
          style={{
            padding: 20,
            color: theme.fontDefault,
            fontSize: 20,
            fontWeight: 500,
          }}
          onPress={() => navigation.navigate(`ADMIN PANEL`)}
        >
          Admin Panel
        </Text>
      )}

      {loggedInUser ? (
        <Text
          style={{
            padding: 20,
            color: theme.fontDefault,
            fontSize: 20,
            fontWeight: 500,
          }}
          onPress={() => {
            dispatch(setLogout());
            navigation.navigate(`HOME`);
          }}
        >
          Log Out
        </Text>
      ) : (
        <>
          <Text
            style={{
              padding: 20,
              color: theme.fontDefault,
              fontSize: 20,
              fontWeight: 500,
            }}
            onPress={() => navigation.navigate(`LOGIN`)}
          >
            Log In
          </Text>

          <Text
            style={{
              padding: 20,
              color: theme.fontDefault,
              fontSize: 20,
              fontWeight: 500,
            }}
            onPress={() => navigation.navigate(`REGISTER`)}
          >
            Register
          </Text>
        </>
      )}

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 20,
        }}
      >
        <Text
          style={{
            color: theme.fontDefault,
            fontSize: 20,
            fontWeight: 500,
          }}
        >
          Dark Mode
        </Text>

        <Switch
          value={mode}
          onValueChange={(value) => {
            setMode(value);
            EventRegister.emit("Theme", value);
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default Settings;
