import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLogout } from "../../state";
import UserOrder from "./UserOrder";
import WidgetWrapper from "../../components/WidgetWrapper";
import { Box, useMediaQuery, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // User details from Redux state
  const loggedInUser = useSelector((state) => state.loggedInUser);

  // CSS
  const isDesktop = useMediaQuery("(min-width:1000px)");
  const theme = useTheme();

  // Connect to Backend
  // const rootUrl = process.env.REACT_APP_SERVER_URL;

  if (!loggedInUser) return null;

  return (
    <Box m={isDesktop ? "2rem auto" : "1rem auto"} maxWidth="1000px">
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
            <Box p="1.5rem 0">
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
                My orders
              </Typography>
              <Typography
                textAlign="center"
                padding="1rem"
                variant="h4"
                color={theme.palette.neutral.dark}
                fontWeight="500"
              >
                My address
              </Typography>
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
                onClick={() => {
                  dispatch(setLogout());
                  navigate("/");
                }}
              >
                Logout
              </Typography>
            </Box>
          </WidgetWrapper>
        </Box>

        <Box
          flexBasis={isDesktop ? "70%" : undefined}
          m={isDesktop ? "2rem 1rem" : "1rem"}
        >
          <UserOrder />
        </Box>
      </Box>
    </Box>
  );
};

export default ProfilePage;
