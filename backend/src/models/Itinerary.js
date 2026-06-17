const mongoose = require('mongoose');
const crypto = require('crypto');

const activitySchema = new mongoose.Schema({
  time: { type: String, default: '' },
  activity: { type: String, required: true },
  location: { type: String, default: '' },
  notes: { type: String, default: '' },
});

const daySchema = new mongoose.Schema({
  dayNumber: { type: Number, required: true },
  date: { type: String, default: '' },
  activities: [activitySchema],
});

const bookingSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['flight', 'hotel', 'train', 'other'],
    required: true,
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  fileName: { type: String, default: '' },
  extractedText: { type: String, default: '' },
});

const itinerarySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add an itinerary title'],
      trim: true,
    },
    destination: {
      type: String,
      required: [true, 'Please add a destination'],
      trim: true,
    },
    startDate: {
      type: Date,
      required: [true, 'Please add a start date'],
    },
    endDate: {
      type: Date,
      required: [true, 'Please add an end date'],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    bookings: [bookingSchema],
    days: [daySchema],
    isPublic: {
      type: Boolean,
      default: false,
    },
    shareId: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to generate unique shareId
itinerarySchema.pre('save', function (next) {
  if (!this.shareId) {
    this.shareId = crypto.randomBytes(8).toString('hex');
  }
  next();
});

module.exports = mongoose.model('Itinerary', itinerarySchema);
