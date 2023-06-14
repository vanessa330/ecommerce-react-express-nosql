import Form from "./Form";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";

const LoginPage = () => {
  // CSS
  const theme = useTheme();
  const isDesktop = useMediaQuery("(min-width: 1000px)");

  return (
      <Box
        width={isDesktop ? "70%" : "96%"}
        maxWidth="800px"
        p="2rem"
        m="2rem auto"
        borderRadius="1.5rem"
        backgroundColor={theme.palette.background.alt}
      >
        <Typography
          fontWeight="500"
          variant="h5"
          sx={{ mb: "1.5rem", lineHeight: "2rem" }}
        >
         For demo purposes only, please do not use your real personal information.
        </Typography>

        <Form />
      </Box>
  );
};

export default LoginPage;
