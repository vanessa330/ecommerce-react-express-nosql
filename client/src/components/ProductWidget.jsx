import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProductImage from "./ProductImage";
import WidgetWrapper from "./WidgetWrapper";
import FlexBetween from "./FlexBetween";
import { Typography, useTheme } from "@mui/material";

const ProductWidget = ({ id }) => {
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);

  // CSS
  const theme = useTheme();

  // Connect to server
  const rootUrl = process.env.REACT_APP_SERVER_URL;

  const getProduct = async () => {
    try {
      const res = await fetch(`${rootUrl}products/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();

      if (res.status === 200) {
        setProduct(data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getProduct();
    // eslint-disable-next-line
  }, []);

  if (!product) {
    return null;
  } else {
    const { productName, price, quantity, picturePath } = product;
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
          <Typography
            variant="h4"
            color={theme.palette.neutral.main}
            p="0.5rem"
          >
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
  }
};

export default ProductWidget;
