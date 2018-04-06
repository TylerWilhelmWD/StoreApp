const uploads = (function() {
    const multer = require("multer");
    const storage = multer.diskStorage({
      destination: function(req, file, callback) {
        callback(null, "./uploads/");
      },
      filename: function(req, file, callback) {
        callback(
          null,
          new Date().toISOString().replace(/:/g, "-") + file.originalname
        );
      }
    });
    const fileFilter = (req, file, cb) => {
      // reject file
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif|JPG)$/)) {
        cb(new Error("Only Images Allowed!"), false);
      } else {
        cb(null, true);
      }
    };
    const uploads = multer({
      storage: storage,
      limits: { fileSize: 1024 * 1024 * 5 },
      fileFilter: fileFilter
    });
    return uploads;
  })();
  module.exports = uploads;