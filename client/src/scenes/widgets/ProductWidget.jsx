import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setProduct } from "../../state";
import WidgetWrapper from "../../components/WidgetWrapper";
import FlexBetween from "../../components/FlexBetween";
import { IconButton, Typography, useTheme } from "@mui/material";
import { FavoriteBorderOutlined, FavoriteOutlined } from "@mui/icons-material";

const ProductWidget = ({
  id,
  userId,
  name,
  productName,
  price,
  description,
  picturePath,
  likes,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  //   User details from Redux state
  const loggedInUserId = useSelector((state) => state.loggedInUser?._id);

  // CSS
  const theme = useTheme();
  const isLiked = false || Boolean(likes[loggedInUserId]); // Frontend liked color setting

  // Connect to server
  const rootUrl = process.env.REACT_APP_SERVER_URL;

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

  return (
    <WidgetWrapper>
      <FlexBetween m="0.8rem">
        <Typography
          variant="h3"
          color={theme.palette.neutral.dark}
          p="0.5rem"
          fontWeight="500"
          onClick={() => navigate(`/product/${id}`)}
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            "&:hover": {
              color: theme.palette.primary.light,
              cursor: "pointer",
            },
          }}
        >
          {productName}
        </Typography>

        <Typography variant="h4" color={theme.palette.neutral.main} p="0.5rem">
          ${price}
        </Typography>
      </FlexBetween>

      {picturePath && (
        <img
          width="100%"
          height="330px"
          alt="product"
          style={{
            objectFit: "cover",
            borderRadius: "0.75rem",
          }}
          src={`${rootUrl}assets/${picturePath}`}
          crossOrigin="anonymous"
        />
      )}

      <FlexBetween m="1rem">
        <Typography
          variant="h5"
          color={theme.palette.neutral.dark}
          fontWeight="500"
          onClick={() => navigate(`/profile/${userId}`)}
          sx={{
            "&:hover": {
              color: theme.palette.primary.light,
              cursor: "pointer",
            },
          }}
        >
          {name}
        </Typography>

        <FlexBetween gap="0.3rem">
          {isLiked !== null && (
            <IconButton onClick={likeProduct}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: theme.palette.primary.main }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
          )}
          <Typography>{Object.keys(likes).length}</Typography>
        </FlexBetween>
      </FlexBetween>
    </WidgetWrapper>
  );
};

export default ProductWidget;
