import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./src/state/store";
import { DarkTheme, NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { EventRegister } from "react-native-event-listeners";
import theme from "./src/theme";
import themeContext from "./src/themeContext";
import Home from "./src/screen/Home/Home";
import Wishlist from "./src/screen/Wishlist/Wishlist";
import Cart from "./src/screen/Cart/Cart";
import Settings from "./src/screen/Settings/Settings";
import ProductDetails from "./src/screen/Home/ProductDetails";
import MyOrder from "./src/screen/Settings/MyOrder";
import Admin from "./src/screen/Settings/Admin/Admin";
import Login from "./src/screen/Settings/Auth/Login";
import Register from "./src/screen/Settings/Auth/Register";
import { DefaultTheme } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="HOME" component={Home} />
      <Stack.Screen name="PRODUCT DETAILS" component={ProductDetails} />
    </Stack.Navigator>
  );
}

function WishlistStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="WISHLIST" component={Wishlist} />
      <Stack.Screen name="PRODUCT DETAILS" component={ProductDetails} />
    </Stack.Navigator>
  );
}

function CartStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MY CART" component={Cart} />
    </Stack.Navigator>
  );
}

function SettingsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="SETTINGS" component={Settings} />
      <Stack.Screen name="MY ORDER" component={MyOrder} />
      <Stack.Screen name="ADMIN PANEL" component={Admin} />
      <Stack.Screen
        options={{ headerShown: false }}
        name="LOGIN"
        component={Login}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="REGISTER"
        component={Register}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  // CSS
  const [mode, setMode] = useState(false); // default light

  useEffect(() => {
    const listeners = EventRegister.addEventListener("Theme", (data) => {
      setMode(data);
    });

    return () => {
      EventRegister.removeAllListeners(listeners);
    };
  }, [mode]);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <themeContext.Provider value={mode === true ? theme.dark : theme.light}>
          <NavigationContainer theme={mode === true ? DarkTheme : DefaultTheme}>
            <Tab.Navigator
              screenOptions={({ route }) => ({
                tabBarActiveTintColor: "orange",
                headerShown: false,
                tabBarShowLabel: false,
                tabBarIcon: ({ size, color }) => {
                  let iconName;
                  if (route.name === "Home") {
                    iconName = "home";
                  } else if (route.name === "Wishlist") {
                    iconName = "favorite";
                  } else if (route.name === "Cart") {
                    iconName = "shopping-cart";
                  } else if (route.name === "Settings") {
                    iconName = "settings";
                  }
                  return (
                    <MaterialIcons name={iconName} size={size} color={color} />
                  );
                },
              })}
            >
              <Tab.Screen name="Home" component={HomeStack} />
              <Tab.Screen name="Wishlist" component={WishlistStack} />
              <Tab.Screen
                name="Cart"
                component={CartStack}
              />
              <Tab.Screen name="Settings" component={SettingsStack} />
            </Tab.Navigator>
          </NavigationContainer>
        </themeContext.Provider>
      </PersistGate>
    </Provider>
  );
}
