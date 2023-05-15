import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setProduct } from "../../state";
import {
  EditNote,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ChatBubbleRounded,
  ChatBubbleOutlineOutlined,
  Reply,
  DeleteForever,
  ChatBubbleOutline,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  IconButton,
  Typography,
  useTheme,
  InputBase,
  Button,
} from "@mui/material";
import FlexBetween from "../../components/FlexBetween";
import WidgetWrapper from "../../components/WidgetWrapper";

const EditProductWidget = () => {
  //   PATCH TO BACKEND

  const updatedBody = {
    productName: updatedProductName,
    price: updatedprice,
    description: updatedDescription,
    picturePath: updatedPicturePath,
  };

  const patchProduct = async () => {
    const res = await fetch(`${rootUrl}products/${id}/${userId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedBody),
    });
    const updatedProduct = await res.json();
    dispatch(setProduct({ product: updatedProduct }));
  };

  const deleteProduct = async () => {
    const res = await fetch(`${rootUrl}product/${id}/${userId}/delete`, {
      method: "delete",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const updatedProduct = await res.json();
    dispatch(setProduct({ product: updatedProduct }));
  };

  return <WidgetWrapper m="2rem 0"></WidgetWrapper>;
};

export default EditProductWidget;
