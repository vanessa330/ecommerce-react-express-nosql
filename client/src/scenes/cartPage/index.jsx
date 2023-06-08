import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCart, setCartToNull, setItemCount } from "../../state";
import CartItem from "./CartItem";
import WidgetWrapper from "../../components/WidgetWrapper";
import FlexBetween from "../../components/FlexBetween";
import {
  Box,
  Divider,
  Typography,
  useTheme,
  Button,
  useMediaQuery,
} from "@mui/material";

const CartPage = () => {
  const dispatch = useDispatch();

  // User details from Redux state
  const loggedInUser = useSelector((state) => state.loggedInUser._id);

  // Cart details from Redux state
  const cart = useSelector((state) => state.cart);
  const items = cart ? Object.values(cart.items) : [];

  // CSS
  const theme = useTheme();
  const isDesktop = useMediaQuery("(min-width:1000px)");

  // Connect to backend
  const rootUrl = process.env.REACT_APP_SERVER_URL;

  const getCart = async () => {
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
    <Box
      m={isDesktop ? "2rem auto" : "1rem auto"}
      maxWidth="1200px"
      p={isDesktop ? "1rem 10rem" : "1rem 0"}
    >
      <WidgetWrapper>
        <Typography
          variant="h2"
          color={theme.palette.neutral.dark}
          fontWeight="500"
          padding={isDesktop ? "1rem 3rem" : "1rem"}
        >
          My cart :
        </Typography>

        <Divider />

        {cart !== null && (
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
              color={theme.palette.neutral.dark}
              fontWeight="500"
              margin={isDesktop ? "2rem" : "1rem"}
            >
              Total :
            </Typography>
            <Typography
              variant="h2"
              color={theme.palette.neutral.dark}
              fontWeight="500"
              margin={isDesktop ? "1.5rem" : "1rem"}
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
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.background.alt,
                "&:hover": { color: theme.palette.primary.main },
              }}
            >
              CHECKOUT
            </Button>
          </FlexBetween>
        </Box>
        
      </WidgetWrapper>
    </Box>
  );
};
export default CartPage;
