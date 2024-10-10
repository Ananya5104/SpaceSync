const mongoose = require('mongoose');

const workspaceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'owners', 
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  
  amenities: {
    type: [String], 
  },
  pricing: {
    type: Number, 
    required: true,
  },
  dynamicPricing: {
    enabled: {
      type: Boolean,
      default: false,
    },
    peakHours: {
      type: [String], 
    },
    peakRate: {
      type: Number, 
      default: 0,
    },
  },
  availability: {
    type: Boolean,
    default: true, 
},
  bookingSchedule: [
    {
      startTime: Date,
      endTime: Date,
      bookedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users', 
    },
    },
  ],
  images: {
    type: Array,
    required: true 
  },
  description: {
    type: String, 
  },
}, { timestamps: true });

module.exports = mongoose.model('workspace', workspaceSchema);
