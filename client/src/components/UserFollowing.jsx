import { useDispatch, useSelector } from "react-redux";
import { setLoggedInUser } from "../state";
import { IconButton, useTheme } from "@mui/material";
import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";

const UserFollowing = ({ followingId }) => {
  const dispatch = useDispatch();

  // loggedInUser information
  const token = useSelector((state) => state.token);
  const loggedInUser = useSelector((state) => state.loggedInUser?._id);

  // Opposite user information
  const following = useSelector((state) => state.loggedInUser?.following);
  const isFollowed = following.find((f) => f === followingId);

  // CSS
  const { palette } = useTheme();

  const rootUrl = process.env.REACT_APP_SERVER_URL;

  const addRemoveFollowing = async () => {
    const res = await fetch(`${rootUrl}users/${loggedInUser}/${followingId}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    dispatch(setLoggedInUser({ loggedInUser: data }));
  };


  if (loggedInUser !== followingId) {
    return (
      <IconButton
        onClick={() => addRemoveFollowing()}
        sx={{ backgroundColor: palette.primary.light, p: "0.25rem" }}
      >
        {isFollowed ? (
          <PersonRemoveOutlined sx={{ color: palette.primary.dark }} />
        ) : (
          <PersonAddOutlined sx={{ color: palette.primary.dark }} />
        )}
      </IconButton>
    );
  }
};

export default UserFollowing;
