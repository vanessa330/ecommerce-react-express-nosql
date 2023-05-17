import { Box, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../navbar";
import UserWidget from "../widgets/UserWidget";
import ProductsWidget from "../widgets/ProductsWidget";

const ProfilePage = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);

  // CSS
  const isDesktopScreens = useMediaQuery("(min-width:1000px)");

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

  return (
    <Box>
      <Navbar />

      <Box
        width="100%"
        padding="1rem 6%"
        display={isDesktopScreens ? "flex" : "block"}
        gap="2rem"
        justifyContent="center"
      >

        <Box
          flexBasis={isDesktopScreens ? "20%" : undefined}
          mt={isDesktopScreens ? "2rem" : undefined}
        >
          <UserWidget userId={userId} picturePath={user.picturePath} />
        </Box>

        <Box
          flexBasis={isDesktopScreens ? "75%" : undefined}
          mt={isDesktopScreens ? "0.75rem" : "2rem"}
        >
          <ProductsWidget userId={userId} isProfile={true} />
        </Box>
      </Box>
    </Box>
  );
};

export default ProfilePage;
