import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { Blurhash } from "react-blurhash";

const ProductImage = ({ src, width, height }) => {
  const [imageLoading, setImageLoding] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImageLoding(true);
    };

    img.src = src;

  }, [src]);

  return (
    <Box>
      {!imageLoading && (
        <Blurhash
          hash="L6PZfSi_.AyE_3t7t7R**0o#DgR4"
          width={width}
          height={height}
          resolutionX={32}
          resolutionY={32}
          punch={1}
        />
      )}
      {imageLoading && (
        <img
          style={{ objectFit: "cover", borderRadius: "0.75rem" }}
          width={width}
          height={height}
          alt="productImage"
          src={src}
          crossOrigin="anonymous"
        />
      )}
    </Box>
  );
};

export default ProductImage;
