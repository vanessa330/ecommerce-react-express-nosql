import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setProductIds} from "../../state";
import WidgetWrapper from "../../components/WidgetWrapper";
import {
  Box,
  Typography,
  useMediaQuery,
  useTheme,
  IconButton,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { AddCircle, Edit, Delete } from "@mui/icons-material";

const AdminPanel = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // User details from Redux state
  const token = useSelector((state) => state.token);
  const loggedInUser = useSelector((state) => state.loggedInUser);

  // Products details from server
  const [productsDetails, setProductsDetails] = useState([]);

  // CSS
  const theme = useTheme();
  const isDesktop = useMediaQuery("(min-width:1000px)");
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [deleteMsg, setDeleteMsg] = useState(false);

  // Connect to server
  const rootUrl = process.env.REACT_APP_SERVER_URL;

  const getProducts = async () => {
    try {
      const res = await fetch(`${rootUrl}products`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();

      if (res.status === 200) {
        setProductsDetails(data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getProducts();
    // eslint-disable-next-line
  }, []);

  return (
    <Box
      m={isDesktop ? "2rem auto" : "1rem auto"}
      maxWidth="1000px"
      p={isDesktop ? "1rem 4rem" : "1rem 0"}
    >
      <WidgetWrapper>
        <Typography
          variant="h2"
          color={theme.palette.neutral.dark}
          fontWeight="500"
          padding={isDesktop ? "1rem 3rem" : "1rem"}
        >
          Admin Panel :
        </Typography>

        <Divider />

        {deleteMsg && (
          <Box
            p={isDesktop ? "1rem 4rem" : "1rem 0"}
            backgroundColor={theme.palette.primary.main}
            borderRadius="15px"
          >
            <Typography textAlign="center" fontWeight="500">
              Important Message: You have successfully deleted the product.
            </Typography>
          </Box>
        )}

        <Box p={isDesktop ? "0 1.5rem" : undefined}>
          <IconButton onClick={() => navigate(`/admin/add`)}>
            <AddCircle
              sx={{
                margin: "10px",
                color: theme.palette.neutral.dark,
                fontSize: "20px",
              }}
            />
            <Typography fontWeight="500">Add</Typography>
          </IconButton>

          {selectedItemId !== null && (
            <>
              <IconButton
                onClick={() => navigate(`/admin/edit/${selectedItemId}`)}
              >
                <Edit
                  sx={{
                    margin: "10px",
                    color: theme.palette.neutral.dark,
                    fontSize: "25px",
                  }}
                />
                <Typography fontWeight="500">Edit</Typography>
              </IconButton>
              <IconButton
                onClick={async () => {
                  const confirmed = window.confirm(
                    "Are you sure you want to delete this product?"
                  );
                  if (!confirmed) return;

                  const res = await fetch(
                    `${rootUrl}products/${selectedItemId}/delete/${loggedInUser._id}`,
                    {
                      method: "DELETE",
                      headers: { Authorization: `Bearer ${token}` },
                    }
                  );
                  if (res.status === 200) {
                    getProducts();
                    setDeleteMsg(true);
                  }
                }}
              >
                <Delete
                  sx={{
                    margin: "10px",
                    color: theme.palette.neutral.dark,
                    fontSize: "25px",
                  }}
                />
                <Typography fontWeight="500">Delete</Typography>
              </IconButton>
            </>
          )}
        </Box>

        <Paper sx={{ width: "100%", mb: 2 }}>
          <TableContainer>
            <Table sx={{ minWidth: 750 }}>
              <TableHead>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Product Name
                  </TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Brand</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Qty</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {productsDetails.map(
                  ({ id, productName, price, quantity, category, brand }) => {
                    const isSelected = selectedItemId === id;
                    return (
                      <TableRow
                        hover
                        key={id}
                        aria-checked={isSelected}
                        selected={isSelected}
                        sx={{ cursor: "pointer" }}
                        onClick={() => setSelectedItemId(id)}
                      >
                        <TableCell component="th" scope="row">
                          {productName}
                        </TableCell>

                        <TableCell>{category}</TableCell>
                        <TableCell>{brand}</TableCell>
                        <TableCell>{price.toFixed(2)}</TableCell>
                        <TableCell>{quantity}</TableCell>
                      </TableRow>
                    );
                  }
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </WidgetWrapper>
    </Box>
  );
};

export default AdminPanel;
