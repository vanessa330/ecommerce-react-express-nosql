import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCart, setItemCount, setLogin } from "../../state";
import ProductImage from "../../components/ProductImage";
import WidgetWrapper from "../../components/WidgetWrapper";
import FlexBetween from "../../components/FlexBetween";
import {
  Box,
  IconButton,
  Typography,
  useTheme,
  Button,
  useMediaQuery,
} from "@mui/material";
import { FavoriteBorderOutlined, FavoriteOutlined } from "@mui/icons-material";

const ProductDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);

  //   User details from Redux state
  const loggedInUserId = useSelector((state) => state.loggedInUser?._id);

  // Cart details from Redux state
  const cart = useSelector((state) => state.cart);
  const cartId = cart ? cart._id : "";

  // CSS
  const theme = useTheme();
  const isDesktop = useMediaQuery("(min-width:1000px)");

  const rootUrl = process.env.REACT_APP_SERVER_URL;

  const getProduct = async () => {
    try {
      const res = await fetch(`${rootUrl}products/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();

      if (res.status === 200) {
        setProduct(data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const likeProduct = async () => {
    try {
      if (!loggedInUserId) {
        window.alert("You must be logged in first.");
      }
      const res = await fetch(`${rootUrl}products/${id}/like`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: loggedInUserId }),
      });
      const data = await res.json();

      if (res.status === 200) {
        setProduct(data.updatedProduct);
        dispatch(setLogin({ loggedInUser: data.updatedUser }));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const addItemToCart = async () => {
    try {
      const res = await fetch(`${rootUrl}cart/add/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: cartId }),
      });

      const data = await res.json();

      if (res.status === 201) {
        dispatch(setCart({ cart: data }));
        dispatch(setItemCount({ items: data.items }));
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getProduct();
    // eslint-disable-next-line
  }, []);

  if (!product) {
    return null;
  } else {
    const {
      productName,
      price,
      quantity,
      description,
      brand,
      picturePath,
      likes,
      // review,
    } = product;
    const isLiked = null || Boolean(likes[loggedInUserId]);

    return (
      <Box m="1rem auto" maxWidth="1000px">
        <Box
          display={isDesktop ? "flex" : "block"}
          justifyContent="center"
          alignContent="center"
        >
          <Box
            flexBasis={isDesktop ? "35%" : undefined}
            m={isDesktop ? "2rem 1.5rem" : "1rem"}
          >
            <WidgetWrapper>
              {picturePath && (
                <ProductImage
                  src={`${rootUrl}assets/${picturePath}`}
                  width="100%"
                />
              )}
            </WidgetWrapper>
          </Box>

          <Box
            flexBasis={isDesktop ? "60%" : undefined}
            m={isDesktop ? "2rem 1.5rem" : "1rem"}
          >
            <WidgetWrapper>
              <Box p="1rem">
                <Typography
                  variant="h3"
                  color={theme.palette.neutral.dark}
                  fontWeight="500"
                >
                  {productName}
                </Typography>

                <FlexBetween m="2rem 0">
                  <Typography
                    variant="h4"
                    color={theme.palette.neutral.dark}
                    fontWeight="500"
                  >
                    Price :
                  </Typography>
                  <Typography variant="h3" color={theme.palette.neutral.dark}>
                    $ {price.toFixed(2)}
                  </Typography>
                </FlexBetween>

                <Typography
                  variant="h4"
                  color={theme.palette.neutral.dark}
                  fontWeight="500"
                  marginTop="2rem"
                >
                  Description :
                </Typography>
                <Typography
                  variant="h5"
                  color={theme.palette.neutral.main}
                  marginTop="1rem"
                >
                  {description}
                </Typography>

                <FlexBetween marginTop="3rem">
                  <FlexBetween gap="0.3rem">
                    {isLiked !== null && (
                      <IconButton onClick={likeProduct}>
                        {isLiked ? (
                          <FavoriteOutlined
                            sx={{ color: theme.palette.primary.main }}
                          />
                        ) : (
                          <FavoriteBorderOutlined />
                        )}
                      </IconButton>
                    )}
                    <Typography>{Object.keys(likes).length}</Typography>
                  </FlexBetween>
                </FlexBetween>

                <FlexBetween marginTop="2rem">
                  <FlexBetween>
                    {quantity > 0 ? (
                      <Typography variant="h5" color="green">
                        In Stock
                      </Typography>
                    ) : (
                      <Typography variant="h5" color="red">
                        Out Of Stock
                      </Typography>
                    )}
                  </FlexBetween>

                  {quantity > 0 && (
                    <Button
                      sx={{
                        p: "1rem",
                        m: "0.5rem",
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.background.alt,
                        "&:hover": { color: theme.palette.primary.main },
                      }}
                      onClick={addItemToCart}
                    >
                      ADD TO CART
                    </Button>
                  )}
                </FlexBetween>
              </Box>
            </WidgetWrapper>
          </Box>
        </Box>
      </Box>
    );
  }
};

export default ProductDetailPage;
