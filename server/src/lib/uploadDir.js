const fs = require("fs");
const os = require("os");
const path = require("path");

const getBaseUploadDir = () => {
  if (process.env.VERCEL) {
    return path.join(os.tmpdir(), "forgelayer-uploads");
  }

  return path.join(process.cwd(), "uploads");
};

const getUploadDir = () => {
  const uploadDir = getBaseUploadDir();
  fs.mkdirSync(uploadDir, { recursive: true });
  return uploadDir;
};

module.exports = {
  getUploadDir
};
