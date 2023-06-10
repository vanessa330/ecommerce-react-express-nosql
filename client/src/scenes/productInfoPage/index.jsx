import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setProducts, setProduct, setCart, setItemCount } from "../../state";
import ProductImage from "../../components/ProductImage";
import UserFollowing from "../../components/UserFollowing";
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

const ProductInfoPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  //   User details from Redux state
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.loggedInUser?._id);

  // Product details from Redux state
  const product = useSelector((state) =>
    state.products.find((product) => product._id === id)
  );
  const {
    userId,
    firstName,
    lastName,
    productName,
    price,
    description,
    picturePath,
    likes,
  } = product;

  // CSS
  const { palette } = useTheme();
  const isDesktop = useMediaQuery("(min-width:1000px)");
  const isLiked = false || Boolean(likes[loggedInUserId]); // Frontend liked color setting

  const rootUrl = process.env.REACT_APP_SERVER_URL;

  const getProducts = async () => {
    try {
      const res = await fetch(`${rootUrl}products`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      dispatch(setProducts({ products: data }));
    } catch (err) {
      console.log(err);
    }
  };

  const likeProduct = async () => {
    const guestOrUser = null || loggedInUserId;
    const res = await fetch(`${rootUrl}products/${id}/like`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: guestOrUser }),
    });

    const updatedProduct = await res.json();
    dispatch(setProduct({ product: updatedProduct }));
  };

  const addItemToCart = async () => {
    const res = await fetch(`${rootUrl}cart/add/${id}/${loggedInUserId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (res.status === 201) {
      dispatch(setCart({ cart: data }));
      dispatch(setItemCount({ items: data.items }));
    }
  };

  useEffect(() => {
    getProducts();
    // eslint-disable-next-line
  }, []);

  return (
    <Box
      m={isDesktop ? "2rem auto" : "1rem auto"}
      maxWidth="1200px"
      p={isDesktop ? "1rem 6rem" : "1rem 0"}
    >
      {product ? (
        <WidgetWrapper>
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
              <Typography
                variant="h3"
                color={palette.neutral.dark}
                fontWeight="500"
              >
                {productName}
              </Typography>

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
                    ${price}
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
                Seller:
              </Typography>
              <FlexBetween gap="0.7rem" mt="1.5rem">
                <FlexBetween gap="1rem">
                  <Typography
                    variant="h5"
                    color={palette.neutral.main}
                    fontWeight="500"
                    onClick={() => navigate(`/profile/${userId}`)}
                    sx={{
                      "&:hover": {
                        color: palette.primary.light,
                        cursor: "pointer",
                      },
                    }}
                  >
                    {`${firstName} ${lastName}`}
                  </Typography>
                  {token && <UserFollowing followingId={userId} />}
                </FlexBetween>
              </FlexBetween>

              <FlexBetween padding="0.8rem 0rem">
                <FlexBetween gap="1rem">
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

                <Box margin="2rem">
                  {token && (
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
                  )}
                </Box>
              </FlexBetween>
            </Box>
          </Box>
        </WidgetWrapper>
      ) : null}
    </Box>
  );
};

export default ProductInfoPage;
