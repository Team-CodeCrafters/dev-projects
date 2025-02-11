import multer from 'multer';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}-${parseInt(Math.random() * 10000)}`,
    );
  },
});

export const upload = multer({ storage });
