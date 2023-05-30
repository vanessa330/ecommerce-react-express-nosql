import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material";
import {
  Box,
  IconButton,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import FlexBetween from "../../components/FlexBetween";
import { setCart, setItemCount } from "../../state";
import WidgetWrapper from "../../components/WidgetWrapper";

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

  //   User details from Redux state
  const loggedInUserId = useSelector((state) => state.user?._id);

  // CSS
  const { palette } = useTheme();
  const isDesktopScreens = useMediaQuery("(min-width:1000px)");

  const rootUrl = process.env.REACT_APP_SERVER_URL;

  const addItemToCart = async () => {
    const res = await fetch(
      `${rootUrl}/cart/add/${productId}/${loggedInUserId}`,
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
      `${rootUrl}/cart/subtract/${productId}/${loggedInUserId}`,
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
    <WidgetWrapper>
      <Box
        m="0.5rem 1rem 0"
        display={isDesktopScreens ? "flex" : "block"}
        justifyContent={isDesktopScreens ? "space-between" : "undefined"}
        alignItems={isDesktopScreens ? "center" : "undefined"}
      >
        <Box width={isDesktopScreens ? "20%" : undefined}>
          <img
            width="100%"
            height={isDesktopScreens ? "130px" : undefined}
            alt="product"
            style={{
              objectFit: "cover",
              borderRadius: "0.75rem",
            }}
            src={`${rootUrl}/assets/${picturePath}`}
            crossOrigin="anonymous"
          />
        </Box>

        <Box
          width={isDesktopScreens ? "40%" : undefined}
          m={isDesktopScreens ? undefined : "1rem"}
        >
          <Typography
            variant="h4"
            color={palette.neutral.dark}
            fontWeight="500"
            paddingBottom="0.8rem"
            onClick={() => navigate(`/product/${productId}`)}
            sx={{
              "&:hover": {
                color: palette.primary.light,
                cursor: "pointer",
              },
            }}
          >
            {productName}
          </Typography>
          <Typography
            variant="h5"
            color={palette.neutral.main}
            fontWeight="500"
          >
            HK$ {price} / unit
          </Typography>
        </Box>

        <Box
          width={isDesktopScreens ? "30%" : undefined}
          m={isDesktopScreens ? undefined : "0.8rem"}
        >
          <FlexBetween>
            <FlexBetween>
              <IconButton onClick={subtractItem}>
                <RemoveCircleOutline />
              </IconButton>
              <Typography
                variant="h4"
                color={palette.neutral.dark}
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
              color={palette.neutral.main}
              fontWeight="500"
            >
              HK$ {total}
            </Typography>
          </FlexBetween>
        </Box>
      </Box>
    </WidgetWrapper>
  );
};

export default CartItem;
