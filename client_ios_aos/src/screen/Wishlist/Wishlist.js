import React, { useEffect, useState, useContext } from "react";
import { ScrollView, View, SafeAreaView, Text } from "react-native";
import { useSelector } from "react-redux";
import axios from "axios";
import { REACT_APP_SERVER_URL } from "@env";
import ProductWidget from "../../components/ProductWidget";
import themeContext from "../../themeContext";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);

  // User details from Redux state []
  const loggedInUserId = useSelector((state) => state.loggedInUser?._id);

  // CSS
  const theme = useContext(themeContext);

  const getUserWishlist = async () => {
    try {
      const res = await axios.get(
        `${REACT_APP_SERVER_URL}users/${loggedInUserId}/wishlist`
      );

      const data = res.data;
      if (res.status === 200) {
        setWishlist(data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getUserWishlist();
    // eslint-disable-next-line
  }, []);

  return (
    <SafeAreaView
      style={{
        backgroundColor: theme.bgDefault,
        borderRadius: 15,
        margin: 15,
        flex: 1,
      }}
    >
      <ScrollView>
        <Text
          style={{
            paddingVertical: 10,
            paddingHorizontal: 20,
            color: theme.fontDefault,
            fontSize: 30,
            fontWeight: "bold",
          }}
        >
          My wishlist :
        </Text>

        {!wishlist ? (
          <Text
            style={{
              paddingVertical: 10,
              paddingHorizontal: 20,
              color: theme.fontDefault,
              fontSize: 15,
            }}
          >
            Your wishlist is empty...
          </Text>
        ) : (
          <>
            {wishlist?.map((product) => {
              return (
                <ProductWidget
                  key={product._id}
                  id={product._id}
                  productName={product.productName}
                  price={product.price}
                  quantity={product.quantity}
                  picturePath={product.picturePath}
                />
              );
            })}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Wishlist;
