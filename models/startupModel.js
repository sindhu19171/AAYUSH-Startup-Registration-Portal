const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    ayushCategory: { 
        type: String,
        enum: ['Ayurveda', 'Yoga', 'Naturopathy', 'Unani', 'Siddha', 'Homoeopathy'], 
        required: true 
    },
    owner: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    documents: [{
      name: String,
      url: String,
    }],
    status: { 
        type: String, 
        enum: ['pending', 'approved', 'rejected'], 
        default: 'pending' 
    },
    rejectionReason: { 
        type: String 
    },
    updates: [{
      content: String,
      date: { type: Date, default: Date.now } 
    }],
    events: [{ 
        name: String, 
        date: Date, 
        description: String 
    }],
    submissionHistory: [{
        documents: [{ 
          name: String,
          url: String 
        }],
        status: String,
        rejectionReason: String,
        submittedAt: { type: Date, default: Date.now }
    }]
  },{timestamps:true});
  

const Startup = mongoose.model('Startup', schema);