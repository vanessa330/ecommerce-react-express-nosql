import { useSelector } from "react-redux";
import ProductWidget from "../widgets/ProductWidget";
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  Divider,
} from "@mui/material";

const SearchPage = () => {
  // Products from Redux state []
  const products = useSelector((state) => state.searchProducts);

  // CSS
  const isDesktop = useMediaQuery("(min-width:1000px)");
  const theme = useTheme();

  return (
    <Box
      m={isDesktop ? "2rem auto" : "1rem auto"}
      maxWidth="1200px"
      p={isDesktop ? "1rem 10rem" : "1rem 0"}
    >
      <Typography
        variant="h3"
        color={theme.palette.neutral.dark}
        fontWeight="500"
        padding={isDesktop ? "1.5rem 1rem" : "2rem 1rem"}
      >
        {`${products.length} result ...`}
      </Typography>

      <Divider />

      <Box
        display="grid"
        gridTemplateColumns="repeat(auto-fit, minmax(300px, 1fr))"
        gap="2rem"
        m="2rem auto"
      >
        {products.map(
          ({
            _id,
            userId,
            firstName,
            lastName,
            productName,
            price,
            description,
            picturePath,
            likes,
          }) => (
            <ProductWidget
              key={_id}
              id={_id}
              userId={userId}
              name={`${firstName} ${lastName}`}
              productName={productName}
              price={price}
              description={description}
              picturePath={picturePath}
              likes={likes}
            />
          )
        )}
      </Box>

      <Box />
    </Box>
  );
};

export default SearchPage;
