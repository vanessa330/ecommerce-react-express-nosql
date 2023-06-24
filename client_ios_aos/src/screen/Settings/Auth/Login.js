import React, { useState, useContext } from "react";
import { ScrollView, Text, View, SafeAreaView } from "react-native";
import { useDispatch } from "react-redux";
import { setLogin } from "../../../state/action";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { REACT_APP_SERVER_URL } from "@env";
import themeContext from "../../../themeContext";
import Input from "../../../components/Input";
import Button from "../../../components/Button";

const Login = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [inputs, setInputs] = useState({});

  // CSS
  const theme = useContext(themeContext);

  // Connect to the server
  const login = async () => {
    try {
      const res = await axios.post(`${REACT_APP_SERVER_URL}auth/login`, inputs);

      const data = res.data;

      if (res.status === 200) {
        dispatch(setLogin(data));

        navigation.navigate("SETTINGS");
        navigation.navigate("HOME");
      } else if (res.status === 400) {
        console.log(data.error);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bgDefault }}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: 50,
          paddingHorizontal: 20,
        }}
      >
        <Text
          style={{
            color: theme.fontDefault,
            fontSize: 30,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Login
        </Text>

        <View style={{ marginVertical: 20 }}>
          <Input
            label="Email"
            placeholder="email address..."
            onChangeText={(value) => setInputs({ ...inputs, email: value })}
          />
          <Input
            label="Password"
            placeholder="password..."
            password
            onChangeText={(value) => setInputs({ ...inputs, password: value })}
          />
          <Button title="Login" onPress={login} />
          <Text
            style={{ color: theme.fontAlt, textAlign: "center", fontSize: 16 }}
            onPress={() => navigation.navigate("REGISTER")}
          >
            Don't have an account? Sign Up here.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Login;
