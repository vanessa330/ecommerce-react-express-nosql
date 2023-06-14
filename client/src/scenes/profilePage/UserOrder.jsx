import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCart, setItemCount } from "../../state";
import ProductImage from "../../components/ProductImage";
import FlexBetween from "../../components/FlexBetween";
import {
  Box,
  IconButton,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material";

const UserOrder = ({}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // User details from Redux state
  const loggedInUserId = useSelector((state) => state.loggedInUser._id);

  // Order details

  // CSS
  const theme = useTheme();
  const isDesktop = useMediaQuery("(min-width:1000px)");

  // Connect to backend
  const rootUrl = process.env.REACT_APP_SERVER_URL;

  return (
    <Box
      p="1rem 2rem"
      display={isDesktop ? "flex" : "block"}
      justifyContent={isDesktop ? "space-between" : "undefined"}
      alignItems={isDesktop ? "center" : "undefined"}
    >
      <Box
        flexBasis={isDesktop ? "45%" : undefined}
        m={isDesktop ? "1rem" : "1rem"}
      >
        <Typography
          variant="h4"
          color={theme.palette.neutral.dark}
          fontWeight="500"
          paddingBottom="0.8rem"
          sx={{
            "&:hover": {
              color: theme.palette.primary.light,
              cursor: "pointer",
            },
          }}
        >
          User order
        </Typography>
 
      </Box>

    </Box>
  );
};

export default UserOrder;
