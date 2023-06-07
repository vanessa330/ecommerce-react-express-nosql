import Navbar from "../navbar";
import ProductsWidget from "../widgets/ProductsWidget";
import { Box, useMediaQuery } from "@mui/material";

const HomePage = () => {
  // CSS
  const isDesktop = useMediaQuery("(min-width:1000px)");

  return (
    <Box>
      <Navbar />

      <Box m={isDesktop ? "1rem 4rem" : "0.75rem"}>
        <ProductsWidget isProfile={false} />
      </Box>
    </Box>
  );
};

export default HomePage;
