import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "../../state";

/* Formik validationSchema settings */

const registerSchema = yup.object().shape({
  email: yup.string().email("Invalid email format").required("required"),
  password: yup
    .string()
    .min(6, "Password must be 6 characters at minimum")
    .required("required"),
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
});

const loginSchema = yup.object().shape({
  email: yup.string().email("Invalid email format").required("required"),
  password: yup
    .string()
    .min(6, "Password must be 6 characters at minimum")
    .required("required"),
});

/* Formik initialValues settings */

const initialValuesRegister = {
  email: "",
  password: "",
  firstName: "",
  lastName: "",
  picture: "",
};

const initialValuesLogin = {
  email: "",
  password: "",
};

const Form = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // CSS
  const { palette } = useTheme();
  const isDesktop = useMediaQuery("(min-width:1000px)");
  const [pageType, setPageType] = useState("login");
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";

  const rootUrl = process.env.REACT_APP_SERVER_URL;

  /* Register Control */

  const register = async (values, onSubmitProps) => {
    const formData = new FormData();  
    for (let key in values) {
      formData.append(key, values[key]);
    }

    const savedUserResponse = await fetch(`${rootUrl}auth/register`, {
      method: "POST",
      body: formData, // FormData() automatically sets the "Content-Type"
    });

    const savedUser = await savedUserResponse.json();
    onSubmitProps.resetForm();

    if (savedUser) {
      window.alert("You have successfully registered!");
      setPageType("login");
    }
  };

  /* Login Control */

  const login = async (values, onSubmitProps) => {
    const loggedInResponse = await fetch(`${rootUrl}auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" }, // Send JSON req.body
      body: JSON.stringify(values),
    });

    const loggedIn = await loggedInResponse.json();
    onSubmitProps.resetForm();
    if (loggedIn) {
      dispatch(
        setLogin({
          user: loggedIn.user,
          token: loggedIn.token,
        })
      );
      navigate("/");
    }
  };

  return (
    <Formik
      onSubmit={async (values, onSubmitProps) => {
        if (isRegister) await register(values, onSubmitProps);
        if (isLogin) await login(values, onSubmitProps);
      }}
      validationSchema={isLogin ? loginSchema : registerSchema}
      initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        resetForm,
      }) => (
        <form onSubmit={handleSubmit}>
          <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(2, minmax(0, 1fr))"
            sx={{
              "& > div": { gridColumn: isDesktop ? undefined : "span 2" },
            }}
          >
            <TextField
              label="Email"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.email}
              name="email"
              error={Boolean(touched.email) && Boolean(errors.email)}
              helperText={touched.email && errors.email}
              sx={{ gridColumn: "span 2" }}
            />
            <TextField
              label="Password"
              type="password"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.password}
              name="password"
              error={Boolean(touched.password) && Boolean(errors.password)}
              helperText={touched.password && errors.password}
              sx={{ gridColumn: "span 2" }}
            />


            {isRegister && (
              <>
                <TextField
                  label="First Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.firstName}
                  name="firstName"
                  error={
                    Boolean(touched.firstName) && Boolean(errors.firstName)
                  }
                  helperText={touched.firstName && errors.firstName}
                  sx={{ gridColumn: "span 1" }}
                />
                <TextField
                  label="Last Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.lastName}
                  name="lastName"
                  error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                  helperText={touched.lastName && errors.lastName}
                  sx={{ gridColumn: "span 1" }}
                />
              </>
            )}
          </Box>


          <Box>
            <Button
              fullWidth
              type="submit"
              sx={{
                m: "2rem 0",
                p: "1rem",
                backgroundColor: palette.primary.main,
                color: palette.background.alt,
                "&:hover": { color: palette.primary.main },
              }}
            >
              {isLogin ? "LOGIN" : "REGISTER"}
            </Button>

            <Typography
              onClick={() => {
                setPageType(isLogin ? "register" : "login");
                resetForm();
              }}
              sx={{
                textDecoration: "underline",
                color: palette.primary.main,
                "&:hover": {
                  cursor: "pointer",
                  color: palette.primary.light,
                },
              }}
            >
              {isLogin
                ? "Don't have an account? Sign Up here."
                : "Already have an account? Login here."}
            </Typography>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default Form;
