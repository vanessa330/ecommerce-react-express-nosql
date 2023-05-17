import { Box, useMediaQuery } from "@mui/material";
import Navbar from "../navbar";
import { useSelector } from "react-redux";
import UserWidget from "../widgets/UserWidget";
import CreateWidget from "../widgets/CreateWidget";

const ManageAccountPage = () => {
  const user = useSelector((state) => state.user);

  const isDesktopScreens = useMediaQuery("(min-width:1000px)");

  return (
    <Box>
      <Navbar />

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
          <UserWidget userId={user._id} picturePath={user.picturePath} />
        </Box>

        <Box
          flexBasis={isDesktopScreens ? "72%" : undefined}
          mt={isDesktopScreens ? "1.5rem" : undefined}
        >
          <CreateWidget />
        </Box>
      </Box>
      <Box>
        {/* Edit */}
        {/* Account detail */}
      </Box>
    </Box>
  );
};

export default ManageAccountPage;
