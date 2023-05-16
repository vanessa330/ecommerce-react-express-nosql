import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "../../state";
import { Formik } from "formik";
import * as yup from "yup";
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
  IconButton,
} from "@mui/material";
import FlexBetween from "../../components/FlexBetween";
import WidgetWrapper from "../../components/WidgetWrapper";

const CreateWidget = () => {
  const dispatch = useDispatch();

  // User details from Redux state
  const token = useSelector((state) => state.token);
  const { _id } = useSelector((state) => state.user);

  const [newProduct, setNewProduct] = useState("");
  const [image, setImage] = useState(null);

  // CSS
  const { palette } = useTheme();
  const isDesktop = useMediaQuery("(min-width:1000px)");
  const [isUploadImage, setIsUploadImage] = useState(null);

  const rootUrl = process.env.REACT_APP_SERVER_URL;

  /* Create Product Control */

  const createProduct = async (values, onSubmitProps) => {
    const formData = new FormData();
    for (let key in values) {
      formData.append(key, values[key]);
    }
    if (values.picture) {
      formData.append("picturePath", values.picture.name);
    } else {
      formData.append("picturePath", "");
    }

    const savedProductResponse = await fetch(`${rootUrl}products`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const products = await savedProductResponse.json();
    dispatch(setProducts({ products }));
    setIsUploadImage(null);
  };

  if (token) {
    return (
        <WidgetWrapper>
          <Formik
            onSubmit={createProduct}
            validationSchema={yup.object().shape({
              userId: yup.string().required("required"),
              productName: yup.string().required("required"),
              price: yup.number().required("required"),
              description: yup.string().required("required"),
              picture: yup.string(),
            })}
            initialValues={{
              userId: "",
              productName: "",
              price: "",
              description: "",
              picture: "",
            }}
          >
            {({
              values,
              errors,
              touched,
              handleBlur,
              handleChange,
              handleSubmit,
              setFieldValue,
              resetForm,
            }) => (
              <form onSubmit={handleSubmit}>
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
                    label="Product Name"
                    onChange={handleChange}
                    value={values.productName}
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
                    label="Price"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.price}
                    name="price"
                    error={Boolean(touched.price) && Boolean(errors.price)}
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
                    label="Description"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.description}
                    name="description"
                    error={
                      Boolean(touched.description) && Boolean(errors.description)
                    }
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
                        onDrop={(acceptedFiles) => setImage(acceptedFiles[0])}
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
    
                              {!image ? (
                                <p>Add Image Here...</p>
                              ) : (
                                <FlexBetween>
                                  <Typography>{image.name}</Typography>
                                  <EditOutlined />
                                </FlexBetween>
                              )}
                            </Box>
    
                            {image && (
                              <IconButton
                                onClick={() => setImage(null)}
                                sx={{ width: "15%" }}
                              >
                                <DeleteOutlined />
                              </IconButton>
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
              </form>
            )}
          </Formik>
        </WidgetWrapper>
      );
  }
 
};

export default CreateWidget;
