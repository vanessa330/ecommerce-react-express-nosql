import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setProduct } from "../../state";
import {
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ChatBubble,
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
import WidgetWrapper from "../../components/WidgetWrapper";
import { useNavigate } from "react-router-dom";
import UserFollowing from "../../components/UserFollowing";

const ProductWidget = ({
  id,
  userId,
  name,
  productName,
  price,
  description,
  picturePath,
  likes,
  comments,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // User details from Redux state
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user?._id);

  // Grab current product from Redux state.
  const commentArray = Object.entries(comments);
  const [newComment, setNewComment] = useState("");

  // CSS
  const { palette } = useTheme();
  const isDesktopScreens = useMediaQuery("(min-width:1000px)");
  const isLiked = false || Boolean(likes[loggedInUserId]); // Frontend liked color setting
  const [isCommentToggled, setIsCommentToggled] = useState(false);

  // Grab the updated like and comment from Backend.
  const rootUrl = process.env.REACT_APP_SERVER_URL;

  const likeProduct = async () => {
    const res = await fetch(`${rootUrl}products/${id}/${loggedInUserId}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(),
    });

    const updatedProduct = await res.json();
    dispatch(setProduct({ product: updatedProduct }));
  };

  const addComment = async () => {
    const res = await fetch(
      `${rootUrl}product/${id}/${loggedInUserId}/comment`,
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
    dispatch(setProduct({ product: updatedProduct }));
  };

  const addCart = async () => {};

  return (
    <WidgetWrapper m={isDesktopScreens ? "1rem" : "1rem"}>
      <FlexBetween mt="0.8rem" ml="0.8rem">
        <Typography
          variant="h4"
          color={palette.neutral.dark}
          fontWeight="500"
          sx={{ mr: "1.5rem", height: "4rem", overflowY: "auto" }}
        >
          {productName}
        </Typography>

        <Typography
          variant="h4"
          color={palette.neutral.main}
          sx={{ height: "4rem" }}
        >
          ${price}
        </Typography>
      </FlexBetween>

      {picturePath && (
        <img
          width="100%"
          height="270px"
          alt="product"
          style={{
            objectFit: "cover",
            borderRadius: "0.75rem",
          }}
          src={`${rootUrl}assets/${picturePath}`}
          crossOrigin="anonymous" // ERR_BLCKED_BY_RESPONSE.NotSameOrigin 200 (OK)
        />
      )}

      <FlexBetween m="0 0.8rem">
        <Typography
          variant="h5"
          color={palette.neutral.main}
          sx={{ mt: "1rem", height: "100px", overflowY: "auto" }}
        >
          {description}
        </Typography>
      </FlexBetween>

      <FlexBetween gap="0.7rem" mt="1.5rem" ml="0.8rem">
        <FlexBetween gap="1rem">
          {token && <UserFollowing followingId={userId} />}

          <Typography
            variant="h5"
            color={palette.neutral.dark}
            fontWeight="500"
            onClick={() => navigate(`/profile/${userId}`)}
            sx={{
              "&:hover": {
                color: palette.primary.light,
                cursor: "pointer",
              },
            }}
          >
            {name}
          </Typography>
        </FlexBetween>
      </FlexBetween>

      {token && (
        <FlexBetween padding="0.8rem 0.3rem">
          <FlexBetween gap="1rem">
            <FlexBetween gap="0.3rem">
              {isLiked !== null && (
                <IconButton onClick={likeProduct}>
                  {isLiked ? (
                    <FavoriteOutlined sx={{ color: palette.primary.main }} />
                  ) : (
                    <FavoriteBorderOutlined />
                  )}
                </IconButton>
              )}
              <Typography>{Object.keys(likes).length}</Typography>
            </FlexBetween>

            <FlexBetween gap="0.3rem">
              <IconButton
                onClick={() => setIsCommentToggled(!isCommentToggled)}
              >
                <ChatBubbleOutline />
              </IconButton>
              <Typography>{Object.keys(comments).length}</Typography>
            </FlexBetween>
          </FlexBetween>

          <Button
            onClick={addCart}
            sx={{
              backgroundColor: palette.neutral.light,
              color: palette.neutral.dark,
              borderRadius: "3rem",
              padding: "1rem",
            }}
          >
            ADD TO CART
          </Button>
        </FlexBetween>
      )}

      {isCommentToggled && (
        <Box mt="0.5rem">
          <Box>
            <Divider />
            <Typography
              sx={{ color: palette.neutral.main, }}
            >
              {commentArray.map(([key, value]) => (
                <Typography key={key} sx={{ m: "1.2rem 0" }}>
                  {value.firstName} {value.lastName}: {value.comment}
                  <Divider sx={{ m: "1.2rem 0" }}/>
                </Typography>
                
              ))}
            </Typography>
          </Box>

          <FlexBetween m="1rem 0" gap="0.5rem">
            <InputBase
              placeholder="Comment here..."
              onChange={(e) => setProduct(e.target.value)}
              value={setNewComment}
              sx={{
                width: "100%",
                backgroundColor: palette.neutral.light,
                borderRadius: "2rem",
                padding: "1rem 2rem",
              }}
            />
            <IconButton
              onClick={addComment}
              sx={{
                color: palette.neutral.dark,
                borderRadius: "2rem",
                fontSize: "4rem",
              }}
            >
              <Reply />
            </IconButton>
          </FlexBetween>
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default ProductWidget;
