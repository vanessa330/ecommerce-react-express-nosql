import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "../../state";
import { Box } from "@mui/material";
import ProductWidget from "./ProductWidget";

const ProductsWidget = ({ userId, isProfile }) => {
  const dispatch = useDispatch();

  // Grab current products from Redux state []
  const products = useSelector((state) => state.products);

  // Grab updated products from Backend
  const rootUrl = process.env.REACT_APP_SERVER_URL;

  const getAllProducts = async () => {
    const res = await fetch(`${rootUrl}products`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    dispatch(setProducts({ products: data }));
  };

  const getUserProducts = async () => {
    const res = await fetch(`${rootUrl}products/${userId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    dispatch(setProducts({ products: data }));
  };

  useEffect(() => {
    if (isProfile) {
      getUserProducts(); // ProfilePage show specify user products
    } else {
      getAllProducts(); // HomePage show all products
    }
  }, []);

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
      }}
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
          comments,
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
            comments={comments}
          />
        )
      )}
    </Box>
  );
};

export default ProductsWidget;
