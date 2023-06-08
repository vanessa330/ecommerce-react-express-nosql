import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Box,
  Typography,
  useMediaQuery,
  useTheme,
  IconButton,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";

const MyItem = ({ id, productName, price, description, picturePath }) => {
  const navigate = useNavigate();

  // User details from Redux state
  const token = Boolean(useSelector((state) => state.token));

  // CSS
  const theme = useTheme();
  const isDesktop = useMediaQuery("(min-width:1000px)");

  const rootUrl = process.env.REACT_APP_SERVER_URL;

  const deleteProduct = async () => {
    const res = await fetch(`${rootUrl}products/${id}/delete`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();

    if (res.status === 200) {
      window.alert(data.message);
      navigate(`/manage`);
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
        flexBasis={isDesktop ? "50%" : undefined}
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
        flexBasis={isDesktop ? "30%" : undefined}
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
  );
};

export default MyItem;
