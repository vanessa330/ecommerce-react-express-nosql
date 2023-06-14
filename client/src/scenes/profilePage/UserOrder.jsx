import FlexBetween from "../../components/FlexBetween";
import WidgetWrapper from "../../components/WidgetWrapper";
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  Divider,
} from "@mui/material";

const UserOrder = ({ id, items, subTotal, status }) => {
  // CSS
  const theme = useTheme();
  const isDesktop = useMediaQuery("(min-width:1000px)");

  return (
    <WidgetWrapper p="1rem 2rem">
      <FlexBetween>
        <Typography
          variant="h4"
          color={theme.palette.neutral.dark}
          fontWeight="500"
          padding="0.5rem"
        >
          Ref No :
        </Typography>
        <Typography
          variant="h5"
          color={theme.palette.neutral.main}
          fontWeight="500"
          padding="0.5rem"
        >
          {id}
        </Typography>
      </FlexBetween>

      <FlexBetween>
        <Typography
          variant="h4"
          color={theme.palette.neutral.dark}
          fontWeight="500"
          padding="0.5rem"
        >
          Status :
        </Typography>
        <Typography
          variant="h5"
          color={theme.palette.neutral.main}
          fontWeight="500"
          padding="0.5rem"
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Typography>
      </FlexBetween>

      <Box>
        <Typography
          variant="h4"
          color={theme.palette.neutral.dark}
          fontWeight="500"
          padding="0.5rem"
        >
          Items :
        </Typography>
        {items.map(({ productId, productName, quantity, price }) => (
          <Box key={productId}>
            <FlexBetween>
              <Typography
                variant="h5"
                color={theme.palette.neutral.main}
                fontWeight="500"
                padding="0.5rem"
                paddingLeft="1rem"
              >
                {productName}
              </Typography>

              <Typography
                variant="h5"
                color={theme.palette.neutral.main}
                fontWeight="500"
                padding="0.5rem"
              >
                {`x ${quantity}`}
              </Typography>

              <Typography
                variant="h5"
                color={theme.palette.neutral.main}
                fontWeight="500"
                padding="0.5rem"
              >
                {`$ ${price.toFixed(2)}`}
              </Typography>
            </FlexBetween>
          </Box>
        ))}
      </Box>

      <Divider />

      <Box>
        <FlexBetween>
          <Typography
            variant="h4"
            color={theme.palette.neutral.dark}
            fontWeight="500"
            padding="0.5rem"
          >
            Total :
          </Typography>
          <Typography
            variant="h4"
            color={theme.palette.neutral.dark}
            fontWeight="500"
            padding="0.5rem"
          >
            $ {subTotal.toFixed(2)}
          </Typography>
        </FlexBetween>
      </Box>
    </WidgetWrapper>
  );
};

export default UserOrder;
