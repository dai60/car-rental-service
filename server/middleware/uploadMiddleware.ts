import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: "public/",
    filename: (req, file, callback) => {
        callback(null, Date.now() + path.extname(file.originalname));
    },
});

export const upload = multer({ storage });
