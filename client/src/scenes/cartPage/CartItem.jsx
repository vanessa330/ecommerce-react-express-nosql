import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCart, setItemCount } from "../../state";
import ProductImage from "../../components/ProductImage";
import FlexBetween from "../../components/FlexBetween";
import {
  Box,
  IconButton,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material";

const CartItem = ({
  productId,
  productName,
  quantity,
  price,
  total,
  picturePath,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // User details from Redux state
  const loggedInUserId = useSelector((state) => state.loggedInUser?._id);

  // Cart details from Redux state
  const cart = useSelector((state) => state.cart);
  const cartId = cart ? cart._id : "";

  // CSS
  const theme = useTheme();
  const isDesktop = useMediaQuery("(min-width:1000px)");

  // Connect to backend
  const rootUrl = process.env.REACT_APP_SERVER_URL;

  const addItemToCart = async () => {
    const res = await fetch(`${rootUrl}cart/add/${productId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: cartId }),
    });
    const data = await res.json();

    if (res.status === 201) {
      dispatch(setCart({ cart: data }));
      dispatch(setItemCount({ items: data.items }));
    }
  };

  const subtractItem = async () => {
    const res = await fetch(`${rootUrl}cart/subtract/${productId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: cartId }),
    });
    const data = await res.json();

    if (res.status === 200) {
      dispatch(setCart({ cart: data }));
      dispatch(setItemCount({ items: data.items }));
    }
  };

  return (
    <Box
      p="1rem 2rem"
      display={isDesktop ? "flex" : "block"}
      justifyContent={isDesktop ? "space-between" : "undefined"}
      alignItems={isDesktop ? "center" : "undefined"}
    >
      <Box
        flexBasis={isDesktop ? "20%" : undefined}
        m={isDesktop ? "1rem" : "1rem"}
      >
        {picturePath && (
          <ProductImage
            src={`${rootUrl}assets/${picturePath}`}
            width="100%"
            height="100px"
          />
        )}
      </Box>
      <Box
        flexBasis={isDesktop ? "45%" : undefined}
        m={isDesktop ? "1rem" : "1rem"}
      >
        <Typography
          variant="h4"
          color={theme.palette.neutral.dark}
          fontWeight="500"
          paddingBottom="0.8rem"
          onClick={() => navigate(`/product/${productId}`)}
          sx={{
            "&:hover": {
              color: theme.palette.primary.light,
              cursor: "pointer",
            },
          }}
        >
          {productName}
        </Typography>
        <Typography
          variant="h5"
          color={theme.palette.neutral.main}
          fontWeight="500"
        >
          $ {price.toFixed(2)} / unit
        </Typography>
      </Box>

      <Box
        flexBasis={isDesktop ? "35%" : undefined}
        m={isDesktop ? undefined : "0.8rem"}
      >
        <FlexBetween>
          <FlexBetween>
            <IconButton onClick={subtractItem}>
              <RemoveCircleOutline />
            </IconButton>
            <Typography
              variant="h4"
              color={theme.palette.neutral.dark}
              fontWeight="500"
              padding="0 7px"
            >
              {quantity}
            </Typography>

            <IconButton onClick={addItemToCart}>
              <AddCircleOutline />
            </IconButton>
          </FlexBetween>
          <Typography
            variant="h4"
            color={theme.palette.neutral.main}
            fontWeight="500"
          >
            $ {total.toFixed(2)}
          </Typography>
        </FlexBetween>
      </Box>
    </Box>
  );
};

export default CartItem;
