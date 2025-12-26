const express = require('express');
const router = express.Router();
const { uploadResume, getResumeAnalysis } = require('../controllers/resumeController');
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        const filetypes = /pdf/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only PDF files are allowed!'));
    }
});

// Create uploads folder if not exists (handled by fs Usually but good practice key create it)
const fs = require('fs');
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

router.post('/upload', protect, upload.single('resume'), uploadResume);
router.get('/analysis', protect, getResumeAnalysis);

module.exports = router;
