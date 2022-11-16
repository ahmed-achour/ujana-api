const multer = require("multer");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

const storage = multer.diskStorage({
  destination: (req, _file, callback) => {
    switch (req.baseUrl) {
      case "/products":
        callback(null, "public/products");
        break;
      default:
        callback(null, "public/imgs");
        break;
    }
  },
  filename: (_, file, cb) => {
    const name = file.originalname.split(" ").join("_");
    const extension = MIME_TYPES[file.mimetype];
    if (extension) {
      cb(
        null,
        name.substring(0, name.indexOf(".")) +
          "_" +
          Date.now() +
          "." +
          extension
      );
    } else {
      cb(new Error("File not Accepted."));
    }
  },
});

const upload = multer({
  storage: storage,
});

module.exports = upload;
