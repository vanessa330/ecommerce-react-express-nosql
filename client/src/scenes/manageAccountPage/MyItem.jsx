import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import FlexBetween from "../../components/FlexBetween";
import {
  Box,
  Typography,
  useMediaQuery,
  useTheme,
  IconButton,
} from "@mui/material";
import { Delete, Edit, Close } from "@mui/icons-material";

const MyItem = ({ id, productName, price, description, picturePath }) => {
  const navigate = useNavigate();

  // User details from Redux state
  const token = Boolean(useSelector((state) => state.token));

  // CSS
  const theme = useTheme();
  const isDesktop = useMediaQuery("(min-width:1000px)");
  const [deleteMsg, setDeleteMsg] = useState(false);
  const [showItem, setShowItem] = useState(true);

  const rootUrl = process.env.REACT_APP_SERVER_URL;

  const deleteProduct = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    const res = await fetch(`${rootUrl}products/${id}/delete`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 200) {
      setDeleteMsg(true);
      setShowItem(false);
    }
  };

  const handleClose = () => {
    setDeleteMsg(false);
  };

  return (
    <Box>
      {deleteMsg ? (
        <FlexBetween
          backgroundColor={theme.palette.neutral.light}
          borderRadius="1rem"
          padding={isDesktop ? "1.5rem 1rem" : undefined}
        >
          <Typography
            variant="h4"
            color={theme.palette.primary.main}
            fontWeight="500"
            textAlign="center"
            padding={isDesktop ? "2rem" : "1rem"}
          >
            You have been successfully deleted the product.
          </Typography>

          <IconButton onClick={handleClose}>
            <Close
              sx={{
                color: theme.palette.primary.main,
                fontSize: "25px",
              }}
            />
          </IconButton>
        </FlexBetween>
      ) : null}

      {showItem ? (
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
            flexBasis={isDesktop ? "45%" : undefined}
            m={isDesktop ? "1.5rem" : "1rem"}
          >
            <Typography
              variant="h4"
              color={theme.palette.neutral.dark}
              fontWeight="500"
              paddingBottom="0.8rem"
              onClick={() => navigate(`/product/${id}`)}
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
              HK$ {price}
            </Typography>
          </Box>

          <Box
            flexBasis={isDesktop ? "35%" : undefined}
            m={isDesktop ? undefined : "0.8rem"}
          >
            <IconButton onClick={() => navigate(`/productform/${id}`)}>
              <Edit
                sx={{
                  margin: "10px",
                  color: theme.palette.neutral.dark,
                  fontSize: "25px",
                }}
              />
              <Typography fontWeight="500">Edit</Typography>
            </IconButton>
            <IconButton onClick={deleteProduct}>
              <Delete
                sx={{
                  margin: "10px",
                  color: theme.palette.neutral.dark,
                  fontSize: "25px",
                }}
              />
              <Typography fontWeight="500">Delete</Typography>
            </IconButton>
          </Box>
        </Box>
      ) : null}
    </Box>
  );
};

export default MyItem;
