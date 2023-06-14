import { useState } from "react";
import { useEffect } from "react";
import ProductWidget from "../../components/ProductWidget";
import { Box, useMediaQuery } from "@mui/material";

const HomePage = () => {
  const [products, setProduct] = useState([]);

  // CSS
  const isDesktop = useMediaQuery("(min-width:1000px)");

  // Connect to server
  const rootUrl = process.env.REACT_APP_SERVER_URL;

  const getProducts = async () => {
    try {
      const res = await fetch(`${rootUrl}products`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();

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
    <Box m={isDesktop ? "2rem auto" : "1rem auto"} maxWidth="1000px">
      <Box
        display="grid"
        gridTemplateColumns="repeat(auto-fit, minmax(300px, 1fr))"
        gap="2rem"
        m={isDesktop ? "0 0.5rem" : "0.8rem"}
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
      </Box>
    </Box>
  );
};

export default HomePage;
