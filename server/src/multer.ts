import multer from "multer";
import path from "path";

/**
 * Multer + Upload Setup
 */
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.join(process.env.UPLOADS_BASE_PATH || "/var/www/bulentgercek.com/uploads"));
  },
  filename: (req, file, callback) => {
    callback(null, `${file.originalname}`);
  },
});

export const multerUpload = multer({ storage });
