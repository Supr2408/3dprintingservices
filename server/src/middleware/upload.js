const path = require("path");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const ALLOWED_EXTENSIONS = new Set([".stl", ".obj", ".3mf", ".step", ".stp"]);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(process.cwd(), "uploads"));
  },
  filename: (_req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    cb(null, `${uuidv4()}${extension}`);
  }
});

const fileFilter = (_req, file, cb) => {
  const extension = path.extname(file.originalname).toLowerCase();
  if (!ALLOWED_EXTENSIONS.has(extension)) {
    cb(new Error("Invalid file type. Only .stl, .obj, .3mf, .step, .stp are allowed."));
    return;
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 }
});

module.exports = {
  upload,
  ALLOWED_EXTENSIONS
};
