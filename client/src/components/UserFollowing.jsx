import { useDispatch, useSelector } from "react-redux";
import { setFollowers, setFollowing } from "../state";
import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import { IconButton, useTheme } from "@mui/material";

const UserFollowing = ({ followingId }) => {
  const dispatch = useDispatch();

  // User information
  const token = useSelector((state) => state.token);
  const { _id } = useSelector((state) => state.user);

  // Opposite user information
  const following = useSelector((state) => state.user.following);
  const isFollowing = following.find(
    (following) => following._id === followingId
  );

  // CSS
  const { palette } = useTheme();

  const rootUrl = process.env.REACT_APP_SERVER_URL;

  const addRemoveFollowing = async () => {
    const res = await fetch(`${rootUrl}users/${_id}/${followingId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    dispatch(setFollowing({ following: data }));
    dispatch(setFollowers({ followers: data }));
  };

  if (_id !== followingId) {
    return (
      <IconButton
        onClick={() => addRemoveFollowing()}
        sx={{ backgroundColor: palette.primary.light, p: "0.25rem" }}
      >
        {isFollowing ? (
          <PersonRemoveOutlined sx={{ color: palette.primary.dark }} />
        ) : (
          <PersonAddOutlined sx={{ color: palette.primary.dark }} />
        )}
      </IconButton>
    );
  }
};

export default UserFollowing;
