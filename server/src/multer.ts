import multer from "multer";
import path from "path";
import sanitize from "sanitize-filename";
import env from "./validEnv";

/**
 * Multer + Upload Setup
 */
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.join(env.UPLOADS_BASE_PATH, "uploads"));
  },
  filename: (req, file, callback) => {
    // Remove all spaces from the filename
    const noSpacesFilename = file.originalname.replace(/\s+/g, "_");
    const sanitizedFilename = sanitize(noSpacesFilename);
    callback(null, `${Date.now()}-${sanitizedFilename}`);
  },
});

export const multerUpload = multer({ storage });
