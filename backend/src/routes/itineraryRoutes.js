const express = require('express');
const router = express.Router();
const {
  uploadBookingDocument,
  generateNewItinerary,
  getUserItineraries,
  getItineraryById,
  updateItinerary,
  deleteItinerary,
  toggleShareItinerary,
  getPublicItineraryByShareId,
} = require('../controllers/itineraryController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public route for shared itineraries
router.get('/public/:shareId', getPublicItineraryByShareId);

// Protected routes (JWT required)
router.use(protect);

router.post('/upload', upload.single('file'), uploadBookingDocument);
router.post('/generate', generateNewItinerary);
router.get('/', getUserItineraries);
router.get('/:id', getItineraryById);
router.put('/:id', updateItinerary);
router.delete('/:id', deleteItinerary);
router.post('/:id/share', toggleShareItinerary);

module.exports = router;
