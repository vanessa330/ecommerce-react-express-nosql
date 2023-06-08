import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Dropzone from "react-dropzone";
import { useDispatch, useSelector } from "react-redux";
import { setProducts, setProduct } from "../../state";
import FlexBetween from "../../components/FlexBetween";
import {
  useMediaQuery,
  Box,
  Typography,
  useTheme,
  Button,
  Divider,
  TextField,
} from "@mui/material";
import { DeleteOutlined, EditOutlined } from "@mui/icons-material";
import WidgetWrapper from "../../components/WidgetWrapper";

const ProductFormPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { productId } = useParams();

  // User details from Redux state
  const token = useSelector((state) => state.token);
  const { _id } = useSelector((state) => state.loggedInUser);

  // Product details from Redux state
  const product = useSelector((state) =>
    state.products.find((product) => product._id === productId)
  );
  const initialProductName = product?.productName || "";
  const initialPrice = product?.price || "";
  const initialDescription = product?.description || "";

  const [newProductName, setNewProductName] = useState(initialProductName);
  const [newProductPrice, setNewProductPrice] = useState(initialPrice);
  const [newProductDes, setNewProdcutDes] = useState(initialDescription);
  const [newImage, setNewImage] = useState("");

  // CSS
  const theme = useTheme();
  const isDesktop = useMediaQuery("(min-width:1000px)");

  const rootUrl = process.env.REACT_APP_SERVER_URL;

  const createProduct = async () => {
    const formData = new FormData();
    formData.append("userId", _id);
    formData.append("productName", newProductName);
    formData.append("price", newProductPrice);
    formData.append("description", newProductDes);
    if (newImage) {
      formData.append("file", newImage); // "file" refer to Backend
      formData.append("picturePath", newImage.name);
    }

    const res = await fetch(`${rootUrl}products`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const data = await res.json();

    if (res.status === 201) {
      dispatch(setProducts({ products: data }));
      window.alert("You have successfully created a new product.");
      setNewProductName("");
      setNewProductPrice("");
      setNewProdcutDes("");
      setNewImage("");
      navigate(`/manage`);
    }
  };

  const editProduct = async () => {
    const formData = new FormData();
    formData.append("productName", newProductName);
    formData.append("price", newProductPrice);
    formData.append("description", newProductDes);
    if (newImage) {
      formData.append("file", newImage); // "file" refer to Backend
      formData.append("picturePath", newImage.name);
    }

    const res = await fetch(`${rootUrl}products/${productId}/edit`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const data = await res.json();

    if (res.status === 200) {
      dispatch(setProduct({ product: data }));
      window.alert("You have successfully edited the product.");
      setNewProductName("");
      setNewProductPrice("");
      setNewProdcutDes("");
      setNewImage("");
      navigate(`/manage`);
    }
  };

  return (
    <Box
      m={isDesktop ? "2rem auto" : "1rem auto"}
      maxWidth="1200px"
      p={isDesktop ? "1rem 10rem" : "1rem 0"}
    >
      <WidgetWrapper>
        <Typography
          variant="h2"
          color={theme.palette.neutral.dark}
          fontWeight="500"
          padding={isDesktop ? "1rem 3rem" : "1rem"}
        >
          {productId ? "Edit the product :" : "Create a product :"}
        </Typography>

        <Divider />

        <Box m={isDesktop ? "2rem" : "1rem"}>
          <TextField
            label="Product Name"
            onChange={(e) => setNewProductName(e.target.value)}
            value={newProductName}
            name="productName"
            sx={{
              width: "100%",
              borderRadius: "2rem",
              margin: "1rem 0",
            }}
          />

          <TextField
            label="Price"
            onChange={(e) => setNewProductPrice(e.target.value)}
            value={newProductPrice}
            name="price"
            type="number"
            sx={{
              width: "100%",
              borderRadius: "2rem",
              margin: "1rem 0",
            }}
          />

          <TextField
            label="Description"
            onChange={(e) => setNewProdcutDes(e.target.value)}
            value={newProductDes}
            name="description"
            multiline
            rows={4}
            sx={{
              width: "100%",
              borderRadius: "2rem",
              margin: "1rem 0",
            }}
          />

          <Box
            gridColumn="span 2"
            border={`1px dashed ${theme.palette.neutral.medium}`}
            borderRadius="8px"
            p="1rem"
            m="1rem 0 2rem"
          >
            <Dropzone
              acceptedFiles=".jpg,.jpeg,.png,.gif,.webp"
              multiple={false}
              onDrop={(acceptedFiles) => setNewImage(acceptedFiles[0])}
            >
              {({ getRootProps, getInputProps }) => (
                <FlexBetween>
                  <Box
                    {...getRootProps()}
                    border={`2px dashed ${theme.palette.primary.main}`}
                    p="1rem"
                    width="100%"
                    sx={{ "&:hover": { cursor: "pointer" } }}
                  >
                    <input {...getInputProps()} />
                    {!newImage ? (
                      <p>Add Image Here...</p>
                    ) : (
                      <FlexBetween>
                        <Typography>{newImage.name}</Typography>
                        <EditOutlined />
                      </FlexBetween>
                    )}
                  </Box>

                  {newImage && (
                    <Button
                      onClick={() => setNewImage(null)}
                      sx={{ width: "15%" }}
                    >
                      <DeleteOutlined />
                    </Button>
                  )}
                </FlexBetween>
              )}
            </Dropzone>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              sx={{
                p: "1rem",
                m: "0.5rem",
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.background.alt,
                "&:hover": { color: theme.palette.primary.main },
              }}
              onClick={productId ? editProduct : createProduct}
            >
              {productId ? "Save Changes" : "Create Product"}
            </Button>

            <Button
              sx={{
                p: "1rem",
                m: "0.5rem",
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.background.alt,
                "&:hover": { color: theme.palette.primary.main },
              }}
              onClick={() => navigate(`/manage`)}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </WidgetWrapper>
    </Box>
  );
};

export default ProductFormPage;
