import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);

  //   User details from Redux state
  const loggedInUserId = useSelector((state) => state.loggedInUser?._id);

  // Cart details from Redux state
  const cart = useSelector((state) => state.cart);
  const cartId = cart ? cart._id : "";

  // CSS
  const { palette } = useTheme();
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
      review,
    } = product;
    const isLiked = null || Boolean(likes[loggedInUserId]);

    return (
      <Box
        m={isDesktop ? "2rem auto" : "1rem auto"}
        maxWidth="1000px"
        p={isDesktop ? "1rem 6rem" : "1rem 0"}
      >
        <WidgetWrapper>
          <FlexBetween p={isDesktop ? "1rem 2rem" : "1.5rem"}>
            <Typography
              variant="h3"
              color={palette.neutral.dark}
              fontWeight="500"
            >
              {productName}
            </Typography>
          </FlexBetween>
          <Box
            display={isDesktop ? "flex" : "block"}
            justifyContent="center"
            alignItems="center"
          >
            <Box
              flexBasis={isDesktop ? "50%" : undefined}
              p={isDesktop ? "2rem" : "1.5rem"}
            >
              {picturePath && (
                <ProductImage
                  src={`${rootUrl}assets/${picturePath}`}
                  width="100%"
                />
              )}
            </Box>

            <Box
              flexBasis={isDesktop ? "50%" : undefined}
              p={isDesktop ? "2rem" : "1.5rem"}
            >
              <FlexBetween padding="1rem 0">
                <FlexBetween gap="1rem" marginTop="2rem">
                  <Typography
                    variant="h4"
                    color={palette.neutral.dark}
                    fontWeight="500"
                  >
                    Price :
                  </Typography>
                  <Typography variant="h3" color={palette.neutral.dark}>
                    $ {price.toFixed(2)}
                  </Typography>
                </FlexBetween>
              </FlexBetween>

              <Typography
                variant="h4"
                color={palette.neutral.dark}
                fontWeight="500"
                marginTop="2rem"
              >
                Description :
              </Typography>
              <Typography
                variant="h5"
                color={palette.neutral.main}
                marginTop="1rem"
              >
                {description}
              </Typography>

              <Typography
                variant="h4"
                color={palette.neutral.dark}
                fontWeight="500"
                marginTop="2rem"
              >
                Brand :
              </Typography>
              <Typography
                variant="h5"
                color={palette.neutral.main}
                marginTop="1rem"
              >
                {brand}
              </Typography>

              <FlexBetween marginTop="2rem">
                <FlexBetween gap="0.3rem">
                  {isLiked !== null && (
                    <IconButton onClick={likeProduct}>
                      {isLiked ? (
                        <FavoriteOutlined
                          sx={{ color: palette.primary.main }}
                        />
                      ) : (
                        <FavoriteBorderOutlined />
                      )}
                    </IconButton>
                  )}
                  <Typography>{Object.keys(likes).length}</Typography>
                </FlexBetween>
              </FlexBetween>

              <FlexBetween padding="0.8rem 0rem">
                <FlexBetween gap="1rem">
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
                  <Box margin="2rem">
                    <Button
                      sx={{
                        backgroundColor: palette.neutral.light,
                        color: palette.neutral.dark,
                        borderRadius: "3rem",
                        padding: "1rem",
                      }}
                      onClick={addItemToCart}
                    >
                      ADD TO CART
                    </Button>
                  </Box>
                )}
              </FlexBetween>
            </Box>
          </Box>
        </WidgetWrapper>
      </Box>
    );
  }
};

export default ProductDetailPage;
