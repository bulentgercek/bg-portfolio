import multer from "multer";
import path from "path";
import env from "./validEnv";

/**
 * Multer + Upload Setup
 */
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.join(env.UPLOADS_BASE_PATH, "uploads"));
  },
  filename: (req, file, callback) => {
    callback(null, `${Date.now()}-${file.originalname}`);
  },
});

export const multerUpload = multer({ storage });
