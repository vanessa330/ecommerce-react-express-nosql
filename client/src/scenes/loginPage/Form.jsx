import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "../../state";
import { Formik } from "formik";
import * as yup from "yup";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
} from "@mui/material";

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
};

const initialValuesLogin = {
  email: "",
  password: "",
};

const Form = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // CSS
  const theme = useTheme();
  const isDesktop = useMediaQuery("(min-width:1000px)");
  const [pageType, setPageType] = useState("login");
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";

  /* Register Control */

  const rootUrl = process.env.REACT_APP_SERVER_URL;

  const register = async (values, onSubmitProps) => {
    try {
      const res = await fetch(`${rootUrl}auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();

      if (res.status === 201) {
        window.alert(data.success);
        setPageType("login");
        onSubmitProps.resetForm();
      } else if (res.status === 400) {
        window.alert(data.error);
      }
    } catch (err) {
      console.log(err);
    }
  };

  /* Login Control */

  const login = async (values, onSubmitProps) => {
    try {
      const res = await fetch(`${rootUrl}auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();
      onSubmitProps.resetForm();

      if (res.status === 200) {
        dispatch(
          setLogin({
            token: data.token,
            loggedInUser: data.loggedInUser,
          })
        );
        navigate("/");
      } else if (res.status === 400) {
        window.alert(data.error);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Formik
      validationSchema={isLogin ? loginSchema : registerSchema}
      initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
      onSubmit={async (values, onSubmitProps) => {
        if (isRegister) await register(values, onSubmitProps);
        if (isLogin) await login(values, onSubmitProps);
      }}
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
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.background.alt,
                "&:hover": { color: theme.palette.primary.main },
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
                color: theme.palette.primary.main,
                "&:hover": {
                  cursor: "pointer",
                  color: theme.palette.primary.light,
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
