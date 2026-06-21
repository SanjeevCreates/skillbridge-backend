import express from 'express';
import multer from 'multer';
import path from 'path';
import { uploadResume, getResumeAnalysis } from '../controllers/resumeController.js';
import { protect } from '../middleware/authMiddleware.js';

// Configure Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `${req.user._id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const filetypes = /pdf|docx|doc|txt/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only document files (pdf, docx, doc, txt) are supported!'));
    }
  }
});

const router = express.Router();

// Upload is nested in protect middleware so req.user exists for filenames
router.post('/upload', protect, upload.single('resume'), uploadResume);
router.get('/analyze', protect, getResumeAnalysis);

export default router;
