import { Box } from "@mui/material";

const Spinner = () => {
  return (
    <Box
      sx={{
        margin: "10rem",
        width: 10,
        height: 10,
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
    >
    </Box>
  );
};

export default Spinner;
