import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProductImage from "./ProductImage";
import WidgetWrapper from "./WidgetWrapper";
import FlexBetween from "./FlexBetween";
import { Typography, useTheme } from "@mui/material";

const ProductWidget = ({ id, productName, price, quantity, picturePath }) => {
  const navigate = useNavigate();

  // CSS
  const theme = useTheme();

  const rootUrl = process.env.REACT_APP_SERVER_URL;

  return (
    <WidgetWrapper>
      <FlexBetween m="0.8rem">
        <Typography
          variant="h3"
          color={theme.palette.neutral.dark}
          p="0.5rem"
          fontWeight="500"
          onClick={() => navigate(`/product/${id}`)}
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            "&:hover": {
              color: theme.palette.primary.light,
              cursor: "pointer",
            },
          }}
        >
          {productName}
        </Typography>
      </FlexBetween>

      {picturePath && (
        <ProductImage
          src={`${rootUrl}assets/${picturePath}`}
          width="100%"
          height="300px"
        />
      )}

      <FlexBetween m="1rem">
        <Typography variant="h4" color={theme.palette.neutral.main} p="0.5rem">
          $ {price.toFixed(2)}
        </Typography>

        {quantity > 0 ? (
          <Typography variant="h5" color="green">
            In Stock
          </Typography>
        ) : (
          <Typography variant="h5" color="red">
            Out Of Stock
          </Typography>
        )}
      </FlexBetween>
    </WidgetWrapper>
  );
};

export default ProductWidget;
