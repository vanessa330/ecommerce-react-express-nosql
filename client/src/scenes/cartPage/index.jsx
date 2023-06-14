import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCart, setItemCount } from "../../state";
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
  const loggedInUserId = useSelector((state) => state.loggedInUser?._id);

  // Cart details from Redux state
  const cart = useSelector((state) => state.cart);
  const cartId = cart ? cart._id : "";
  const items = cart ? Object.values(cart.items) : [];

  // CSS
  const theme = useTheme();
  const isDesktop = useMediaQuery("(min-width:1000px)");

  // Connect to backend
  const rootUrl = process.env.REACT_APP_SERVER_URL;

  const getCart = async () => {
    try {
      const res = await fetch(`${rootUrl}cart`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: cartId }),
      });

      const data = await res.json();
      if (res.status === 200) {
        dispatch(setCart({ cart: data }));
        dispatch(setItemCount({ items: data.items }));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const checkOut = async () => {
    try {
      const res = await fetch(`${rootUrl}create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: cart._id,
          userId: loggedInUserId || "",
        }),
      });

      if (res.status === 303) {
        const session = await res.json();
        window.location.href = session.url;
        getCart()
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getCart();
    // eslint-disable-next-line
  }, []);

  return (
    <Box
      m={isDesktop ? "2rem auto" : "1rem auto"}
      maxWidth="1000px"
      p={isDesktop ? "1rem 5rem" : "1rem 0"}
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

        {items.length === 0 ? (
          <Typography
            variant="h5"
            color={theme.palette.neutral.main}
            fontWeight="500"
            padding={isDesktop ? "3rem" : "1rem"}
            textAlign="center"
          >
            Your cart is empty...
          </Typography>
        ) : (
          <>
            <Box>
              {items.map(
                ({
                  _id,
                  productId,
                  productName,
                  quantity,
                  price,
                  total,
                  picturePath,
                }) => (
                  <CartItem
                    key={_id}
                    productId={productId}
                    productName={productName}
                    quantity={quantity}
                    price={price}
                    total={total}
                    picturePath={picturePath}
                  />
                )
              )}
            </Box>

            <Box
              display="flex"
              alignItems="center"
              justifyContent={isDesktop ? "right" : "center"}
            >
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
                  $ {cart === null ? "0" : `${cart.subTotal.toFixed(2)}`}
                </Typography>
              </FlexBetween>
            </Box>

            <Box
              display="flex"
              alignItems="center"
              justifyContent={isDesktop ? "right" : "center"}
            >
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
          </>
        )}
      </WidgetWrapper>
    </Box>
  );
};
export default CartPage;
