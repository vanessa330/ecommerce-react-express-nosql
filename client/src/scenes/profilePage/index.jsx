import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "../../state";
import UserWidget from "../widgets/UserWidget";
import ProductWidget from "../widgets/ProductWidget";
import { Box, useMediaQuery } from "@mui/material";
import Spinner from "../../components/Spinner";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { userId } = useParams();

  // Specified user from Redux state
  const user = useSelector((state) => state.user);

  // Products from Redux state []
  const products = useSelector((state) => state.products);

  // CSS
  const isDesktop = useMediaQuery("(min-width:1000px)");
  const [isLoading, setIsLoading] = useState(false);

  // Connect to Backend
  const rootUrl = process.env.REACT_APP_SERVER_URL;

  const getUserProducts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${rootUrl}products/${userId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      dispatch(setProducts({ products: data }));
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUserProducts();
    // eslint-disable-next-line
  }, []);

  if (!user) return null;

  return (
    <Box m={isDesktop ? "2rem auto" : "1rem auto"} maxWidth="1200px">
      <Box
        display={isDesktop ? "flex" : "block"}
        justifyContent="center"
        alignContent="center"
      >
        <Box
          flexBasis={isDesktop ? "30%" : undefined}
          m={isDesktop ? "2rem" : "1rem"}
        >
          <UserWidget userId={userId} picturePath={user.picturePath} />
        </Box>

        <Box
          flexBasis={isDesktop ? "70%" : undefined}
          m={isDesktop ? "2rem 1rem" : "1rem"}
        >
          {isLoading ? (
            <Spinner />
          ) : (
            <Box
              display="grid"
              gridTemplateColumns="repeat(auto-fit, minmax(300px, 1fr))"
              gap="1.8rem"
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
          )}
          
        </Box>
      </Box>
    </Box>
  );
};

export default ProfilePage;
