import { useDispatch, useSelector } from "react-redux";
import { IconButton, Typography, useTheme, useMediaQuery } from "@mui/material";
import FlexBetween from "../../components/FlexBetween";
import WidgetWrapper from "../../components/WidgetWrapper";
import { useNavigate } from "react-router-dom";
import { setProduct } from "../../state";
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
  comments,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  //   User details from Redux state
  const loggedInUserId = useSelector((state) => state.user?._id);

  // CSS
  const { palette } = useTheme();
  const isDesktopScreens = useMediaQuery("(min-width:1000px)");
  const isLiked = false || Boolean(likes[loggedInUserId]); // Frontend liked color setting

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
    <WidgetWrapper m={isDesktopScreens ? "1rem" : "1rem"}>
      <FlexBetween m="0.8rem">
        <Typography
          variant="h4"
          color={palette.neutral.dark}
          p="0.5rem"
          fontWeight="500"
          onClick={() => navigate(`/product/${id}`)}
          sx={{
            height: "4.5rem",
            overflowY: "auto",
            "&:hover": {
              color: palette.primary.light,
              cursor: "pointer",
            },
          }}
        >
          {productName}
        </Typography>

        <Typography variant="h4" color={palette.neutral.main}>
          ${price}
        </Typography>
      </FlexBetween>

      {picturePath && (
        <img
          width="100%"
          height="300px"
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
      </FlexBetween>
    </WidgetWrapper>
  );
};

export default ProductWidget;
