const multer = require("multer");

const storage = multer.memoryStorage();

// PDF file filter for resumes
const pdfFileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed'), false);
    }
};

// Image file filter for profile pictures
const imageFileFilter = (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only image files (JPEG, PNG, GIF, WebP) are allowed'), false);
    }
};

// PDF upload middleware
const uploadPDF = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: pdfFileFilter
});

// Image upload middleware
const uploadImage = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: imageFileFilter
});

module.exports = { uploadPDF, uploadImage };