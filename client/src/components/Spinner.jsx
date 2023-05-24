import { Box } from "@mui/material";

const Spinner = () => {
  return (
    <Box
      sx={{
        margin: "3rem auto",
        padding: "2rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "80px",
        height: "80px",
        border: "10px solid #f3f3f3",
        borderTop: "10px solid #383636",
        borderRadius: "50%",
        animation: "spinner 1.5s linear infinite",
      }}
      animation={{
        "@keyframes spinner": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      }}
    ></Box>
  );
};

export default Spinner;
