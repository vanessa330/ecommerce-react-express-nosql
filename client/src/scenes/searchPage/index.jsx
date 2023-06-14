import { useSelector } from "react-redux";
import ProductWidget from "../../components/ProductWidget";
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  Divider,
} from "@mui/material";

const SearchPage = () => {

  // Search Products from Redux state
  const searchProducts = useSelector((state) => state.searchProducts);

  // CSS
  const isDesktop = useMediaQuery("(min-width:1000px)");
  const theme = useTheme();

  return (
    <Box
      m={isDesktop ? "2rem auto" : "1rem auto"}
      maxWidth="1000px"
      p={isDesktop ? "1rem 10rem" : "1rem 0"}
    >
      <Typography
        variant="h3"
        color={theme.palette.neutral.dark}
        fontWeight="500"
        padding={isDesktop ? "1.5rem 1rem" : "2rem 1rem"}
      >
        {`${searchProducts.length} result ...`}
      </Typography>

      <Divider />

      {!searchProducts ? null : (
        <Box
          display="grid"
          gridTemplateColumns="repeat(auto-fit, minmax(300px, 1fr))"
          gap="2rem"
          m="2rem auto"
        >
          {searchProducts.map(({ _id }) => (
            <ProductWidget key={_id} id={_id} />
          ))}
        </Box>
      )}

      <Box />
    </Box>
  );
};

export default SearchPage;
