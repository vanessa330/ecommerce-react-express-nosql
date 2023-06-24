import React, { useEffect, useState, useContext, useCallback } from "react";
import { View, Alert, ScrollView } from "react-native";
import axios from "axios";
import { REACT_APP_SERVER_URL } from "@env";
import { useNavigation } from "@react-navigation/native";
import ProductWidget from "../../components/ProductWidget";
import { Searchbar } from "react-native-paper";
import themeContext from "../../themeContext";
import Button from "../../components/Button";

const Home = () => {
  const navigation = useNavigation();

  const [products, setProduct] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // CSS
  const theme = useContext(themeContext);

  // Connect to server
  const getProducts = async () => {
    try {
      const res = await axios.get(`${REACT_APP_SERVER_URL}products`);
      const data = res.data;

      if (res.status === 200) {
        setProduct(data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const searchProducts = async () => {
    try {
      if (!searchQuery) return Alert.alert("Please enter your search term...");

      const res = await axios.get(
        `${REACT_APP_SERVER_URL}search?product=${searchQuery}`
      );
      const data = res.data;

      if (res.status === 200) {
        setProduct(data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getProducts();
    // eslint-disable-next-line
  }, []);

  return (
    <View
      style={{ flex: 1, backgroundColor: theme.bgAlt, paddingHorizontal: 20 }}
    >
      <Searchbar
        placeholder="Search..."
        onChangeText={(query) => setSearchQuery(query)}
        value={searchQuery}
        style={{ paddingVertical: 10 }}
        onIconPress={searchProducts}
        onSubmitEditing={searchProducts}
      />
      <ScrollView
      // contentContainerStyle={{
      //   flexGrow: 1,
      // }}
      >
        {products.map((product) => (
          <ProductWidget
            key={product._id}
            id={product._id}
            productName={product.productName}
            price={product.price}
            quantity={product.quantity}
            picturePath={product.picturePath}
          />
        ))}

        {searchQuery && (
          <View style={{ backgroundColor: theme.bgAlt, margin: 5 }}>
            <Button
              title="BACK"
              onPress={() => {
                getProducts();
                setSearchQuery("");
              }}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default Home;
