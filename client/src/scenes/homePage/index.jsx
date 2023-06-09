import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "../../state";
import ProductWidget from "../widgets/ProductWidget";
import { Box, useMediaQuery } from "@mui/material";
import { ClipLoader } from "react-spinners";

const HomePage = () => {
  const dispatch = useDispatch();

  // Redux state []
  const products = useSelector((state) => state.products);

  // CSS
  const isDesktop = useMediaQuery("(min-width:1000px)");
  const [isLoading, setIsLoading] = useState(false);

  // Connect to server
  const rootUrl = process.env.REACT_APP_SERVER_URL;

  const getProducts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${rootUrl}products`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      dispatch(setProducts({ products: data }));
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
    // eslint-disable-next-line
  }, []);

  return (
    <Box m={isDesktop ? "2rem auto" : "1rem auto"} maxWidth="1200px">
      {isLoading ? (
        <Box textAlign="center">
          <ClipLoader />
        </Box>
      ) : (
        <Box
          display="grid"
          gridTemplateColumns="repeat(auto-fit, minmax(300px, 1fr))"
          gap="2rem"
        >
          {products.map(
            ({
              _id,
              userId,
              firstName,
              lastName,
              productName,
              price,
              description,
              picturePath,
              likes,
            }) => (
              <ProductWidget
                key={_id}
                id={_id}
                userId={userId}
                name={`${firstName} ${lastName}`}
                productName={productName}
                price={price}
                description={description}
                picturePath={picturePath}
                likes={likes}
              />
            )
          )}
        </Box>
      )}
    </Box>
  );
};

export default HomePage;
