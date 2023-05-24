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
import { setProducts, setProduct, setCart } from "../../state";
import { useEffect, useState } from "react";
import Spinner from "../../components/Spinner";
import UserFollowing from "../../components/UserFollowing";

const ProductInfoPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { id } = useParams();

  //   User details from Redux state
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user?._id);

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
    comments,
  } = product;

  // Cart details from Redux state
  const cart = useSelector((state) => state.cart);

  const commentArray = Object.entries(comments);
  const [newComment, setNewComment] = useState("");

  // CSS
  const { palette } = useTheme();
  const isDesktopScreens = useMediaQuery("(min-width:1000px)");
  const [isLoading, setIsLoading] = useState(false);
  const isLiked = false || Boolean(likes[loggedInUserId]); // Frontend liked color setting
  const [isCommentToggled, setIsCommentToggled] = useState(false);

  const rootUrl = process.env.REACT_APP_SERVER_URL;

  const getProducts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${rootUrl}products/`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      dispatch(setProducts({ products: data }));
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
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

  const addComment = async () => {
    const res = await fetch(
      `${rootUrl}products/${id}/${loggedInUserId}/comment`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comment: newComment }),
      }
    );

    const updatedProduct = await res.json();

    if (res.status === 200) {
      dispatch(setProduct({ product: updatedProduct }));
      setNewComment("");
    }
  };

  const addItemToCart = async () => {
    const res = await fetch(`${rootUrl}cart/add/${id}/${loggedInUserId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (res.status === 201) {
      dispatch(setCart({ cart: data }));
    }
  };

  useEffect(() => {
    getProducts();
    // eslint-disable-next-line
  }, []);

  return (
    <Box>
      <Navbar />

      {isLoading ? (
        <Spinner />
      ) : product ? (
        <Box margin="1.5rem">
          <Box
            backgroundColor={palette.background.alt}
            borderRadius="5px"
            display={isDesktopScreens ? "flex" : "block"}
            m={isDesktopScreens ? "2rem" : "0.1rem"}
            gap="2rem"
            justifyContent="center"
            alignItems="center"
          >
            <Box
              flexBasis={isDesktopScreens ? "50%" : undefined}
              p={isDesktopScreens ? "2rem" : "1.5rem"}
            >
              {picturePath && (
                <img
                  width="100%"
                  alt="product"
                  style={{
                    objectFit: "cover",
                    borderRadius: "0.75rem",
                  }}
                  src={`${rootUrl}assets/${picturePath}`}
                  crossOrigin="anonymous"
                />
              )}
            </Box>

            <Box
              flexBasis={isDesktopScreens ? "50%" : undefined}
              p={isDesktopScreens ? "2rem" : "1.5rem"}
            >
              <Typography
                variant="h3"
                color={palette.neutral.dark}
                fontWeight="500"
                marginTop={isDesktopScreens ? "2.75rem" : undefined}
              >
                {productName}
              </Typography>

              <FlexBetween padding="1rem 0">
                <FlexBetween gap="1rem" marginTop="2rem">
                  <Typography variant="h4" color={palette.neutral.dark}>
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

                  <FlexBetween gap="0.3rem">
                    {token && (
                      <>
                        <IconButton
                          onClick={() => setIsCommentToggled(!isCommentToggled)}
                        >
                          <ChatBubbleOutline />
                        </IconButton>
                        <Typography>{Object.keys(comments).length}</Typography>
                      </>
                    )}
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
          {isCommentToggled && (
            <Box
              display={isDesktopScreens ? "flex" : "block"}
              justifyContent="center"
              alignItems="center"
            >
              <Box flexBasis={isDesktopScreens ? "50%" : undefined}>{null}</Box>
              <Box
                backgroundColor={palette.background.alt}
                borderRadius="5px"
                flexBasis={isDesktopScreens ? "50%" : undefined}
                m={isDesktopScreens ? "0.1rem 2rem" : "2rem 0"}
              >
                <Typography
                  variant="h4"
                  color={palette.neutral.dark}
                  p={isDesktopScreens ? "2rem 3rem" : "2rem"}
                >
                  Comments :
                </Typography>

                <Divider margin="1rem" />
                <Box
                  m={isDesktopScreens ? "0 2rem" : undefined}
                  sx={{
                    maxHeight: "200px",
                    overflowY: "auto",
                  }}
                >
                  <Typography sx={{ color: palette.neutral.main }}>
                    {commentArray.map(([key, value]) => (
                      <Box key={key} m={isDesktopScreens ? "1.2rem" : "2rem"}>
                        <Typography ml="0.6rem">
                          {value.firstName} {value.lastName}: {value.comment}
                        </Typography>
                        <Divider sx={{ m: "1.2rem 0" }} />
                      </Box>
                    ))}
                  </Typography>
                </Box>
                <Box
                  p={
                    isDesktopScreens
                      ? "0.5rem 2rem 3rem"
                      : "0.5rem 1.5rem 2.5rem"
                  }
                >
                  <FlexBetween
                    backgroundColor={palette.neutral.light}
                    borderRadius="6px"
                    gap="2rem"
                    m={isDesktopScreens ? "0.5rem 0.8rem" : "1rem"}
                  >
                    <InputBase
                      placeholder="Comment here..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          addComment();
                        }
                      }}
                      name="comment"
                      sx={{
                        width: "100%",
                        backgroundColor: palette.neutral.light,
                        borderRadius: "15px",
                        margin: "1rem",
                      }}
                    />
                    <IconButton onClick={addComment}>
                      <Reply />
                    </IconButton>
                  </FlexBetween>
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      ) : null}
    </Box>
  );
};

export default ProductInfoPage;
