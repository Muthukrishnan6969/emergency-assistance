const mongoose = require('mongoose');

const firstAidGuideSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    symptoms: {
      type: [String],
      default: [],
    },
    whatToDo: {
      type: [String],
      default: [],
    },
    whatNotToDo: {
      type: [String],
      default: [],
    },
    emergencyNumber: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('FirstAidGuide', firstAidGuideSchema);
