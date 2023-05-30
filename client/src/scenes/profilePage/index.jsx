import { Box, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../navbar";
import UserWidget from "../widgets/UserWidget";
import ProductsWidget from "../widgets/ProductsWidget";

const ProfilePage = () => {
  // Grab the specified user
  const { userId } = useParams();
  const [user, setUser] = useState(null);

  // CSS
  const isDesktopScreens = useMediaQuery("(min-width:1000px)");

  const rootUrl = process.env.REACT_APP_SERVER_URL;

  const getUser = async () => {
    const res = await fetch(`${rootUrl}/users/${userId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    
    const data = await res.json();
    setUser(data);
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
        display={isDesktopScreens ? "flex" : "block"}
        gap="2rem"
        justifyContent="center"
      >

        <Box
          flexBasis={isDesktopScreens ? "20%" : undefined}
          m={isDesktopScreens ? "2rem 0.75rem" : undefined}
        >
          <UserWidget userId={userId} picturePath={user.picturePath} />
        </Box>

        <Box
          flexBasis={isDesktopScreens ? "75%" : undefined}
          m={isDesktopScreens ? "1rem 0.75rem" : undefined}
        >
          <ProductsWidget userId={userId} isProfile={true} />
        </Box>
      </Box>
    </Box>
  );
};

export default ProfilePage;
