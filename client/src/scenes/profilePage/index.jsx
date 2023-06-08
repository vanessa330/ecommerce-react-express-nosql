import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../state";
import Navbar from "../navbar";
import UserWidget from "../widgets/UserWidget";
import ProductsWidget from "../widgets/ProductsWidget";
import { Box, useMediaQuery } from "@mui/material";

const ProfilePage = () => {
  const dispatch = useDispatch();

  // Grab the specified user
  const { userId } = useParams();
  const user = useSelector((state) => state.user);

  // CSS
  const isDesktop = useMediaQuery("(min-width:1000px)");

  // Connect to Backend
  const rootUrl = process.env.REACT_APP_SERVER_URL;

  const getUser = async () => {
    const res = await fetch(`${rootUrl}users/${userId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    dispatch(setUser({ user: data }));
  };

  useEffect(() => {
    getUser();
    // eslint-disable-next-line
  }, []);

  if (!user) return null;

  return (
    <Box>
      <Navbar />

      <Box
        width="100%"
        padding="1rem 6%"
        display={isDesktop ? "flex" : "block"}
        gap="2rem"
        justifyContent="center"
      >
        <Box
          flexBasis={isDesktop ? "25%" : undefined}
          m={isDesktop ? "2rem 0.75rem" : undefined}
        >
          <UserWidget userId={userId} picturePath={user.picturePath} />
        </Box>

        <Box
          flexBasis={isDesktop ? "75%" : undefined}
          m={isDesktop ? "1rem 0.75rem" : undefined}
        >
          <ProductsWidget userId={userId} isProfile={true} />
        </Box>
      </Box>
    </Box>
  );
};

export default ProfilePage;
