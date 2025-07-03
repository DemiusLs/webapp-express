import multer from "multer";
import slugify from "slugify";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/movies");
  },
  filename: (req, file, cb) => {
    const { title } = req.body;
    const fileName =
      Date.now() +
      "-" +
      (title &&
        slugify(title, {
          lower: true,
          strinct: true,
        })) +
      path.extname(file.originalname);
    console.log(fileName)

    cb(null, fileName);
  },
}
)



const upload = multer({ storage });

export default upload;