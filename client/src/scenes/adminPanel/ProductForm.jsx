import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Dropzone from "react-dropzone";
import { useSelector } from "react-redux";
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

const ProductForm = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  // User details from Redux state
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.loggedInUser._id);

  // Product details
  const [product, setProduct] = useState({}); // for editing product
  const [newProductName, setNewProductName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newQuantity, setNewQuantity] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newBrand, setNewBrand] = useState("");
  const [newImage, setNewImage] = useState("");

  // CSS
  const theme = useTheme();
  const isDesktop = useMediaQuery("(min-width:1000px)");

  const rootUrl = process.env.REACT_APP_SERVER_URL;

  const getProduct = async () => {
    try {
      const res = await fetch(`${rootUrl}products/${productId}`, {
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
    if (productId) {
      getProduct();
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setNewProductName(product.productName || "");
    setNewPrice(product.price || "");
    setNewQuantity(product.quantity || "");
    setNewDescription(product.description || "");
    setNewCategory(product.category || "");
    setNewBrand(product.brand || "");
  }, [product]);

  const addProduct = async () => {
    const formData = new FormData();
    formData.append("productName", newProductName);
    formData.append("price", Number(newPrice));
    formData.append("quantity", Number(newQuantity));
    formData.append("description", newDescription);
    formData.append("category", newCategory);
    formData.append("brand", newBrand);
    if (newImage) {
      formData.append("file", newImage);
      formData.append("picturePath", newImage.name);
    }

    try {
      const res = await fetch(`${rootUrl}products/${loggedInUserId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      await res.json();

      if (res.status === 201) {
        window.alert("You have successfully created a new product.");
        navigate(`/admin`);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const editProduct = async () => {
    const formData = new FormData();
    formData.append("productName", newProductName);
    formData.append("price", Number(newPrice));
    formData.append("quantity", Number(newQuantity));
    formData.append("description", newDescription);
    formData.append("category", newCategory);
    formData.append("brand", newBrand);
    if (newImage) {
      formData.append("file", newImage);
      formData.append("picturePath", newImage.name);
    }

    try {
      const res = await fetch(
        `${rootUrl}products/${productId}/edit/${loggedInUserId}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );
      await res.json();

      if (res.status === 200) {
        window.alert("You have successfully edited the product.");
        navigate(`/admin`);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box
      width={isDesktop ? "80%" : "96%"}
      maxWidth="1000px"
      p="2rem"
      m="2rem auto"
      borderRadius="1.5rem"
      backgroundColor={theme.palette.background.alt}
    >
      <WidgetWrapper>
        <Typography
          variant="h2"
          color={theme.palette.neutral.dark}
          fontWeight="500"
          padding={isDesktop ? "1rem 3rem" : "1rem"}
        >
          {!productId ? "Add a product :" : "Edit the product :"}
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
            onChange={(e) => setNewPrice(e.target.value)}
            value={newPrice}
            name="price"
            type="number"
            sx={{
              width: "100%",
              borderRadius: "2rem",
              margin: "1rem 0",
            }}
          />

          <TextField
            label="Quantity"
            onChange={(e) => setNewQuantity(e.target.value)}
            value={newQuantity}
            name="quantity"
            type="number"
            sx={{
              width: "100%",
              borderRadius: "2rem",
              margin: "1rem 0",
            }}
          />

          <TextField
            label="Description"
            onChange={(e) => setNewDescription(e.target.value)}
            value={newDescription}
            name="description"
            multiline
            rows={4}
            sx={{
              width: "100%",
              borderRadius: "2rem",
              margin: "1rem 0",
            }}
          />

          <TextField
            label="Category"
            onChange={(e) => setNewCategory(e.target.value)}
            value={newCategory}
            name="category"
            sx={{
              width: "100%",
              borderRadius: "2rem",
              margin: "1rem 0",
            }}
          />

          <TextField
            label="Brand"
            onChange={(e) => setNewBrand(e.target.value)}
            value={newBrand}
            name="brand"
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
              onClick={!productId ? addProduct : editProduct}
            >
              {!productId ? "Add Product" : "Save Changes"}
            </Button>

            <Button
              sx={{
                p: "1rem",
                m: "0.5rem",
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.background.alt,
                "&:hover": { color: theme.palette.primary.main },
              }}
              onClick={() => navigate(`/admin`)}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </WidgetWrapper>
    </Box>
  );
};

export default ProductForm;
