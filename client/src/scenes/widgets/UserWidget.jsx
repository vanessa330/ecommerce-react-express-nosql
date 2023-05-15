import { Box, Typography, Divider, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserImage from "../../components/UserImage";
import FlexBetween from "../../components/FlexBetween";
import WidgetWrapper from "../../components/WidgetWrapper";

const UserWidget = ({ userId, picturePath }) => {
  const navigate = useNavigate();

  // User details from Redux state
  const [user, setUser] = useState(null);

  // CSS
  const { palette } = useTheme();

  // Get user details from Backend
  const rootUrl = process.env.REACT_APP_SERVER_URL;

  const getUser = async () => {
    const res = await fetch(`${rootUrl}users/${userId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    setUser(data);
  };

  useEffect(() => {
    getUser();
  }, []);

  if (!user) return null;

  const { firstName, lastName, email, followers, following } = user;

  return (
    <WidgetWrapper>
      <FlexBetween gap="0.5rem" p="1.5rem 0.5rem">
        <FlexBetween gap="1rem">
          <UserImage image={picturePath} />

          <Box>
            <Typography
              variant="h4"
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
              {firstName} {lastName}
            </Typography>

            <Typography variant="h5" color={palette.neutral.medium}>
              {email}
            </Typography>
          </Box>
        </FlexBetween>
      </FlexBetween>

      <Divider />

      <Box p="1.5rem 0">
        <FlexBetween>
          <Typography color={palette.neutral.medium}>Followers :</Typography>
          <Typography color={palette.neutral.main} fontWeight="500">
            {followers.length}
          </Typography>
        </FlexBetween>
        <FlexBetween>
          <Typography color={palette.neutral.medium}>Following :</Typography>
          <Typography color={palette.neutral.main} fontWeight="500">
            {following.length}
          </Typography>
        </FlexBetween>
      </Box>
    </WidgetWrapper>
  );
};

export default UserWidget;
