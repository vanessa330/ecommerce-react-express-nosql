import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import ProductWidget from "../../components/ProductWidget";
import {
  Box,
  useMediaQuery,
  Typography,
  useTheme,
  Divider,
} from "@mui/material";

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState([]);

  // User details from Redux state []
  const loggedInUserId = useSelector((state) => state.loggedInUser?._id);

  // CSS
  const theme = useTheme();
  const isDesktop = useMediaQuery("(min-width:1000px)");

  // Connect to server
  const rootUrl = process.env.REACT_APP_SERVER_URL;

  const getUserWishlist = async () => {
    try {
      const res = await fetch(`${rootUrl}users/${loggedInUserId}/wishlist`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();

      if (res.status === 200) {
        setWishlist(data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (loggedInUserId) {
      getUserWishlist();
    }
    // eslint-disable-next-line
  }, []);

  return (
    <Box
      m={isDesktop ? "2rem auto" : "1rem auto"}
      maxWidth="1000px"
      p={isDesktop ? "1rem 5rem" : "1rem 0"}
    >
      <Typography
        variant="h2"
        color={theme.palette.neutral.dark}
        fontWeight="500"
        padding={isDesktop ? "1rem 3rem" : "1rem"}
      >
        My Wishlist :
      </Typography>

      <Divider />

      {!wishlist ? (
        <Typography
          variant="h5"
          color={theme.palette.neutral.main}
          fontWeight="500"
          padding={isDesktop ? "3rem" : "1rem"}
          textAlign="center"
        >
          Your wishlist is empty...
        </Typography>
      ) : (
        <Box
          display="grid"
          gridTemplateColumns="repeat(auto-fit, minmax(350px, 1fr))"
          gap="2rem"
          m={isDesktop ? "1rem 0.5rem" : "0.8rem"}
        >
          {wishlist?.map((product) => (
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
      )}
    </Box>
  );
};

export default WishlistPage;
