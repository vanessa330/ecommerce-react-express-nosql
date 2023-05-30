import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Divider,
  Typography,
  useTheme,
  Button,
  useMediaQuery,
} from "@mui/material";
import FlexBetween from "../../components/FlexBetween";
import Navbar from "../navbar";
import { setCart, setCartToNull, setItemCount } from "../../state";
import { useEffect, useState } from "react";
import Spinner from "../../components/Spinner";
import CartItem from "./CartItem";

const CartPage = () => {
  const dispatch = useDispatch();

  const loggedInUser = useSelector((state) => state.user._id);

  // Cart details from Redux state
  const cart = useSelector((state) => state.cart);
  const items = cart ? Object.values(cart.items) : [];

  // CSS
  const { palette } = useTheme();
  const isDesktopScreens = useMediaQuery("(min-width:1000px)");
  const [isLoading, setIsLoading] = useState(false);

  const rootUrl = process.env.REACT_APP_SERVER_URL;

  const getCart = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${rootUrl}cart/${loggedInUser}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (res.status === 200) {
        dispatch(setCart({ cart: data }));
        dispatch(setItemCount({ items: data.items }));
      } else if (res.status === 400) {
        console.log(data.error);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const checkOut = async () => {
    const data = { id: cart._id };

    try {
      const res = await fetch(`${rootUrl}create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.status === 303) {
        const session = await res.json();
        window.location.href = session.url;
      }
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(setCartToNull());
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
        ) : cart === null ? null : (
          <Box>
            {items.map(
              ({
                _id,
                productId,
                productName,
                picturePath,
                quantity,
                price,
                total,
              }) => (
                <CartItem
                  key={_id}
                  productId={productId}
                  productName={productName}
                  picturePath={picturePath}
                  quantity={quantity}
                  price={price}
                  total={total}
                />
              )
            )}
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
              HK$ {cart === null ? "0" : `${cart.subTotal}`}
            </Typography>
          </FlexBetween>
        </Box>

        <Box display="flex" justifyContent="right" alignItems="center">
          <FlexBetween padding="1rem 2rem 3rem">
            <Button
              fullWidth
              onClick={checkOut}
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
