import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setProductIds } from "../../state";
import ProductWidget from "../../components/ProductWidget";
import { Box, useMediaQuery } from "@mui/material";

const HomePage = () => {
  const dispatch = useDispatch();

  // Products from Redux state []
  const productIds = useSelector((state) => state.productIds);

  // CSS
  const isDesktop = useMediaQuery("(min-width:1000px)");

  // Connect to server
  const rootUrl = process.env.REACT_APP_SERVER_URL;

  const getProductIds = async () => {
    try {
      const res = await fetch(`${rootUrl}products`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();

      if (res.status === 200) {
        dispatch(setProductIds({ productIds: data }));
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getProductIds();
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
        {productIds.map((id) => (
          <ProductWidget key={id} id={id} />
        ))}
      </Box>
    </Box>
  );
};

export default HomePage;
