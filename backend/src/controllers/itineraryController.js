const Itinerary = require('../models/Itinerary');
const geminiService = require('../services/geminiService');

/**
 * @desc    Upload booking document & extract details
 * @route   POST /api/itineraries/upload
 * @access  Private
 */
const uploadBookingDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a travel booking file (PDF or Image)' });
    }

    const file = req.file;
    const extractedData = await geminiService.extractBookingDetails(
      file.buffer,
      file.mimetype,
      file.originalname
    );

    return res.status(200).json({
      success: true,
      message: 'Travel booking details extracted successfully',
      data: extractedData,
    });
  } catch (error) {
    console.error('Error in uploadBookingDocument controller:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Generate and save a new itinerary
 * @route   POST /api/itineraries/generate
 * @access  Private
 */
const generateNewItinerary = async (req, res) => {
  try {
    const { title, destination, startDate, endDate, bookings } = req.body;

    if (!destination || !startDate || !endDate) {
      return res.status(400).json({ success: false, message: 'Please provide destination, start date and end date' });
    }

    // Call Gemini Service to generate full day-by-day activities
    const generatedData = await geminiService.generateItinerary(
      bookings || [],
      destination,
      startDate,
      endDate
    );

    // Save itinerary to database
    const newItinerary = new Itinerary({
      title: title || generatedData.title || `Trip to ${destination}`,
      destination: destination,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      owner: req.user._id,
      bookings: bookings || [],
      days: generatedData.days || [],
      isPublic: false,
    });

    const savedItinerary = await newItinerary.save();

    return res.status(201).json({
      success: true,
      message: 'Itinerary generated and saved successfully',
      data: savedItinerary,
    });
  } catch (error) {
    console.error('Error in generateNewItinerary controller:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get all itineraries for logged-in user
 * @route   GET /api/itineraries
 * @access  Private
 */
const getUserItineraries = async (req, res) => {
  try {
    const itineraries = await Itinerary.find({ owner: req.user._id }).sort({ createdAt: -1 });
    return res.json({
      success: true,
      count: itineraries.length,
      data: itineraries,
    });
  } catch (error) {
    console.error('Error in getUserItineraries controller:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get itinerary details by ID
 * @route   GET /api/itineraries/:id
 * @access  Private
 */
const getItineraryById = async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id);

    if (!itinerary) {
      return res.status(404).json({ success: false, message: 'Itinerary not found' });
    }

    // Check ownership
    if (itinerary.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this itinerary' });
    }

    return res.json({
      success: true,
      data: itinerary,
    });
  } catch (error) {
    console.error('Error in getItineraryById controller:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update an itinerary
 * @route   PUT /api/itineraries/:id
 * @access  Private
 */
const updateItinerary = async (req, res) => {
  try {
    let itinerary = await Itinerary.findById(req.params.id);

    if (!itinerary) {
      return res.status(404).json({ success: false, message: 'Itinerary not found' });
    }

    // Check ownership
    if (itinerary.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this itinerary' });
    }

    // Update fields
    const { title, destination, startDate, endDate, days, bookings, isPublic } = req.body;
    
    if (title !== undefined) itinerary.title = title;
    if (destination !== undefined) itinerary.destination = destination;
    if (startDate !== undefined) itinerary.startDate = new Date(startDate);
    if (endDate !== undefined) itinerary.endDate = new Date(endDate);
    if (days !== undefined) itinerary.days = days;
    if (bookings !== undefined) itinerary.bookings = bookings;
    if (isPublic !== undefined) itinerary.isPublic = isPublic;

    const updatedItinerary = await itinerary.save();

    return res.json({
      success: true,
      message: 'Itinerary updated successfully',
      data: updatedItinerary,
    });
  } catch (error) {
    console.error('Error in updateItinerary controller:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Delete an itinerary
 * @route   DELETE /api/itineraries/:id
 * @access  Private
 */
const deleteItinerary = async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id);

    if (!itinerary) {
      return res.status(404).json({ success: false, message: 'Itinerary not found' });
    }

    // Check ownership
    if (itinerary.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this itinerary' });
    }

    await itinerary.deleteOne();

    return res.json({
      success: true,
      message: 'Itinerary deleted successfully',
    });
  } catch (error) {
    console.error('Error in deleteItinerary controller:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Toggle itinerary sharing status
 * @route   POST /api/itineraries/:id/share
 * @access  Private
 */
const toggleShareItinerary = async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id);

    if (!itinerary) {
      return res.status(404).json({ success: false, message: 'Itinerary not found' });
    }

    // Check ownership
    if (itinerary.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to configure sharing' });
    }

    itinerary.isPublic = !itinerary.isPublic;
    await itinerary.save();

    return res.json({
      success: true,
      message: `Itinerary sharing ${itinerary.isPublic ? 'enabled' : 'disabled'} successfully`,
      data: {
        isPublic: itinerary.isPublic,
        shareId: itinerary.shareId,
      },
    });
  } catch (error) {
    console.error('Error in toggleShareItinerary controller:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get shared itinerary by share ID
 * @route   GET /api/itineraries/public/:shareId
 * @access  Public
 */
const getPublicItineraryByShareId = async (req, res) => {
  try {
    const itinerary = await Itinerary.findOne({ shareId: req.params.shareId });

    if (!itinerary) {
      return res.status(404).json({ success: false, message: 'Itinerary not found' });
    }

    // Check if it is indeed public
    if (!itinerary.isPublic) {
      return res.status(403).json({ success: false, message: 'This itinerary is private' });
    }

    return res.json({
      success: true,
      data: itinerary,
    });
  } catch (error) {
    console.error('Error in getPublicItineraryByShareId controller:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  uploadBookingDocument,
  generateNewItinerary,
  getUserItineraries,
  getItineraryById,
  updateItinerary,
  deleteItinerary,
  toggleShareItinerary,
  getPublicItineraryByShareId,
};
