import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import Navbar from "../navbar";
import ProductsWidget from "../widgets/ProductsWidget";
import UserWidget from "../widgets/UserWidget";
import CreateWidget from "../widgets/CreateWidget";

const HomePage = () => {
  // User details from Redux state
  const token = Boolean(useSelector((state) => state.token));
  const loggedInUser = useSelector((state) => state.user);

  // CSS
  const isDesktopScreens = useMediaQuery("(min-width:1000px)");

  return (
    <Box>
      <Navbar />

      {token && (
        <Box
          width="100%"
          padding="1rem 6%"
          display={isDesktopScreens ? "flex" : "block"}
          gap="2rem"
          justifyContent="center"
          alignItems="stretch"
        >
          <Box
            flexBasis={isDesktopScreens ? "28%" : undefined}
            mt={isDesktopScreens ? "1.5rem" : undefined}
            mb={isDesktopScreens ? undefined : "1.5rem"}
          >
            <UserWidget
              userId={loggedInUser._id}
              picturePath={loggedInUser.picturePath}
            />
          </Box>

          <Box
            flexBasis={isDesktopScreens ? "72%" : undefined}
            mt={isDesktopScreens ? "1.5rem" : undefined}
          >
            <CreateWidget />
          </Box>
        </Box>
      )}

      <Box m={isDesktopScreens ? "1rem 4rem" : "0.75rem"}>
        <ProductsWidget isProfile={false} />
      </Box>
    </Box>
  );
};

export default HomePage;
