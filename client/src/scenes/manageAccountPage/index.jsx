import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setProducts } from "../../state";
import MyItem from "./MyItem";
import WidgetWrapper from "../../components/WidgetWrapper";
import FlexBetween from "../../components/FlexBetween";
import {
  Box,
  Typography,
  useMediaQuery,
  useTheme,
  IconButton,
  Divider,
} from "@mui/material";
import { AddCircle } from "@mui/icons-material";

const ManageAccountPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // User details from Redux state
  const loggedInUser = useSelector((state) => state.loggedInUser);

  // Products from Redux state []
  const products = useSelector((state) => state.products);

  // CSS
  const theme = useTheme();
  const isDesktop = useMediaQuery("(min-width:1000px)");

  // Connect to backend
  const rootUrl = process.env.REACT_APP_SERVER_URL;

  const getUserProducts = async () => {
    try {
      const res = await fetch(`${rootUrl}products/${loggedInUser._id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      dispatch(setProducts({ products: data }));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getUserProducts();
    // eslint-disable-next-line
  }, []);

  return (
    <Box
      m={isDesktop ? "2rem auto" : "1rem auto"}
      maxWidth="1200px"
      p={isDesktop ? "1rem 10rem" : "1rem 0"}
    >
      <WidgetWrapper>
        <FlexBetween p={isDesktop ? "1rem 3rem" : "1rem"}>
          <Typography
            variant="h2"
            color={theme.palette.neutral.dark}
            fontWeight="500"
          >
            Managing my product :
          </Typography>

          <Box p={isDesktop ? "1rem" : undefined}>
            <IconButton onClick={() => navigate(`/productform`)}>
              <AddCircle
                sx={{
                  margin: "10px",
                  color: theme.palette.neutral.dark,
                  fontSize: "20px",
                }}
              />
              <Typography fontWeight="500">Add</Typography>
            </IconButton>
          </Box>
        </FlexBetween>

        <Divider />

        <Box
          m={isDesktop ? "1rem 0" : "0.75rem"}
          p={isDesktop ? "1rem" : "1rem 0.5rem"}
        >
          {products.map(
            ({ _id, productName, price, description, picturePath }) => (
              <MyItem
                key={_id}
                id={_id}
                productName={productName}
                price={price}
                description={description}
                picturePath={picturePath}
              />
            )
          )}
        </Box>
      </WidgetWrapper>
    </Box>
  );
};

export default ManageAccountPage;
