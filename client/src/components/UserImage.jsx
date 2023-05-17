import { Box } from "@mui/material";

const rootUrl = process.env.REACT_APP_SERVER_URL;

const UserImage = ({ image, size = "60px" }) => {
  return (
    <Box width={size} height={size}>
      <img
        style={{ objectFit: "cover", borderRadius: "50%" }}
        width={size}
        height={size}
        alt="userImage"
        src={`${rootUrl}assets/${image}`}
        crossOrigin="anonymous" // ERR_BLCKED_BY_RESPONSE.NotSameOrigin 200 (OK)
      />
    </Box>
  );
};

export default UserImage;
