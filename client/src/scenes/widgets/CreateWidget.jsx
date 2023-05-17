import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "../../state";
import Dropzone from "react-dropzone";
import {
  DeleteOutlined,
  ImageOutlined,
  EditOutlined,
  Send,
} from "@mui/icons-material";
import {
  useMediaQuery,
  Box,
  Typography,
  useTheme,
  Button,
  InputBase,
} from "@mui/material";
import FlexBetween from "../../components/FlexBetween";
import WidgetWrapper from "../../components/WidgetWrapper";

const CreateWidget = () => {
  const dispatch = useDispatch();

  // User details from Redux state
  const token = useSelector((state) => state.token);
  const { _id } = useSelector((state) => state.user);

  const [newProductName, setNewProductName] = useState("");
  const [newProductPrice, setNewProductPrice] = useState("");
  const [newProductDes, setNewProdcutDes] = useState("");
  const [newImage, setNewImage] = useState(null);

  // CSS
  const { palette } = useTheme();
  const isDesktop = useMediaQuery("(min-width:1000px)");
  const [isUploadImage, setIsUploadImage] = useState(null);

  const rootUrl = process.env.REACT_APP_SERVER_URL;

  /* Create Product Control */

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

    const savedProductResponse = await fetch(`${rootUrl}products`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const products = await savedProductResponse.json();
    dispatch(setProducts({ products }));
    setNewProductName("");
    setNewProductPrice("");
    setNewProdcutDes("");
    setNewImage("");
    setIsUploadImage(null);
  };

  if (token) {
    return (
      <WidgetWrapper>
        <Box
          display="grid"
          gap="18px"
          gridTemplateColumns="repeat(2, minmax(0, 1fr))"
          sx={{
            "& > div": { gridColumn: isDesktop ? undefined : "span 2" },
          }}
        >
          <InputBase
            placeholder="Product name..."
            onChange={(e) => setNewProductName(e.target.value)}
            value={newProductName}
            name="productName"
            sx={{
              gridColumn: "span 1",
              width: "100%",
              backgroundColor: palette.neutral.light,
              borderRadius: "2rem",
              padding: "1rem 2rem",
            }}
          />

          <InputBase
            placeholder="Price..."
            onChange={(e) => setNewProductPrice(e.target.value)}
            value={newProductPrice}
            name="price"
            sx={{
              gridColumn: "span 1",
              width: "100%",
              backgroundColor: palette.neutral.light,
              borderRadius: "2rem",
              padding: "1rem 2rem",
            }}
          />
          <InputBase
            placeholder="Description..."
            onChange={(e) => setNewProdcutDes(e.target.value)}
            value={newProductDes}
            name="description"
            sx={{
              gridColumn: "span 2",
              width: "100%",
              backgroundColor: palette.neutral.light,
              borderRadius: "2rem",
              padding: "1rem 2rem",
            }}
          />

          {isUploadImage && (
            <Box
              gridColumn="span 2"
              border={`1px solid ${palette.neutral.medium}`}
              borderRadius="5px"
              p="1rem"
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
                      border={`2px dashed ${palette.primary.main}`}
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
          )}

          <Box m="0 1.5rem" sx={{ gridColumn: "span 2" }}>
            <FlexBetween>
              <FlexBetween
                gap="0.5rem"
                onClick={() => setIsUploadImage(!isUploadImage)}
              >
                <ImageOutlined sx={{ color: palette.neutral.mediumMain }} />
                <Typography
                  color={palette.neutral.mediumMain}
                  sx={{
                    "&:hover": {
                      cursor: "pointer",
                      color: palette.neutral.medium,
                    },
                  }}
                >
                  Image
                </Typography>
              </FlexBetween>

              <Button
                type="submit"
                onClick={createProduct}
                disabled={!newProductName}
                sx={{
                  p: "0.6rem",
                  backgroundColor: palette.primary.main,
                  color: palette.background.alt,
                  "&:hover": { color: palette.primary.main },
                }}
              >
                <Send />
              </Button>
            </FlexBetween>
          </Box>
        </Box>
      </WidgetWrapper>
    );
  }
};

export default CreateWidget;
