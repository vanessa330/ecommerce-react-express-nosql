import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setProducts } from "../../state";
import Navbar from "../navbar";
import MyItem from "./MyItem";
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

  // Products from Redux state []
  const products = useSelector((state) => state.products);

  // User details from Redux state
  const loggedInUser = useSelector((state) => state.loggedInUser);

  // CSS
  const theme = useTheme();
  const isDesktop = useMediaQuery("(min-width:1000px)");

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
    <Box>
      <Navbar />

      <Box
        backgroundColor={theme.palette.background.alt}
        borderRadius="8px"
        m={isDesktop ? "2rem 10rem" : "2rem 0"}
        gap="2rem"
        justifyContent="center"
        alignItems="center"
      >
        <FlexBetween p="0 2rem 0 0">
          <Typography
            variant="h3"
            color={theme.palette.neutral.dark}
            fontWeight="500"
            padding={isDesktop ? "2.75rem" : "1rem"}
          >
            Managing my product :
          </Typography>

          <IconButton onClick={() => navigate(`/productform`)}>
            <AddCircle
              sx={{
                margin: "20px",
                color: theme.palette.neutral.dark,
                fontSize: "20px",
              }}
            />
          </IconButton>
        </FlexBetween>
        <Divider />

        <Box m={isDesktop ? "1rem 0" : "0.75rem"}>
          <Box padding={isDesktop ? "1rem" : "1rem 0.5rem"}>
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
        </Box>
      </Box>
    </Box>
  );
};

export default ManageAccountPage;
