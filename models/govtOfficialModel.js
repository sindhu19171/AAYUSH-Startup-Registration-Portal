const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    officialId: { 
        type: String,
        required: true, 
        unique: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    }
  });
  
  const GovernmentOfficial = mongoose.model('GovernmentOfficial', schema);