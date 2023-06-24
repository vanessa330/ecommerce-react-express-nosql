import React, { useState, useContext } from "react";
import { ScrollView, Text, View, SafeAreaView, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { REACT_APP_SERVER_URL } from "@env";
import themeContext from "../../../themeContext";
import Input from "../../../components/Input";
import Button from "../../../components/Button";

const Register = () => {
  const navigation = useNavigation();

  const [inputs, setInputs] = useState({});

  // CSS
  const theme = useContext(themeContext);

  // Connect to the server
  const register = async () => {
    try {
      const res = await axios.post(
        `${REACT_APP_SERVER_URL}auth/register`,
        inputs
      );
      const data = res.data;

      if (res.status === 201) {
        setInputs({});

        Alert.alert(data.success, "", [
          { text: "OK", onPress: () => navigation.navigate("LOGIN") },
        ]);
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
          paddingHorizontal: 30,
        }}
      >
        <Text
          style={{
            color: theme.fontDefault,
            fontSize: 40,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Register
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
          <Input
            label="First Name"
            placeholder="first name..."
            onChangeText={(value) => setInputs({ ...inputs, firstName: value })}
          />
          <Input
            label="Last Name"
            placeholder="last name..."
            onChangeText={(value) => setInputs({ ...inputs, lastName: value })}
          />
          <Button title="Register" onPress={register} />
          <Text
            style={{ color: theme.fontAlt, textAlign: "center", fontSize: 16 }}
            onPress={() => navigation.navigate("LOGIN")}
          >
            Already have an account? Login here.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Register;
