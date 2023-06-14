import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setMode, setLogout, setSearchProducts } from "../state";
import FlexBetween from "./FlexBetween";
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
  FavoriteRounded,
  Home,
} from "@mui/icons-material";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // User details from Redux state
  const loggedInUser = useSelector((state) => state.loggedInUser);
  const role = useSelector((state) => state.loggedInUser?.role);
  const fullName = `${loggedInUser?.firstName} ${loggedInUser?.lastName}` || "";

  // CSS
  const isDesktop = useMediaQuery("(min-width: 1000px)");
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const itemCount = useSelector((state) => state.itemCount).toString();
  const theme = useTheme();

  // Grab the searching results from Backend
  const rootUrl = process.env.REACT_APP_SERVER_URL;

  const [searchParam, setSearchParam] = useState("");

  const searchProducts = async () => {
    try {
      const res = await fetch(`${rootUrl}search?product=${searchParam}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();

      if (res.status === 200) {
        dispatch(setSearchProducts({ searchProducts: data }));
        navigate(`/search`);
        setIsMobileMenuToggled(false);
        setSearchParam("");
      }
    } catch (err) {
      console.log(err);
    }
  };

  let menuRef = useRef();

  useEffect(() => {
    let handler = (e) => {
      if (!menuRef.current.contains(e.target)) {
        setIsMobileMenuToggled(false);
      } else {
        setIsMobileMenuToggled(true);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });

  return (
    <>
      <FlexBetween
        padding="1rem 6%"
        backgroundColor={theme.palette.background.alt}
      >
        {!isDesktop && (
          <IconButton
            onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
          >
            <Menu />
          </IconButton>
        )}
        <Box ref={menuRef} display={isDesktop ? "none" : undefined}>
          {!isDesktop && isMobileMenuToggled && (
            <Box
              position="fixed"
              left="0"
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

              <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                gap="3rem"
              >
                <IconButton
                  sx={{ fontSize: "25px" }}
                  onClick={() => {
                    setIsMobileMenuToggled(false);
                    navigate("/");
                  }}
                >
                  <Home
                    sx={{
                      color: theme.palette.neutral.dark,
                      fontSize: "25px",
                    }}
                  />
                </IconButton>

                <Typography>New Arrival</Typography>

                <Typography>Category</Typography>

                <Typography>Brand</Typography>

                <Typography>Contact Us</Typography>

                <IconButton
                  onClick={() => dispatch(setMode())}
                  sx={{ fontSize: "25px" }}
                >
                  {theme.palette.mode === "dark" ? (
                    <DarkMode sx={{ fontSize: "25px" }} />
                  ) : (
                    <LightMode
                      sx={{
                        color: theme.palette.neutral.dark,
                        fontSize: "25px",
                      }}
                    />
                  )}
                </IconButton>

                {loggedInUser ? (
                  <>
                    {role === "admin" && (
                      <Typography
                        sx={{
                          "&:hover": {
                            color: theme.palette.primary.light,
                            cursor: "pointer",
                          },
                        }}
                        onClick={() => {
                          setIsMobileMenuToggled(false);
                          navigate("/admin");
                        }}
                      >
                        Admin Panel
                      </Typography>
                    )}
                    <Typography
                      sx={{
                        "&:hover": {
                          color: theme.palette.primary.light,
                          cursor: "pointer",
                        },
                      }}
                      onClick={() => {
                        dispatch(setLogout());
                        setIsMobileMenuToggled(false);
                        navigate("/");
                      }}
                    >
                      Log Out
                    </Typography>
                  </>
                ) : (
                  <Typography
                    onClick={() => {
                      setIsMobileMenuToggled(false);
                      navigate("/auth");
                    }}
                  >
                    Log In
                  </Typography>
                )}
              </Box>
            </Box>
          )}
        </Box>

        <FlexBetween gap="2rem">
          <Typography
            fontWeight="bold"
            fontSize="1.75rem"
            color={theme.palette.primary.main}
            onClick={() => navigate("/")}
            sx={{
              "&:hover": {
                color: theme.palette.primary.light,
                cursor: "pointer",
              },
            }}
          >
            LOGO
          </Typography>

          {isDesktop && (
            <FlexBetween
              backgroundColor={theme.palette.neutral.light}
              borderRadius="9px"
              gap="2rem"
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
                <Search sx={{ fontSize: "25px" }} />
              </IconButton>
            </FlexBetween>
          )}
        </FlexBetween>

        <FlexBetween gap="1rem">
          {isDesktop && (
            <>
              <IconButton onClick={() => dispatch(setMode())}>
                {theme.palette.mode === "dark" ? (
                  <>
                    <DarkMode sx={{ fontSize: "25px" }} />
                    <Typography p="0.5rem">Light</Typography>
                  </>
                ) : (
                  <>
                    <LightMode
                      sx={{
                        color: theme.palette.neutral.dark,
                        fontSize: "25px",
                      }}
                    />
                    <Typography p="0.5rem">Dark</Typography>
                  </>
                )}
              </IconButton>

              <IconButton onClick={() => navigate(`/wishlist`)}>
                <FavoriteRounded
                  sx={{ color: theme.palette.neutral.dark, fontSize: "25px" }}
                />
                <Typography p="0.5rem">Wishlist</Typography>
              </IconButton>
            </>
          )}

          {!isDesktop && (
            <IconButton onClick={() => setShowSearchInput(!showSearchInput)}>
              <Search
                sx={{
                  color: theme.palette.neutral.dark,
                  fontSize: "25px",
                }}
              />
            </IconButton>
          )}

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
                  margin: "0 0 30%",
                  zIndex: "10",
                }}
              >
                <Badge
                  sx={{ color: theme.palette.primary.contrastText }}
                  badgeContent={itemCount}
                />
              </Avatar>
            )}
            {isDesktop && <Typography p="0.5rem">Cart</Typography>}
          </IconButton>

          {isDesktop && (
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
                {loggedInUser ? (
                  <MenuItem
                    value={fullName}
                    onClick={() => navigate(`/profile`)}
                  >
                    {fullName}
                  </MenuItem>
                ) : (
                  <MenuItem value={fullName}>Guest</MenuItem>
                )}

                {loggedInUser ? (
                  <Box>
                    {role === "admin" && (
                      <MenuItem
                        onClick={() => {
                          navigate("/admin");
                        }}
                      >
                        Admin Panel
                      </MenuItem>
                    )}
                    <MenuItem
                      onClick={() => {
                        dispatch(setLogout());
                        navigate("/");
                      }}
                    >
                      Log Out
                    </MenuItem>
                  </Box>
                ) : (
                  <MenuItem
                    onClick={() => {
                      navigate("/auth");
                    }}
                  >
                    Log In
                  </MenuItem>
                )}
              </Select>
            </FormControl>
          )}
        </FlexBetween>
      </FlexBetween>

      <FlexBetween>
        {showSearchInput && (
          <Box
            width="100%"
            padding="0.8rem 6% 1.5rem"
            backgroundColor={theme.palette.background.alt}
          >
            <FlexBetween
              backgroundColor={theme.palette.neutral.light}
              borderRadius="9px"
              gap="2rem"
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
                <Search sx={{ fontSize: "25px" }} />
              </IconButton>
            </FlexBetween>
          </Box>
        )}
      </FlexBetween>
    </>
  );
};

export default Navbar;
