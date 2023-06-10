import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import UserFollowing from "../../components/UserFollowing";
import UserImage from "../../components/UserImage";
import WidgetWrapper from "../../components/WidgetWrapper";
import FlexBetween from "../../components/FlexBetween";
import { Box, Typography, Divider, useTheme } from "@mui/material";

const UserWidget = ({ user }) => {
  const navigate = useNavigate();

  // Specified user from Redux state
  const token = useSelector((state) => state.token);

  // CSS
  const { palette } = useTheme();

  const rootUrl = process.env.REACT_APP_SERVER_URL;

  if (!user) return null;

  return (
    <WidgetWrapper>
      <FlexBetween gap="0.5rem" p="1.5rem 0.5rem">
        <FlexBetween gap="1rem">
          <UserImage src={`${rootUrl}assets/${user.picturePath}`} />

          <Box>
            <Typography
              variant="h4"
              color={palette.neutral.dark}
              fontWeight="500"
              onClick={() => navigate(`/profile/${user._id}`)}
              sx={{
                "&:hover": {
                  color: palette.primary.light,
                  cursor: "pointer",
                },
              }}
            >
              {user.firstName} {user.lastName}
            </Typography>
            <Typography variant="h5" color={palette.neutral.medium}>
              {user.email}
            </Typography>
          </Box>

          <Box ml="1rem">
            {token && <UserFollowing followingId={user._id} />}
          </Box>
        </FlexBetween>
      </FlexBetween>

      <Divider />

      <Box p="1.5rem 0">
        <FlexBetween>
          <Typography color={palette.neutral.medium}>Followers :</Typography>
          <Typography color={palette.neutral.main} fontWeight="500">
            {user.followers.length}
          </Typography>
        </FlexBetween>
        <FlexBetween>
          <Typography color={palette.neutral.medium}>Following :</Typography>
          <Typography color={palette.neutral.main} fontWeight="500">
            {user.following.length}
          </Typography>
        </FlexBetween>
      </Box>
    </WidgetWrapper>
  );
};

export default UserWidget;
