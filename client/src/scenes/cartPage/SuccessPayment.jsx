
import WidgetWrapper from "../../components/WidgetWrapper";
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";

const SuccessPayment = () => {
  // CSS
  const theme = useTheme();
  const isDesktop = useMediaQuery("(min-width:1000px)");

  return (
    <Box
      m={isDesktop ? "2rem auto" : "1rem auto"}
      maxWidth="1200px"
      p={isDesktop ? "1rem 10rem" : "1rem 0"}
    >
      <WidgetWrapper>
        <Typography
          variant="h3"
          color={theme.palette.neutral.dark}
          fontWeight="500"
          padding={isDesktop ? "1rem 3rem" : "1rem"}
        >
          Thank you for your payment! We are happy to confirm that your
          transaction has been successfully processed.
        </Typography>

      </WidgetWrapper>
    </Box>
  );
};
export default SuccessPayment;
