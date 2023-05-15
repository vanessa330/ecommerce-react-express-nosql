import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import Form from "./Form";
import Navbar from "../navbar";

const LoginPage = () => {
    // CSS
  const theme = useTheme();
  const isDesktopScreens = useMediaQuery("(min-width: 1000px)");

  return (
    <Box>
      <Navbar />
      
      <Box
        width={isDesktopScreens ? "70%" : "96%"}
        maxWidth="800px"
        p="2rem"
        m="2rem auto"
        borderRadius="1.5rem"
        backgroundColor={theme.palette.background.alt}
      >
        <Typography fontWeight="500" variant="h5" sx={{ mb: "1.5rem", lineHeight: 1.5 }}>
          Welcome to my FAKE e-commerce website! Please note that this is for
          demonstration purposes only, so we kindly ask that you refrain from
          using your real personal information.
        </Typography>
        <Form />
      </Box>
    </Box>
  );
};

export default LoginPage;
