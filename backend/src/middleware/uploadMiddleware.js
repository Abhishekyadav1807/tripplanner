const multer = require('multer');

// Configure memory storage
const storage = multer.memoryStorage();

// File filter for travel booking docs (PDF and Images)
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/webp'
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF documents and image files (JPEG, PNG, WebP) are allowed!'), false);
  }
};

// Multer upload configurations (limits: 10MB)
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

module.exports = upload;
