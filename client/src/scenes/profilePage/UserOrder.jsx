import { useState } from "react";
import FlexBetween from "../../components/FlexBetween";
import WidgetWrapper from "../../components/WidgetWrapper";
import {
  Box,
  Typography,
  useTheme,
  Divider,
  IconButton,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

const UserOrder = ({ id, items, subTotal, status }) => {
  // CSS
  const theme = useTheme();
  const [isMoreItems, setIsMoreItems] = useState(false);

  return (
    <WidgetWrapper mb="1rem" p="1rem 2rem">
      <FlexBetween m="0.2rem">
        <Typography
          variant="h5"
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

      <FlexBetween m="0.2rem">
        <Typography
          variant="h5"
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

      <FlexBetween m="0.2rem">
        <Typography
          variant="h5"
          color={theme.palette.neutral.dark}
          fontWeight="500"
          padding="0.5rem"
        >
          Items :
        </Typography>
        <IconButton onClick={() => setIsMoreItems(!isMoreItems)}>
          {!isMoreItems ? (
            <ExpandMore
              sx={{ color: theme.palette.primary.main, fontSize: "25px" }}
            />
          ) : (
            <ExpandLess
              sx={{ color: theme.palette.primary.main, fontSize: "25px" }}
            />
          )}
        </IconButton>
      </FlexBetween>

      {isMoreItems && (
        <>
          {items.map(({ productId, productName, quantity, price }) => (
            <Box key={productId}>
              <FlexBetween m="0.2rem">
                <Typography
                  flexBasis="60%"
                  variant="h6"
                  color={theme.palette.neutral.main}
                  paddingLeft="1rem"
                >
                  {productName}
                </Typography>

                <Typography
                  flexBasis="20%"
                  variant="h6"
                  color={theme.palette.neutral.main}
                >
                  {`x ${quantity}`}
                </Typography>

                <Typography
                  variant="h6"
                  color={theme.palette.neutral.main}
                  fontWeight="500"
                >
                  {`$ ${price.toFixed(2)}`}
                </Typography>
              </FlexBetween>
            </Box>
          ))}
        </>
      )}

      <Divider />

      <FlexBetween m="0.2rem">
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
    </WidgetWrapper>
  );
};

export default UserOrder;
