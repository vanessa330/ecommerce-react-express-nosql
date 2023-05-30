import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "../../state";
import { Box, useMediaQuery } from "@mui/material";
import ProductWidget from "./ProductWidget";
import Spinner from "../../components/Spinner";

const ProductsWidget = ({ userId, isProfile }) => {
  const dispatch = useDispatch();

  // Products from Redux state []
  const products = useSelector((state) => state.products);

  // CSS
  const [isLoading, setIsLoading] = useState(false);
  const isDesktopScreens = useMediaQuery("(min-width:1000px)");

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

  const getUserProducts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${rootUrl}products/${userId}`, {
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
    if (isProfile) {
      getUserProducts(); // ProfilePage: show user's products
    } else {
      getProducts(); // HomePage: show all the products
    }
    // eslint-disable-next-line
  }, []);

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <Box
          display="grid"
          gridTemplateColumns="repeat(auto-fit, minmax(350px, 1fr))"
          gap={isDesktopScreens ? "1rem" : undefined}
          margin={isDesktopScreens ? "1rem 0.5rem" : "1rem 0"}
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
    </>
  );
};

export default ProductsWidget;
