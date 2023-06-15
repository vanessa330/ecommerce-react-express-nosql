import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import UserOrder from "./UserOrder";
import WidgetWrapper from "../../components/WidgetWrapper";
import { Box, useMediaQuery, Typography, useTheme } from "@mui/material";

const ProfilePage = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);

  // User details from Redux state []
  const loggedInUserId = useSelector((state) => state.loggedInUser?._id);

  // CSS
  const isDesktop = useMediaQuery("(min-width:1000px)");
  const theme = useTheme();

  // Connect to Backend
  const rootUrl = process.env.REACT_APP_SERVER_URL;

  const getUserOrder = async () => {
    try {
      const res = await fetch(`${rootUrl}users/${loggedInUserId}/order`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();

      if (res.status === 200) {
        setOrders(data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getUserOrder();
    // eslint-disable-next-line
  }, []);

  return (
    <Box m="1rem auto" maxWidth="1000px">
      <Box
        display={isDesktop ? "flex" : "block"}
        justifyContent="center"
        alignContent="center"
      >
        <Box
          flexBasis={isDesktop ? "30%" : undefined}
          m={isDesktop ? "2rem 1.5rem" : "1rem"}
        >
          <WidgetWrapper>
            <Box p="1rem" display={isDesktop ? "block" : "flex"}>
              <Typography
                textAlign="center"
                padding="1rem"
                variant="h4"
                color={theme.palette.neutral.dark}
                fontWeight="500"
                sx={{
                  "&:hover": {
                    color: theme.palette.primary.light,
                    cursor: "pointer",
                  },
                }}
                onClick={() => navigate(`/profile`)}
              >
                My Orders
              </Typography>
              <Typography
                textAlign="center"
                padding="1rem"
                variant="h4"
                color={theme.palette.neutral.dark}
                fontWeight="500"
              >
                My Address
              </Typography>
            </Box>
          </WidgetWrapper>
        </Box>

        <Box
          flexBasis={isDesktop ? "70%" : undefined}
          m={isDesktop ? "2rem 1rem" : "1rem"}
        >
          {orders.map((order) => (
            <UserOrder
              key={order.orderId}
              id={order.orderId}
              items={order.items}
              subTotal={order.subTotal}
              status={order.status}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default ProfilePage;
