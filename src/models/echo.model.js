const mongoose = require('mongoose');

const echoSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['text', 'photo', 'video', 'voice'],
      required: true,
    },
    content: {
      type: String, // text message or file path for media
    },
    mediaUrl: {
      type: String, // full URL for media echoes
    },
    mediaMetadata: {
      filename: String,
      mimetype: String,
      size: Number,       // bytes
      duration: Number,   // seconds, for video/voice
    },
    deliverAt: {
      type: Date,
      required: [true, 'Delivery date is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'delivered', 'failed'],
      default: 'pending',
    },
    deliveredAt: {
      type: Date,
    },
    title: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

echoSchema.index({ user: 1, status: 1 });
echoSchema.index({ deliverAt: 1, status: 1 });

module.exports = mongoose.model('Echo', echoSchema);
