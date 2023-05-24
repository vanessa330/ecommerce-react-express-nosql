import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ChatBubbleOutline,
  Reply,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  IconButton,
  Typography,
  useTheme,
  InputBase,
  Button,
  useMediaQuery,
} from "@mui/material";
import FlexBetween from "../../components/FlexBetween";
import Navbar from "../navbar";
import { setCart } from "../../state";
import { useEffect, useState } from "react";
import Spinner from "../../components/Spinner";
import CartItem from "./CartItem";

const CartPage = () => {
  const dispatch = useDispatch();

  const { userId } = useParams;

  // Cart details from Redux state
  const cart = useSelector((state) => state.cart);
  const items = Object.values(cart.items);

  // CSS
  const { palette } = useTheme();
  const isDesktopScreens = useMediaQuery("(min-width:1000px)");
  const [isLoading, setIsLoading] = useState(false);

  const rootUrl = process.env.REACT_APP_SERVER_URL;

  const getCart = async () => {
    const res = await fetch(`${rootUrl}cart/${userId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    if (res.status === 200) {
      dispatch(setCart({ cart: data }));
    }
  };

  useEffect(() => {
    getCart();
    // eslint-disable-next-line
  }, []);

  return (
    <Box>
      <Navbar />

      <Box
        backgroundColor={palette.background.alt}
        borderRadius="8px"
        // display={isDesktopScreens ? "flex" : "block"}
        m={isDesktopScreens ? "2rem 10rem" : "2rem 0"}
        gap="2rem"
        justifyContent="center"
        alignItems="center"
      >
        <Typography
          variant="h2"
          color={palette.neutral.dark}
          fontWeight="500"
          padding={isDesktopScreens ? "2.75rem" : "1rem"}
        >
          My cart:
        </Typography>
        <Divider />

        {isLoading ? (
          <Spinner />
        ) : (
          <Box>
            {items.map(({ _id, productId, quantity, price, total }) => (
              <CartItem
                key={_id}
                productId={productId}
                quantity={quantity}
                price={price}
                total={total}
              />
            ))}
          </Box>
        )}

        <Box display="flex" justifyContent="right" alignItems="center">
          <FlexBetween padding="1rem 2rem">
            <Typography
              variant="h3"
              color={palette.neutral.dark}
              fontWeight="500"
              margin={isDesktopScreens ? "2rem" : "1rem"}
            >
              Total :
            </Typography>
            <Typography
              variant="h2"
              color={palette.neutral.dark}
              fontWeight="500"
              margin={isDesktopScreens ? "1.5rem" : "1rem"}
            >
              HK$ {cart.subTotal}
            </Typography>
          </FlexBetween>
        </Box>

        <Box display="flex" justifyContent="right" alignItems="center">
          <FlexBetween padding="1rem 2rem 3rem">
            <Button
              fullWidth
              type="submit"
              sx={{
                p: "1rem 8rem",
                backgroundColor: palette.primary.main,
                color: palette.background.alt,
                "&:hover": { color: palette.primary.main },
              }}
            >
              CHECKOUT
            </Button>
          </FlexBetween>
        </Box>
      </Box>
    </Box>
  );
};
export default CartPage;
