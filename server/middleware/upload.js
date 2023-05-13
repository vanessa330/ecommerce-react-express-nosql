import multer from "multer";
// import * as fs from "fs";

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

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 } // 1MB
});

export default upload;
