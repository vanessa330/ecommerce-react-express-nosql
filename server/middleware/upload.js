import multer from "multer";

// const DIRECTORY = process.env.UPLOAD_DIR || "public/assets";

/* FILE UPLOAD STORAGE ENGINE*/
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const location = "public/assets";
    cb(null, location);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

export default upload;
