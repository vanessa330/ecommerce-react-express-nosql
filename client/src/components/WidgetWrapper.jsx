import { Box } from "@mui/material";
import { styled } from "@mui/system";

// CSS
const WidgetWrapper = styled(Box)(({ theme }) => ({
  borderRadius: "0.75rem",
  padding: "1.5rem",
  backgroundColor: theme.palette.background.alt,
}));

export default WidgetWrapper;