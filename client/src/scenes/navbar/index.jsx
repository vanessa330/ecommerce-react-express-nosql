import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setMode, setLogout, setProducts } from "../../state";
import FlexBetween from "../../components/FlexBetween";
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  Select,
  MenuItem,
  FormControl,
  useTheme,
  useMediaQuery,
  Badge,
  Avatar,
} from "@mui/material";
import {
  Search,
  DarkMode,
  LightMode,
  Menu,
  Close,
  ShoppingCart,
  ManageAccounts,
  AddBusiness,
} from "@mui/icons-material";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // User details from Redux state
  const user = useSelector((state) => state.user);
  const fullName = user ? `${user.firstName} ${user.lastName}` : "Guest";

  // CSS
  const isDesktop = useMediaQuery("(min-width: 1000px)");
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
  const itemCount = useSelector((state) => state.itemCount).toString();
  const theme = useTheme();

  // Grab the searching results from Backend
  const rootUrl = process.env.REACT_APP_SERVER_URL;

  const [searchParam, setSearchParam] = useState("");

  const searchProducts = async () => {
    const res = await fetch(`${rootUrl}search?product=${searchParam}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    dispatch(setProducts({ products: data }));
    setSearchParam("");
  };

  const handleNavigateAndSearch = () => {
    navigate("/");
    searchProducts();
  };

  return (
    <FlexBetween
      padding="1rem 6%"
      backgroundColor={theme.palette.background.alt}
    >
      <FlexBetween gap="1.8rem">
        {/* LOGO START */}
        <Typography
          fontWeight="bold"
          fontSize="2rem"
          color={theme.palette.primary.main}
          onClick={handleNavigateAndSearch}
          sx={{
            "&:hover": {
              color: theme.palette.primary.light,
              cursor: "pointer",
            },
          }}
        >
          Post & Buy
        </Typography>
        {/* LOGO END */}

        {/* SEARCH BOX START */}
        {isDesktop && (
          <FlexBetween
            backgroundColor={theme.palette.neutral.light}
            borderRadius="9px"
            gap="2rem"
            padding="0.5rem 0.8rem"
          >
            <InputBase
              placeholder="Searching products..."
              value={searchParam}
              onChange={(e) => setSearchParam(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  searchProducts();
                }
              }}
            />
            <IconButton onClick={searchProducts}>
              <Search />
            </IconButton>
          </FlexBetween>
        )}
        {/* SEARCH BOX END */}
      </FlexBetween>

      {/* BUTTONS START */}
      {isDesktop ? (
        // DESKTOP BUTTONS
        <FlexBetween gap="1rem">
          <IconButton onClick={() => dispatch(setMode())}>
            {theme.palette.mode === "dark" ? (
              <DarkMode sx={{ fontSize: "25px" }} />
            ) : (
              <LightMode
                sx={{ color: theme.palette.neutral.dark, fontSize: "25px" }}
              />
            )}
          </IconButton>

          {fullName === "Guest" ? null : (
            <>
              <IconButton onClick={() => navigate(`/cart`)}>
                <ShoppingCart
                  sx={{ color: theme.palette.neutral.dark, fontSize: "25px" }}
                />
                {itemCount !== "0" && (
                  <Avatar
                    sx={{
                      backgroundColor: theme.palette.primary.main,
                      width: "20px",
                      height: "20px",
                      margin: "0 0 50%",
                    }}
                  >
                    <Badge
                      sx={{ color: theme.palette.primary.contrastText }}
                      badgeContent={itemCount}
                    />
                  </Avatar>
                )}
              </IconButton>

              <IconButton onClick={() => navigate(`/productform`)}>
                <AddBusiness
                  sx={{ color: theme.palette.neutral.dark, fontSize: "25px" }}
                />
              </IconButton>

              <IconButton onClick={() => navigate(`/manage`)}>
                <ManageAccounts
                  sx={{ color: theme.palette.neutral.dark, fontSize: "25px" }}
                />
              </IconButton>
            </>
          )}

          {/* User fullName, Login or Logout */}
          <FormControl variant="standard" value={fullName}>
            <Select
              value={fullName}
              sx={{
                backgroundColor: theme.palette.neutral.light,
                width: "150px",
                borderRadius: "0.25rem",
                p: "0.25rem 1rem",
                "& .MuiSvgIcon-root": {
                  pr: "0.25rem",
                  width: "3rem",
                },
                "& .MuiSelect-select:focus": {
                  backgroundColor: theme.palette.neutral.light,
                },
              }}
              input={<InputBase />}
            >
              {fullName !== "Guest" ? (
                <MenuItem
                  value={fullName}
                  onClick={() => navigate(`/profile/${user._id}`)}
                >
                  <Typography>{fullName}</Typography>
                </MenuItem>
              ) : (
                <MenuItem value={fullName}>
                  <Typography>{fullName}</Typography>
                </MenuItem>
              )}

              {fullName === "Guest" ? (
                <MenuItem
                  onClick={() => {
                    navigate("/auth");
                  }}
                >
                  Log In
                </MenuItem>
              ) : (
                <MenuItem
                  onClick={() => {
                    dispatch(setLogout());
                    navigate("/");
                  }}
                >
                  Log Out
                </MenuItem>
              )}
            </Select>
          </FormControl>
        </FlexBetween>
      ) : (
        <IconButton
          onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
        >
          <Menu />
        </IconButton>
      )}

      {!isDesktop && isMobileMenuToggled && (
        // MOBILE BUTTONS
        <Box
          position="fixed"
          right="0"
          bottom="0"
          height="100%"
          zIndex="10"
          maxWidth="500px"
          minWidth="300px"
          backgroundColor={theme.palette.background.default}
        >
          <Box display="flex" justifyContent="flex-end" p="1rem">
            <IconButton
              onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
            >
              <Close />
            </IconButton>
          </Box>

          <FlexBetween
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            gap="3rem"
          >
            {/* SEARCH BOX START */}
            <FlexBetween
              backgroundColor={theme.palette.neutral.light}
              borderRadius="9px"
              gap="1rem"
              padding="0.5rem 1rem"
            >
              <InputBase
                placeholder="Searching products..."
                value={searchParam}
                onChange={(e) => setSearchParam(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    searchProducts();
                  }
                }}
              />
              <IconButton onClick={searchProducts}>
                <Search />
              </IconButton>
            </FlexBetween>
            {/* SEARCH BOX END */}

            <IconButton
              onClick={() => dispatch(setMode())}
              sx={{ fontSize: "25px" }}
            >
              {theme.palette.mode === "dark" ? (
                <DarkMode sx={{ fontSize: "25px" }} />
              ) : (
                <LightMode
                  sx={{ color: theme.palette.neutral.dark, fontSize: "25px" }}
                />
              )}
            </IconButton>

            {fullName === "Guest" ? null : (
              <>
                <IconButton onClick={() => navigate(`/cart`)}>
                  <ShoppingCart
                    sx={{ color: theme.palette.neutral.dark, fontSize: "25px" }}
                  />
                  {itemCount !== "0" && (
                    <Avatar
                      sx={{
                        backgroundColor: theme.palette.primary.main,
                        width: "20px",
                        height: "20px",
                        margin: "0 0 50%",
                      }}
                    >
                      <Badge
                        sx={{ color: theme.palette.primary.contrastText }}
                        badgeContent={itemCount}
                      />
                    </Avatar>
                  )}
                </IconButton>

                <IconButton onClick={() => navigate(`/productform`)}>
                  <AddBusiness
                    sx={{ color: theme.palette.neutral.dark, fontSize: "25px" }}
                  />
                </IconButton>

                <IconButton onClick={() => navigate(`/manage`)}>
                  <ManageAccounts
                    sx={{ color: theme.palette.neutral.dark, fontSize: "25px" }}
                  />
                </IconButton>
              </>
            )}

            {/* User fullName, Login or Logout */}
            <FormControl variant="standard" value={fullName}>
              <Select
                value={fullName}
                sx={{
                  backgroundColor: theme.palette.neutral.light,
                  width: "150px",
                  borderRadius: "0.25rem",
                  p: "0.25rem 1rem",
                  "& .MuiSvgIcon-root": {
                    pr: "0.25rem",
                    width: "3rem",
                  },
                  "& .MuiSelect-select:focus": {
                    backgroundColor: theme.palette.neutral.light,
                  },
                }}
                input={<InputBase />}
              >
                {fullName !== "Guest" ? (
                  <MenuItem
                    value={fullName}
                    onClick={() => navigate(`/profile/${user._id}`)}
                  >
                    <Typography>{fullName}</Typography>
                  </MenuItem>
                ) : (
                  <MenuItem value={fullName}>
                    <Typography>{fullName}</Typography>
                  </MenuItem>
                )}

                {fullName === "Guest" ? (
                  <MenuItem
                    onClick={() => {
                      navigate("/auth");
                    }}
                  >
                    Log In
                  </MenuItem>
                ) : (
                  <MenuItem
                    onClick={() => {
                      dispatch(setLogout());
                      navigate("/");
                    }}
                  >
                    Log Out
                  </MenuItem>
                )}
              </Select>
            </FormControl>
          </FlexBetween>
        </Box>
      )}
      {/* BUTTONS END */}
    </FlexBetween>
  );
};

export default Navbar;
