const multerUpload = require("../config/multer");

/**
 * upload single file middleware
 * @param {String} fieldName
 * @returns (req: any, res: any, next: any) => void
 * @example app.post("/", uploadFile("image"), (req, res) => {...})
 */
const uploadFile = (fieldName) => (req, res, next) => {
  const upload = multerUpload.single(fieldName);
  upload(req, res, (error) => {
    if (error) {
      console.log(error);
      return res.status(400).send({
        message: `Une erreur s'est produite avec votre demande lors du 
        téléchargement du fichier; Veuillez réessayer`,
        success: false,
      });
    }
    next();
  });
};

module.exports = { uploadFile };
