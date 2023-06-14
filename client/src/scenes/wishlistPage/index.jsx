import { useDispatch, useSelector } from "react-redux";
import ProductWidget from "../../components/ProductWidget";
import {
  Box,
  useMediaQuery,
  Typography,
  useTheme,
  Divider,
} from "@mui/material";

const WishlistPage = () => {
  const dispatch = useDispatch();

  // Products from Redux state []
  const wishlist = useSelector((state) => state.loggedInUser?.wishlist);

  // CSS
  const theme = useTheme();
  const isDesktop = useMediaQuery("(min-width:1000px)");

  // Connect to server
  //   const rootUrl = process.env.REACT_APP_SERVER_URL;

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

      <Divider
      />

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
          gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))"
          gap="2rem"
          m={isDesktop ? "1rem 0.5rem" : "0.8rem"}
        >
          {wishlist?.map((id) => (
            <ProductWidget key={id} id={id} />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default WishlistPage;
