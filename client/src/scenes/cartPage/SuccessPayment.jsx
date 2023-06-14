import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCartToNull } from "../../state";
import WidgetWrapper from "../../components/WidgetWrapper";
import {
  Button,
  Box,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";

const SuccessPayment = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // CSS
  const theme = useTheme();
  const isDesktop = useMediaQuery("(min-width:1000px)");

  useEffect(() => {
    dispatch(setCartToNull());
    // eslint-disable-next-line
  }, []);

  return (
    <Box
      m={isDesktop ? "2rem auto" : "1rem auto"}
      maxWidth="1000px"
      p={isDesktop ? "1rem 10rem" : "1rem 0"}
    >
      <WidgetWrapper>
        <Typography
          variant="h3"
          color={theme.palette.neutral.dark}
          fontWeight="500"
          padding={isDesktop ? "1rem 3rem" : "1rem"}
          sx={{
            lineHeight: "2.5rem",
          }}
        >
          Thank you for your payment! We are happy to confirm that your
          transaction has been successfully processed.
        </Typography>

        <Box m="1rem auto" maxWidth="200px">
          <Button
            sx={{
              p: "1rem",
              m: "0.5rem",
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.background.alt,
              "&:hover": { color: theme.palette.primary.main },
            }}
            onClick={() => navigate(`/`)}
          >
            Continue to shop
          </Button>
        </Box>
      </WidgetWrapper>
    </Box>
  );
};
export default SuccessPayment;
