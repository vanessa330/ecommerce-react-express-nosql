import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCart, setItemCount } from "../../state";
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
  picturePath,
  quantity,
  price,
  total,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // User details from Redux state
  const loggedInUserId = useSelector((state) => state.loggedInUser?._id);

  // CSS
  const theme = useTheme();
  const isDesktop = useMediaQuery("(min-width:1000px)");

  // Connect to backend
  const rootUrl = process.env.REACT_APP_SERVER_URL;

  const addItemToCart = async () => {
    const res = await fetch(
      `${rootUrl}cart/add/${productId}/${loggedInUserId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }
    );
    const data = await res.json();

    if (res.status === 201) {
      dispatch(setCart({ cart: data }));
      dispatch(setItemCount({ items: data.items }));
    }
  };

  const subtractItem = async () => {
    const res = await fetch(
      `${rootUrl}cart/subtract/${productId}/${loggedInUserId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      }
    );
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
        <Box flexBasis={isDesktop ? "20%" : undefined}>
          <img
            width="100%"
            height={isDesktop ? "130px" : undefined}
            alt="product"
            style={{
              objectFit: "cover",
              borderRadius: "0.75rem",
            }}
            src={`${rootUrl}assets/${picturePath}`}
            crossOrigin="anonymous"
          />
        </Box>

        <Box
          flexBasis={isDesktop ? "35%" : undefined}
          m={isDesktop ? undefined : "1rem"}
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
            HK$ {price} / unit
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
              HK$ {total}
            </Typography>
          </FlexBetween>
        </Box>
      </Box>
  );
};

export default CartItem;